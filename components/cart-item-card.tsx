"use client"

import type { CartItem } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Link from "next/link"

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex gap-4 border rounded-lg p-4">
      <Link href={`/product/${item.product.id}`} className="flex-shrink-0" prefetch={false}>
        <div className="relative w-24 h-32 rounded-md overflow-hidden bg-muted">
          <Image src={item.product.image || "/placeholder.svg"} alt={item.product.name} fill className="object-cover" />
        </div>
      </Link>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/product/${item.product.id}`} prefetch={false}>
            <h3 className="font-medium hover:underline">{item.product.name}</h3>
          </Link>
          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
            <span>Size: {item.size}</span>
            <span>Color: {item.color}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
            >
              -
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
            >
              +
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => removeFromCart(item.product.id, item.size, item.color)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
