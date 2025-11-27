"use client"

import { useCart } from "@/lib/cart-context"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export function CheckoutSummary() {
  const { cart, cartTotal } = useCart()

  const shipping = cartTotal > 50 ? 0 : 5.99
  const tax = cartTotal * 0.1
  const total = cartTotal + shipping + tax

  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-xl font-serif font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {cart.map((item, index) => (
          <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="flex gap-3">
            <div className="relative w-16 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={item.product.image || "/placeholder.svg"}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">{item.product.name}</h3>
              <p className="text-xs text-muted-foreground">
                {item.size} / {item.color}
              </p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <div className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">${total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  )
}
