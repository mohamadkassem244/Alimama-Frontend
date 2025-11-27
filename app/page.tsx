"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { CategoryFilter } from "@/components/category-filter"
import { InfiniteProductGrid } from "@/components/infinite-product-grid"
import { useSearchParams } from "next/navigation"
import { useCategories } from "@/lib/categories-provider"
import { useEffect, useState } from "react"

export default function HomePage() {
  const searchParams = useSearchParams()
  const { categories } = useCategories()
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [categoryName, setCategoryName] = useState<string>("All Products")

  useEffect(() => {
    const categorySlug = searchParams.get("category")

    console.log("[v0] Homepage - category slug from URL:", categorySlug)

    if (categorySlug && categories.length > 0) {
      // Find category by slug
      const findCategoryBySlug = (cats: any[], slug: string): any => {
        for (const cat of cats) {
          if (cat.slug === slug) return cat
          if (cat.subCategories && cat.subCategories.length > 0) {
            const found = findCategoryBySlug(cat.subCategories, slug)
            if (found) return found
          }
        }
        return null
      }

      const category = findCategoryBySlug(categories, categorySlug)
      console.log("[v0] Found category:", category)

      if (category) {
        setCategoryId(String(category.id))
        setCategoryName(category.name)
      } else {
        setCategoryId(undefined)
        setCategoryName("All Products")
      }
    } else {
      setCategoryId(undefined)
      setCategoryName("All Products")
    }
  }, [searchParams, categories])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative z-0">
        <HeroSection />

        <div className="w-full px-4 py-8">
          <div className="mb-6">
            <CategoryFilter />
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-semibold">{categoryName}</h2>
          </div>

          <InfiniteProductGrid key={categoryId || "all"} categoryId={categoryId} productsPerPage={12} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
