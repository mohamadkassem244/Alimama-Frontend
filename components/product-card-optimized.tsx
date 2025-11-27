"use client"

import Link from "next/link"
import type { Product } from "@/lib/types"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { TranslatedText } from "./translated-text"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCardOptimized({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // Use proxy for external images if available, otherwise direct URL
  const imageUrl =
    product.image && product.image.startsWith("http") && !imageError
      ? `/api/image-proxy?url=${encodeURIComponent(product.image)}`
      : product.image || "/diverse-products-still-life.png"

  const handleImageError = () => {
    console.log("[v0] Image failed to load:", product.image)
    setImageError(true)
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-shadow">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={imageError ? "/placeholder.svg?height=400&width=300&query=product" : imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={handleImageError}
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-semibold rounded">
              -{discount}%
            </div>
          )}
          {product.tags.includes("new arrival") && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 text-xs font-semibold rounded">
              NEW
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-sm mb-1 line-clamp-1">
            <TranslatedText text={product.name} />
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-current text-yellow-500" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
