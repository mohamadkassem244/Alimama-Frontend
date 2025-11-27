"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductCard } from "@/components/product-card"
import { fetchProductDetailsWithVariants, fetchProductsPage } from "@/services/product-service"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ProductPage() {
  const params = useParams()
  const productId = params?.id as string
  const [productData, setProductData] = useState<any>(null)
  const [variants, setVariants] = useState<any[]>([])
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<string[]>([])

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        console.error("[v0] Product ID is missing from URL params")
        setError("Product ID is missing")
        setLoading(false)
        return
      }

      try {
        console.log("[v0] Loading product details for ID:", productId)
        setLoading(true)
        setError(null)

        const response = await fetchProductDetailsWithVariants(productId)

        console.log("[v0] Product details with variants full response:", response)
        console.log("[v0] Response has data:", !!response.data)

        if (response.data) {
          console.log("[v0] Product data loaded successfully")
          setProductData(response.data.productData)
          setVariants(response.data.variants || [])
          setGalleryImages(response.data.productData.images || [])
          console.log("[v0] Variants loaded:", response.data.variants?.length || 0)
        } else if (response.error) {
          console.error("[v0] API returned error:", response.error)
          setError(`Failed to load product: ${response.error}`)
        } else {
          console.error("[v0] Product not found in API response")
          setError("Product not found")
        }

        const relatedResponse = await fetchProductsPage(1, 4)
        if (relatedResponse.data?.products) {
          setRelatedProducts(relatedResponse.data.products)
        }
      } catch (err) {
        console.error("[v0] Error loading product:", err)
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const handleVariantChange = useCallback(
    (variant: any | null) => {
      if (!productData) return
      if (variant?.variant_image) {
        const combined = [variant.variant_image, ...(productData.images || [])].filter(Boolean)
        const uniqueImages = Array.from(new Set(combined))
        setGalleryImages(uniqueImages as string[])
      } else {
        setGalleryImages(productData.images || [])
      }
    },
    [productData],
  )

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-2xl font-semibold mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-4">{error || "The product you are looking for does not exist."}</p>
            <p className="text-sm text-gray-500 mb-4">Product ID: {productId}</p>
            <a href="/" className="inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
              Return to homepage
            </a>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="px-4 py-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <ProductImageGallery
              images={galleryImages.length > 0 ? galleryImages : productData.images || []}
              name={productData.title_en || productData.title_zh || "Product"}
              videoUrl={productData.video_url || undefined}
            />
            <ProductInfo productData={productData} variants={variants} onVariantChange={handleVariantChange} />
          </div>

          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
