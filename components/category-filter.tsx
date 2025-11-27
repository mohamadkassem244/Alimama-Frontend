"use client"

import { Button } from "@/components/ui/button"
import { useCategories } from "@/lib/categories-provider"
// </CHANGE>
import { useSearchParams, useRouter } from "next/navigation"

export function CategoryFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentCategory = searchParams.get("category")
  const { categories } = useCategories()
  // </CHANGE>

  const handleCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }
    params.delete("tag") // Clear tag filter when changing category
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        variant={!currentCategory ? "default" : "outline"}
        size="sm"
        onClick={() => handleCategoryClick(null)}
        className="whitespace-nowrap"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={currentCategory === category.slug ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(category.slug)}
          className="whitespace-nowrap"
        >
          {category.name}
        </Button>
      ))}
      {/* </CHANGE> */}
    </div>
  )
}
