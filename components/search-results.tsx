"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { searchProducts, type SearchItem } from "@/services/search-service"
import Link from "next/link"
import { Package, ShoppingBag } from "lucide-react"

interface SearchResultsProps {
  searchQuery: string
}

export function SearchResults({ searchQuery }: SearchResultsProps) {
  const [items, setItems] = useState<SearchItem[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const loaderRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // Reset state when search query changes
  useEffect(() => {
    console.log("[v0] Search query changed:", searchQuery)
    setItems([])
    setPage(1)
    setHasMore(true)
    setTotal(0)
    setError(null)
  }, [searchQuery])

  // Fetch search results
  const fetchResults = useCallback(async () => {
    if (!searchQuery || loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Fetching search results:", { searchQuery, page })
      const response = await searchProducts(searchQuery, page, 20)

      if (response.success) {
        setItems((prev) => (page === 1 ? response.items : [...prev, ...response.items]))
        setTotal(response.total)
        setHasMore(response.has_next_page)
        console.log("[v0] Search results loaded:", {
          itemsCount: response.items.length,
          totalResults: response.total,
          hasMore: response.has_next_page,
        })
      }
    } catch (err) {
      console.error("[v0] Error fetching search results:", err)
      setError("Failed to load search results. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [searchQuery, page, loading, hasMore])

  // Fetch on mount and when page changes
  useEffect(() => {
    if (searchQuery) {
      fetchResults()
    }
  }, [searchQuery, page])

  // Infinite scroll observer
  useEffect(() => {
    if (!triggerRef.current || !hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log("[v0] Trigger intersecting, loading more results")
          setPage((prev) => prev + 1)
        }
      },
      { rootMargin: "800px" },
    )

    observer.observe(triggerRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading])

  if (!searchQuery) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Enter a search term to find products</p>
      </div>
    )
  }

  if (error && items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (!loading && items.length === 0 && page === 1) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {total > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing {items.length} of {total.toLocaleString()} results
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            key={item.item_id}
            href={`/product/${item.item_id}`}
            className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            prefetch={false}
          >
            <div className="aspect-square relative bg-muted overflow-hidden">
              <img
                src={item.img || "/placeholder.svg?height=400&width=400"}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=400&width=400"
                }}
              />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-medium text-sm line-clamp-2 min-h-[40px]">{item.title}</h3>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">¥{item.price}</span>
                {item.goods_score && <span className="text-sm text-muted-foreground">★ {item.goods_score}</span>}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {item.sale_info?.sale_quantity_90days && (
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="h-3 w-3" />
                    <span>{item.sale_info.sale_quantity_90days} sold</span>
                  </div>
                )}
                {item.quantity_begin && (
                  <div className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    <span>Min: {item.quantity_begin}</span>
                  </div>
                )}
              </div>

              {item.shop_info?.company_name && (
                <p className="text-xs text-muted-foreground truncate">{item.shop_info.company_name}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Trigger element for infinite scroll */}
      {hasMore && items.length >= 12 && (
        <div ref={triggerRef} className="h-20 flex items-center justify-center">
          {loading && <p className="text-sm text-muted-foreground">Loading more results...</p>}
        </div>
      )}

      {/* Loader at bottom */}
      {loading && (
        <div ref={loaderRef} className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {!hasMore && items.length > 0 && <p className="text-center text-sm text-muted-foreground py-8">End of results</p>}
    </div>
  )
}
