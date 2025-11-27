import type { ApiCategoryResponse, ApiCategory, Category, SubCategory, SubSubCategory } from "@/lib/types"
import { apiFetch, clientApiFetch } from "./api-client"
import { categoryTree } from "@/lib/categories"

// Transform API category to our app format
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function transformApiCategory(apiCategory: ApiCategory): Category | null {
  // Only process level 0 (main categories)
  if (apiCategory.level !== 0) return null

  const subCategories: SubCategory[] = apiCategory.children
    .filter((child) => child.level === 1)
    .map((subCat) => {
      const subSubCategories: SubSubCategory[] = subCat.children
        .filter((child) => child.level === 2)
        .map((subSubCat) => ({
          id: subSubCat.id.toString(),
          name: subSubCat.category_name,
          slug: createSlug(subSubCat.category_name),
        }))

      return {
        id: subCat.id.toString(),
        name: subCat.category_name,
        slug: createSlug(subCat.category_name),
        subSubCategories,
      }
    })

  return {
    id: apiCategory.id.toString(),
    name: apiCategory.category_name,
    slug: createSlug(apiCategory.category_name),
    subCategories,
  }
}

// Server-side category fetch
export async function fetchCategories(): Promise<Category[]> {
  console.log("[v0] Fetching categories from API (server-side)...")

  const response = await apiFetch<ApiCategoryResponse>("/v2_0_0-category/tree")

  if (!response.success || !response.data) {
    console.error("[v0] Failed to fetch categories:", response.error)
    console.log("[v0] Using fallback categories")
    return categoryTree
  }

  const categories = response.data.tree.map(transformApiCategory).filter((cat): cat is Category => cat !== null)

  console.log("[v0] Transformed categories count:", categories.length)

  if (categories.length === 0) {
    console.log("[v0] No categories from API, using fallback")
    return categoryTree
  }

  return categories
}

// Client-side category fetch
export async function fetchCategoriesClient(): Promise<Category[]> {
  console.log("[v0] Fetching categories from API (client-side)...")

  const response = await clientApiFetch<ApiCategoryResponse>("/v2_0_0-category/tree")

  if (!response.success || !response.data) {
    console.error("[v0] Failed to fetch categories:", response.error)
    console.log("[v0] Using fallback categories")
    return categoryTree
  }

  const categories = response.data.tree.map(transformApiCategory).filter((cat): cat is Category => cat !== null)

  console.log("[v0] Transformed categories count:", categories.length)

  if (categories.length === 0) {
    console.log("[v0] No categories from API, using fallback")
    return categoryTree
  }

  return categories
}

// Helper function to get all category paths
export function getAllCategoryPaths(categories: Category[]): string[] {
  const paths: string[] = []

  categories.forEach((category) => {
    paths.push(category.slug)
    category.subCategories.forEach((sub) => {
      paths.push(`${category.slug}/${sub.slug}`)
      sub.subSubCategories.forEach((subSub) => {
        paths.push(`${category.slug}/${sub.slug}/${subSub.slug}`)
      })
    })
  })

  return paths
}

// Helper function to find category by path
export function findCategoryByPath(categories: Category[], path: string) {
  const parts = path.split("/")

  if (parts.length === 1) {
    return categories.find((c) => c.slug === parts[0])
  } else if (parts.length === 2) {
    const category = categories.find((c) => c.slug === parts[0])
    return category?.subCategories.find((s) => s.slug === parts[1])
  } else if (parts.length === 3) {
    const category = categories.find((c) => c.slug === parts[0])
    const subCategory = category?.subCategories.find((s) => s.slug === parts[1])
    return subCategory?.subSubCategories.find((ss) => ss.slug === parts[2])
  }

  return null
}
