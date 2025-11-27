import { apiClient } from "./api-client"

export interface SearchItem {
  item_id: number
  product_url: string
  title: string
  title_origin: string
  img: string
  price: string
  price_info: {
    price: string
    price_min: string
    price_max: string
  }
  currency: string
  quantity_begin: string
  sale_info: {
    sale_quantity_90days: string
  }
  goods_score: string
  delivery_info: {
    area_from: string[]
    free_shipping: boolean
    ship_in_48h: boolean
  }
  shop_info: {
    company_name: string
    is_powerful_seller: boolean
    is_super_factory: boolean
  }
  item_repurchase_rate: string
  low_refund_rate: boolean
  ship_in_48h: boolean
  one_piece_min_order: boolean
}

export interface SearchResponse {
  success: boolean
  keyword: string
  total: number
  page: number
  page_size: number
  has_next_page: boolean
  items_found: number
  saved_to_db: boolean
  saved_count: number
  skipped_count: number
  error_count: number
  errors: any[]
  items: SearchItem[]
}

export async function searchProducts(keyword: string, page = 1, pageSize = 20): Promise<SearchResponse> {
  try {
    console.log("[v0] Searching products:", { keyword, page, pageSize })

    const params = new URLSearchParams({
      keyword,
      page: page.toString(),
      page_size: pageSize.toString(),
    })

    const response = await fetch(`/api/search?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = (await response.json()) as SearchResponse

    console.log("[v0] Search response:", {
      success: data.success,
      total: data.total,
      itemsFound: data.items_found,
      hasNextPage: data.has_next_page,
      itemsLength: data.items?.length || 0,
    })

    return data
  } catch (error) {
    console.error("[v0] Search products error:", error)
    throw error
  }
}
