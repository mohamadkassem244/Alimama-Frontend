import type { ApiCategoryResponse, ApiCategory, Category, SubCategory, SubSubCategory } from "@/lib/types"

const API_BASE_URL = "https://cms2.devback.website"

// Fetch categories from API
export async function fetchCategoriesFromApi(): Promise<ApiCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v2_0_0-category/tree`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }

    const data: ApiCategoryResponse = await response.json()
    return data.tree
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return []
  }
}

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

export async function getCategoryTree(): Promise<Category[]> {
  const apiCategories = await fetchCategoriesFromApi()

  return apiCategories.map(transformApiCategory).filter((cat): cat is Category => cat !== null)
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
