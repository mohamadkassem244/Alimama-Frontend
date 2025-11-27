import { getCategoryTree } from "@/lib/api/categories"
import { CategoryMegaMenuClient } from "@/components/category-mega-menu-client"

export async function CategoryMegaMenu() {
  const categories = await getCategoryTree()

  return <CategoryMegaMenuClient categories={categories} />
}
