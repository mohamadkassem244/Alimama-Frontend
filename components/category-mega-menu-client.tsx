"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Category } from "@/lib/types"

interface CategoryMegaMenuClientProps {
  categories: Category[]
}

export function CategoryMegaMenuClient({ categories }: CategoryMegaMenuClientProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)

  return (
    <div className="border-b bg-background">
      <div className="container">
        <nav className="flex items-center justify-center gap-8 py-3 flex-wrap">
          {categories.slice(0, 8).map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setActiveCategoryId(category.id)}
              onMouseLeave={() => setActiveCategoryId((prev) => (prev === category.id ? null : prev))}
            >
              <Link
                href={`/category/${category.slug}`}
                className="text-sm font-medium hover:text-primary transition-colors"
                prefetch={false}
              >
                {category.name}
              </Link>

              {category.subCategories.length > 0 && (
                <div
                  className={`absolute left-0 top-full transition-all duration-200 z-50 ${
                    activeCategoryId === category.id
                      ? "opacity-100 visible pointer-events-auto"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
                >
                  <div className="bg-background border rounded-lg shadow-lg p-6 min-w-[600px] max-w-[800px]">
                    <div className="grid grid-cols-3 gap-6">
                      {category.subCategories.slice(0, 9).map((subCategory) => (
                        <div key={subCategory.id}>
                          <Link
                            href={`/category/${category.slug}/${subCategory.slug}`}
                            className="font-semibold text-sm hover:text-primary transition-colors mb-3 block"
                            prefetch={false}
                          >
                            {subCategory.name}
                          </Link>
                          {subCategory.subSubCategories.length > 0 && (
                            <ul className="space-y-2">
                              {subCategory.subSubCategories.slice(0, 6).map((subSubCategory) => (
                                <li key={subSubCategory.id}>
                                  <Link
                                    href={`/category/${category.slug}/${subCategory.slug}/${subSubCategory.slug}`}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                    prefetch={false}
                                  >
                                    {subSubCategory.name}
                                    <ChevronRight className="h-3 w-3" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}


