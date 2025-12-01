"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { fetchProductsPage, fetchProductsByCategoryPage } from "@/services/product-service"

interface InfiniteProductGridProps {
  initialProducts?: Product[]
  productsPerPage?: number
  categoryId?: string
}

export function InfiniteProductGrid({
  initialProducts = [],
  productsPerPage = 12,
  categoryId,
}: InfiniteProductGridProps) {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)
  const triggerRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Start with page 1
    loadInitialProducts()
  }, [categoryId])

  const loadInitialProducts = async () => {
    setLoading(true)
    setError(null)
    console.log("[v0] Loading initial products, categoryId:", categoryId)

    try {
      const response = categoryId
        ? await fetchProductsByCategoryPage(categoryId, 1, productsPerPage)
        : await fetchProductsPage(1, productsPerPage)

      console.log("[v0] Initial products response:", response)

      if (response.data && response.data.products) {
        console.log("[v0] Loaded products:", response.data.products.length)
        setDisplayedProducts(response.data.products)
        setHasMore(response.data.hasMore)
        setTotalCount(response.data.total || response.data.products.length)
        setPage(2) // Next page will be 2
      } else {
        console.log("[v0] No products found in response")
        setDisplayedProducts([])
        setHasMore(false)
        setTotalCount(0)
      }
    } catch (err) {
      console.error("[v0] Error loading initial products:", err)
      setError("Failed to load products")
      setDisplayedProducts([])
      setHasMore(false)
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)
    console.log("[v0] Loading more products, page:", page, "categoryId:", categoryId)

    try {
      const response = categoryId
        ? await fetchProductsByCategoryPage(categoryId, page, productsPerPage)
        : await fetchProductsPage(page, productsPerPage)

      if (response.data && response.data.products) {
        const newProducts = response.data.products
        console.log("[v0] Loaded more products:", newProducts.length)
        console.log("[v0] Has more pages:", response.data.hasMore)
        console.log("[v0] Current page:", response.data.page)
        console.log("[v0] Total products:", response.data.total)

        if (newProducts.length > 0) {
          setDisplayedProducts((prev) => {
            const updated = [...prev, ...newProducts]
            setTotalCount(response.data?.total || updated.length)
            return updated
          })
          setPage((prev) => prev + 1)
          setHasMore(response.data?.hasMore ?? false)
        } else {
          console.log("[v0] No new products, setting hasMore to false")
          setHasMore(false)
        }
      } else {
        console.log("[v0] No data in response, setting hasMore to false")
        setHasMore(false)
      }
    } catch (err) {
      console.error("[v0] Error loading more products:", err)
      setError("Failed to load more products")
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, categoryId, productsPerPage])

  useEffect(() => {
    if (!hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading) {
          console.log("[v0] Trigger element visible, loading more products...")
          loadMore()
        }
      },
      {
        root: null,
        rootMargin: "1000px", // Trigger loading 1000px before the trigger element is visible (very early)
        threshold: 0,
      },
    )

    const currentTrigger = triggerRef.current
    if (currentTrigger) {
      observer.observe(currentTrigger)
      console.log("[v0] IntersectionObserver set up for trigger element")
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger)
      }
    }
  }, [hasMore, loading, loadMore])

  return (
    <div>
      {!loading && displayedProducts.length > 0 && (
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {displayedProducts.length} of {totalCount} products
        </div>
      )}

      {/* Products Grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedProducts.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
          {/* Trigger element placed after 2nd row (8 products = 2 rows on desktop) for faster loading */}
          {/* With 1000px rootMargin, this will trigger as soon as 2nd row becomes visible */}
          {hasMore && (
            <div
              ref={triggerRef}
              className="col-span-full h-1 w-full"
              style={{ 
                minHeight: "1px",
                marginTop: displayedProducts.length >= 8 ? "-1rem" : "0"
              }}
              aria-hidden="true"
            />
          )}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No products found in this category</p>
            <p className="text-sm text-muted-foreground">Try browsing other categories or check back later</p>
          </div>
        )
      )}

      {/* Loading indicator */}
      <div ref={loaderRef} className="flex justify-center py-8">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more products...</span>
          </div>
        )}
        {error && <p className="text-destructive text-sm">{error}</p>}
        {!hasMore && displayedProducts.length > 0 && (
          <p className="text-muted-foreground text-sm">You've reached the end</p>
        )}
      </div>
    </div>
  )
}
