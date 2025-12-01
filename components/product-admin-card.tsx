import Image from "next/image"
import type { Product } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

interface ProductAdminCardProps {
  product: Product
}

export function ProductAdminCard({ product }: ProductAdminCardProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <div className="relative w-24 h-32 rounded overflow-hidden bg-muted flex-shrink-0">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <Link href={`/product/${product.id}`} prefetch={false}>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Price</p>
              <p className="font-semibold">${product.price}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Stock</p>
              <p className="font-semibold">{product.inStock ? "In Stock" : "Out of Stock"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rating</p>
              <p className="font-semibold">{product.rating} / 5</p>
            </div>
            <div>
              <p className="text-muted-foreground">Reviews</p>
              <p className="font-semibold">{product.reviews}</p>
            </div>
          </div>

          {product.tags.length > 0 && (
            <div className="flex gap-2 mt-3">
              {product.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
