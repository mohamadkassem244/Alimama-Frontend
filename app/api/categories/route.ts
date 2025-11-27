import { NextResponse } from "next/server"
import { fetchCategories } from "@/services/category-service"

// API route to fetch categories (acts as a proxy to handle CORS)
export async function GET() {
  try {
    console.log("[v0] API route /api/categories called")

    const categories = await fetchCategories()

    console.log("[v0] API route returning categories:", categories.length)

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("[v0] API route error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch categories",
      },
      { status: 500 },
    )
  }
}
