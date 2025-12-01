"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useCategories } from "@/lib/categories-provider"
import { InfiniteProductGrid } from "@/components/infinite-product-grid"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Category } from "@/lib/types"

interface CategoryPageClientProps {
  slugParts: string[]
}

export function CategoryPageClient({ slugParts }: CategoryPageClientProps) {
  const { categories, loading: categoriesLoading } = useCategories()
  const [categoryInfo, setCategoryInfo] = useState<{ name: string; id: string | number } | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!categoriesLoading && categories.length > 0) {
      console.log("[v0] Finding category for slug:", slugParts)

      let foundCategory: Category | null = null

      if (slugParts.length === 1) {
        foundCategory = categories.find((c) => c.slug === slugParts[0]) || null
      } else if (slugParts.length === 2) {
        const cat = categories.find((c) => c.slug === slugParts[0])
        foundCategory = cat?.subCategories.find((s) => s.slug === slugParts[1]) || null
      } else if (slugParts.length === 3) {
        const cat = categories.find((c) => c.slug === slugParts[0])
        const sub = cat?.subCategories.find((s) => s.slug === slugParts[1])
        foundCategory = sub?.subSubCategories?.find((ss) => ss.slug === slugParts[2]) || null
      }

      if (foundCategory) {
        console.log("[v0] Found category:", foundCategory.name, "ID:", foundCategory.id)
        setCategoryInfo({ name: foundCategory.name, id: foundCategory.id })
        setNotFound(false)
      } else {
        console.log("[v0] Category not found for slug:", slugParts)
        setNotFound(true)
      }
    }
  }, [categories, categoriesLoading, slugParts])

  const breadcrumbs = useMemo(() => {
    return slugParts.map((slug, index) => {
      const path = slugParts.slice(0, index + 1).join("/")
      let name = slug

      if (index === 0) {
        name = categories.find((c) => c.slug === slug)?.name || slug
      } else if (index === 1) {
        const cat = categories.find((c) => c.slug === slugParts[0])
        name = cat?.subCategories.find((s) => s.slug === slug)?.name || slug
      } else if (index === 2) {
        const cat = categories.find((c) => c.slug === slugParts[0])
        const sub = cat?.subCategories.find((s) => s.slug === slugParts[1])
        name = sub?.subSubCategories?.find((ss) => ss.slug === slug)?.name || slug
      }

      return { path, name, isLast: index === slugParts.length - 1 }
    })
  }, [categories, slugParts])

  if (categoriesLoading || !categoryInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist.</p>
            <Link href="/" className="text-primary hover:underline">
              Browse all products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="px-4 py-8 max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            {breadcrumbs.map((crumb) => (
              <div key={crumb.path} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                {crumb.isLast ? (
                  <span className="text-foreground font-medium">{crumb.name}</span>
                ) : (
                  <Link href={`/category/${crumb.path}`} className="hover:text-foreground" prefetch={false}>
                    {crumb.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{categoryInfo.name}</h1>
          </div>

          {/* Products Grid with API-based infinite scroll */}
          <InfiniteProductGrid categoryId={String(categoryInfo.id)} productsPerPage={12} />
        </div>
      </main>
      <Footer />
    </div>
  )
}





