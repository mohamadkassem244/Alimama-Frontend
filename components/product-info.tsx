"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Store, Truck, Package, MapPin, ShoppingBag, Heart, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TranslatedText } from "./translated-text"
import type { ProductDetailResponse, ProductVariant } from "@/services/product-service"

interface ProductInfoProps {
  productData: ProductDetailResponse["data"]
  variants?: ProductVariant[]
  onVariantChange?: (variant: ProductVariant | null) => void
}

export function ProductInfo({ productData, variants = [], onVariantChange }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null,
  )
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const router = useRouter()

  const priceInfo = productData.raw_data?.price_info
  const tieredPricing = productData.raw_data?.tiered_price_info
  const shopInfo = productData.raw_data?.shop_info
  const deliveryInfo = productData.raw_data?.delivery_info

  useEffect(() => {
    onVariantChange?.(selectedVariant)
  }, [selectedVariant, onVariantChange])

  const currentPrice = selectedVariant
    ? Number.parseFloat(selectedVariant.sale_price || selectedVariant.origin_price || "0")
    : Number.parseFloat(priceInfo?.price || productData.origin_price || "0")

  const minPrice = Number.parseFloat(priceInfo?.price_min || productData.origin_price_min || "0")
  const maxPrice = Number.parseFloat(priceInfo?.price_max || productData.origin_price_max || "0")

  const handleAddToCart = () => {
    const product = {
      id: String(productData.product_id),
      name: productData.title_en || productData.title_zh || "Product",
      price: currentPrice,
      image: selectedVariant?.variant_image || productData.images?.[0] || "",
      images: productData.images || [],
      category: { id: productData.category_id, name: "Category", slug: "category", subCategories: [] },
      description: productData.description_en || productData.description_zh || "",
      sizes: ["One Size"],
      colors: ["Default"],
      inStock: (selectedVariant?.stock || productData.total_stock) > 0,
      rating: 4.5,
      reviews: productData.sale_count,
      tags: [],
    }
    addToCart(product, "One Size", "Default", quantity)
    router.push("/cart")
  }

  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : productData.is_sold_out === 1
  const availableStock = selectedVariant ? selectedVariant.stock : productData.total_stock

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">
          <TranslatedText text={productData.title_en || productData.title_zh || "Product"} as="span" />
        </h1>

        {productData.raw_data?.title && productData.title_en !== productData.raw_data.title && (
          <p className="text-sm text-muted-foreground mb-4">
            <TranslatedText text={productData.raw_data.title} />
          </p>
        )}

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-bold text-primary">
            {productData.currency} {currentPrice.toFixed(2)}
          </span>
          {selectedVariant?.previous_origin_price && (
            <span className="text-xl text-muted-foreground line-through">
              {productData.currency} {Number.parseFloat(selectedVariant.previous_origin_price).toFixed(2)}
            </span>
          )}
          {!selectedVariant && maxPrice > minPrice && (
            <span className="text-lg text-muted-foreground">
              - {productData.currency} {maxPrice.toFixed(2)}
            </span>
          )}
        </div>

        {tieredPricing && tieredPricing.prices && tieredPricing.prices.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2 text-sm">Bulk Pricing</h3>
            <div className="space-y-1">
              {tieredPricing.prices.map((tier, idx) => (
                <div key={idx} className="text-sm flex justify-between">
                  <span>
                    {tier.beginAmount}+ {productData.offer_unit}
                  </span>
                  <span className="font-semibold">
                    {productData.currency} {tier.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <span>{(selectedVariant?.sale_count || productData.sale_count).toLocaleString()} sold</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>
              Min. order: {tieredPricing?.begin_num || 1} {productData.offer_unit}
            </span>
          </div>
          {availableStock > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">{availableStock.toLocaleString()} in stock</span>
            </div>
          )}
          {isOutOfStock && <span className="text-destructive font-medium text-sm">Sold Out</span>}
        </div>

        {productData.original_currency && productData.exchange_rate && (
          <p className="text-xs text-muted-foreground">
            Converted from {productData.original_currency} using rate{" "}
            {productData.exchange_rate.rate} ({productData.exchange_rate.updated_at}).
          </p>
        )}
      </div>

      {productData.description_en || productData.description_zh ? (
        <div className="border-t pt-6">
          <p className="text-muted-foreground leading-relaxed">
            <TranslatedText text={productData.description_en || productData.description_zh || ""} />
          </p>
        </div>
      ) : null}

      {productData.product_props && productData.product_props.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3">Product Specifications</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {productData.product_props.map((prop, idx) => {
              const [key, value] = Object.entries(prop)[0]
              return (
                <div key={idx} className="flex gap-2">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {variants.length > 0 && (
        <div className="space-y-4 border-t pt-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">Select Variant</Label>
            <RadioGroup
              value={selectedVariant?.id.toString() || ""}
              onValueChange={(value) => {
                const variant = variants.find((v) => v.id.toString() === value)
                setSelectedVariant(variant || null)
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {variants.map((variant) => (
                  <div key={variant.id} className="relative">
                    <RadioGroupItem
                      value={variant.id.toString()}
                      id={`variant-${variant.id}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`variant-${variant.id}`}
                      className="flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary hover:border-primary transition-all"
                    >
                      {variant.variant_image && (
                        <img
                          src={variant.variant_image || "/placeholder.svg"}
                          alt={variant.variant_name}
                          className="h-16 w-16 object-cover rounded"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      )}
                      <div className="text-center">
                        <div className="text-sm font-medium">{variant.variant_name}</div>
                        <div className="text-xs text-primary font-semibold mt-1">
                          {productData.currency} {Number.parseFloat(variant.sale_price).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">Stock: {variant.stock.toLocaleString()}</div>
                      </div>
                    </Label>
                    {variant.stock <= 0 && (
                      <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-destructive">Out of Stock</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      )}

      <div className="border-t pt-6">
        <Label className="text-base font-semibold mb-3 block">Quantity</Label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(tieredPricing?.begin_num || 1, quantity - 1))}
          >
            -
          </Button>
          <span className="text-lg font-medium w-16 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
            disabled={quantity >= availableStock}
          >
            +
          </Button>
          <span className="text-sm text-muted-foreground ml-2">{productData.offer_unit}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isOutOfStock}>
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button size="lg" variant="outline">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {shopInfo && (
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Store className="h-5 w-5" />
            Seller Information
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Shop:</span>{" "}
              <a
                href={shopInfo.shop_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {shopInfo.shop_name}
              </a>
            </div>
            <div>
              <span className="text-muted-foreground">Seller ID:</span> {shopInfo.seller_login_id}
            </div>
          </div>
        </div>
      )}

      {deliveryInfo && (
        <div className="border-t pt-6 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>Ships from: {deliveryInfo.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <span>
              Delivery fee: {productData.currency} {deliveryInfo.delivery_fee}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span>Unit weight: {deliveryInfo.unit_weight} kg</span>
          </div>
        </div>
      )}

      {productData.video_url && (
        <div className="border-t pt-6">
          <a
            href={productData.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Video className="h-5 w-5" />
            Watch Product Video
          </a>
        </div>
      )}
    </div>
  )
}
