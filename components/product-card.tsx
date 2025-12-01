"use client"

import Link from "next/link"
import type { Product } from "@/lib/types"
import { ShoppingBag, Package } from "lucide-react"
import { Card } from "@/components/ui/card"
import { TranslatedText } from "./translated-text"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(product.image || "/placeholder.svg?height=400&width=300")

  const extendedProduct = product as Product & {
    product_price_usd?: number
    original_price_usd?: number
    product_price?: number | string
    original_price?: number | string
    exchange_rate?: { rate?: number | string }
    exchangeRate?: { rate?: number | string } | number
  }

  const rawExchangeRate =
    Number((extendedProduct.exchange_rate?.rate as number | string | undefined) ?? 0) ||
    Number((extendedProduct.exchangeRate as { rate?: number | string })?.rate ?? 0) ||
    (typeof extendedProduct.exchangeRate === "number" ? extendedProduct.exchangeRate : 0)

  const parseNumeric = (value: number | string | undefined | null) => {
    if (typeof value === "number") return value
    if (typeof value === "string") {
      const parsed = Number(value)
      return Number.isNaN(parsed) ? null : parsed
    }
    return null
  }

  const convertWithRate = (value: number | string | undefined | null) => {
    if (!rawExchangeRate) return null
    const numericValue = parseNumeric(value)
    if (numericValue == null) return null
    return Number((numericValue * rawExchangeRate).toFixed(2))
  }

  const normalizedPrice =
    extendedProduct.product_price_usd ??
    convertWithRate(extendedProduct.product_price) ??
    product.price

  const normalizedOriginalPrice =
    extendedProduct.original_price_usd ??
    convertWithRate(extendedProduct.original_price) ??
    product.originalPrice

  const price = Number(normalizedPrice ?? 0)
  const originalPrice =
    normalizedOriginalPrice !== undefined && normalizedOriginalPrice !== null
      ? Number(normalizedOriginalPrice)
      : undefined

  const discount =
    originalPrice && originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const handleImageError = () => {
    console.log("[v0] Image failed to load:", product.image)
    setImageError(true)
    setImageSrc("/diverse-products-still-life.png")
  }

  return (
    <Link href={`/product/${product.id}`} prefetch={false}>
      <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-shadow">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            crossOrigin="anonymous"
            onError={handleImageError}
            referrerPolicy="no-referrer"
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
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <ShoppingBag className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{(product as any).salesCount || 0} sold</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Min: {(product as any).quantityBegin || 1}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">${price.toFixed(2)}</span>
            {originalPrice !== undefined && (
              <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
