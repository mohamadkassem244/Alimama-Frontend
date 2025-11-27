import { NextResponse } from "next/server"

const API_BASE_URL = "https://cms2.devback.website"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get("page") || "1"
  const limit = searchParams.get("limit") || "12"
  const categoryId = searchParams.get("category_id")

  try {
    let url = `${API_BASE_URL}/v2_0_0-products/get-product-main-info?page=${page}&limit=${limit}`
    if (categoryId) {
      url += `&category_id=${categoryId}`
    }

    console.log("[v0] Proxying product request to:", url)

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()
    const exchangeRate = Number(data?.exchange_rate?.rate)

    const convertWithRate = (value: unknown, rate: number) => {
      if (typeof value === "number") {
        return Number((value * rate).toFixed(2))
      }
      if (typeof value === "string") {
        const parsed = Number(value)
        if (!Number.isNaN(parsed)) {
          return Number((parsed * rate).toFixed(2))
        }
      }
      return null
    }

    const transformedProducts = Array.isArray(data?.data)
      ? data.data.map((product: Record<string, unknown>) => {
          if (!Number.isFinite(exchangeRate)) {
            return product
          }

          const priceUsd = convertWithRate(product?.product_price ?? product?.price, exchangeRate)
          const originalPriceUsd = convertWithRate(
            product?.original_price ?? product?.originalPrice,
            exchangeRate,
          )

          return {
            ...product,
            product_price_usd: priceUsd ?? product?.product_price ?? product?.price,
            original_price_usd: originalPriceUsd ?? product?.original_price ?? product?.originalPrice,
          }
        })
      : data?.data

    return NextResponse.json({
      ...data,
      data: transformedProducts,
      currency: "USD",
      exchange_rate: data?.exchange_rate,
    })
  } catch (error) {
    console.error("[v0] Product API proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
