"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { categoryTree } from "@/lib/categories"

export function MegaMenu() {
  return (
    <div className="border-b bg-background">
      <div className="container">
        <nav className="flex items-center justify-center gap-8 py-3">
          {categoryTree.map((category) => (
            <div key={category.id} className="group relative">
              <Link
                href={`/category/${category.slug}`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {category.name}
              </Link>

              {/* Mega Menu Dropdown */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-background border rounded-lg shadow-lg p-6 w-[600px]">
                  <div className="grid grid-cols-3 gap-6">
                    {category.subCategories.map((subCategory) => (
                      <div key={subCategory.id}>
                        <Link
                          href={`/category/${category.slug}/${subCategory.slug}`}
                          className="font-semibold text-sm hover:text-primary transition-colors mb-3 block"
                        >
                          {subCategory.name}
                        </Link>
                        <ul className="space-y-2">
                          {subCategory.subSubCategories.map((subSubCategory) => (
                            <li key={subSubCategory.id}>
                              <Link
                                href={`/category/${category.slug}/${subCategory.slug}/${subSubCategory.slug}`}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                              >
                                {subSubCategory.name}
                                <ChevronRight className="h-3 w-3" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
