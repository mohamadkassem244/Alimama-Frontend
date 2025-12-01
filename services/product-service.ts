// Product service - placeholder for future product API integration
import { apiFetch, type ApiResponse, API_BASE_URL } from "./api-client"

export interface ApiProduct {
  id: number
  name: string
  description: string
  price: number
  image: string
  category_id: number
  // Add more fields as needed based on your API
}

export interface ApiProductResponse {
  id: number
  display_name: string
  source_product_id: string
  product_price: number
  main_image: string
  quantity_begin: number
  sales_count: number
}

export interface PaginatedProductsApiResponse {
  success: boolean
  data: ApiProductResponse[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    total_pages: number
    has_next_page: boolean
    has_prev_page: boolean
  }
}

export interface PaginatedProductsResponse {
  products: any[] // Using internal Product type
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Fetch products from API (server-side)
export async function fetchProducts(): Promise<ApiResponse<ApiProduct[]>> {
  return await apiFetch<ApiProduct[]>("/v2_0_0-product/list")
}

// Fetch products from API (client-side)
export async function fetchProductsClient(): Promise<ApiResponse<ApiProduct[]>> {
  return await clientApiFetch<ApiProduct[]>("/v2_0_0-product/list")
}

// Fetch single product by ID
export async function fetchProductById(id: string): Promise<ApiResponse<ApiProduct>> {
  return await apiFetch<ApiProduct>(`/v2_0_0-product/${id}`)
}

// Fetch products by category
export async function fetchProductsByCategory(categoryId: string): Promise<ApiResponse<ApiProduct[]>> {
  return await apiFetch<ApiProduct[]>(`/v2_0_0-product/category/${categoryId}`)
}

// Fetch paginated products (client-side for infinite scroll)
export async function fetchProductsPage(page = 1, limit = 12): Promise<ApiResponse<PaginatedProductsResponse>> {
  console.log("[v0] Fetching products page via local API:", page, "limit:", limit)

  try {
    const response = await fetch(`/api/products?page=${page}&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const apiData: any = await response.json()
    const exchangeRate = apiData?.exchange_rate?.rate

    const products =
      apiData?.data?.map((product: any) => {
        const normalizedPrice =
          typeof product.product_price_usd === "number"
            ? product.product_price_usd
            : typeof product.product_price === "number"
              ? product.product_price
              : Number(product.product_price) || 0

        const normalizedOriginalPrice =
          typeof product.original_price_usd === "number"
            ? product.original_price_usd
            : typeof product.original_price === "number"
              ? product.original_price
              : product.original_price
              ? Number(product.original_price)
              : undefined

        return {
          id: String(product.id),
          name: product.display_name,
          description: product.display_name,
          price: normalizedPrice,
          originalPrice: normalizedOriginalPrice,
          category: { id: "1", name: "General", slug: "general", subCategories: [] },
          image: product.main_image,
          images: [product.main_image],
          sizes: ["One Size"],
          colors: ["Default"],
          inStock: product.quantity_begin > 0,
          rating: 4.5,
          reviews: product.sales_count,
          tags: [],
          salesCount: product.sales_count,
          quantityBegin: product.quantity_begin,
          exchangeRate,
        }
      }) || []

    return {
      success: true,
      data: {
        products,
        total: apiData?.pagination?.total || products.length * 10,
        page: apiData?.pagination?.current_page || page,
        limit: apiData?.pagination?.per_page || limit,
        hasMore: apiData?.pagination?.has_next_page !== false,
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching products via local API:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Fetch products by category with pagination
export async function fetchProductsByCategoryPage(
  categoryId: string | number,
  page = 1,
  limit = 12,
): Promise<ApiResponse<PaginatedProductsResponse>> {
  console.log("[v0] Fetching category products via local API:", categoryId, "page:", page)

  try {
    const response = await fetch(`/api/products?category_id=${categoryId}&page=${page}&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const apiData: any = await response.json()
    const exchangeRate = apiData?.exchange_rate?.rate

    const products =
      apiData?.data?.map((product: any) => {
        const normalizedPrice =
          typeof product.product_price_usd === "number"
            ? product.product_price_usd
            : typeof product.product_price === "number"
              ? product.product_price
              : Number(product.product_price) || 0

        const normalizedOriginalPrice =
          typeof product.original_price_usd === "number"
            ? product.original_price_usd
            : typeof product.original_price === "number"
              ? product.original_price
              : product.original_price
              ? Number(product.original_price)
              : undefined

        return {
          id: String(product.id),
          name: product.display_name,
          description: product.display_name,
          price: normalizedPrice,
          originalPrice: normalizedOriginalPrice,
          category: {
            id: String(product.category_id || categoryId),
            name: "Category",
            slug: "category",
            subCategories: [],
          },
          image: product.main_image,
          images: [product.main_image],
          sizes: ["One Size"],
          colors: ["Default"],
          inStock: product.quantity_begin > 0,
          rating: 4.5,
          reviews: product.sales_count,
          tags: [],
          salesCount: product.sales_count,
          quantityBegin: product.quantity_begin,
          exchangeRate,
        }
      }) || []

    return {
      success: true,
      data: {
        products,
        total: apiData?.pagination?.total || 0,
        page: apiData?.pagination?.current_page || page,
        limit: apiData?.pagination?.per_page || limit,
        hasMore: apiData?.pagination?.has_next_page !== false,
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching category products via local API:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export interface ProductDetailResponse {
  success: boolean
  data: {
    id: number
    product_id: number
    item_id: string
    category_id: string
    root_category_id: string
    product_url: string
    detail_url: string
    video_url: string | null
    title_zh: string | null
    title_en: string | null
    description_zh: string | null
    description_en: string | null
    currency: string
    origin_price: string
    origin_price_min: string
    origin_price_max: string
    previous_origin_price: string | null
    discount_price: string | null
    sale_count: number
    sale_quantity_90days: number
    total_stock: number
    is_sold_out: number
    offer_unit: string
    unit_weight: string
    mix_amount: string | null
    mix_begin: string | null
    mix_num: string | null
    delivery_location: string
    delivery_location_code: string
    delivery_fee: string
    template_id: string
    shop_name: string
    shop_url: string
    seller_login_id: string
    seller_user_id: string
    seller_member_id: string
    support_drop_shipping: number
    support_cross_border: number
    service_tags: any
    product_props: Array<Record<string, string>>
    promotions: any
    raw_data: {
      item_id: number
      product_url: string
      title: string
      category_id: number
      category_name: string | null
      root_category_id: number
      currency: string
      main_imgs: string[]
      video_url: string | null
      detail_url: string
      offer_unit: string
      product_props: Array<Record<string, string>>
      sale_count: string
      price_info: {
        price: string
        price_min: string
        price_max: string
        origin_price_min: string | null
        origin_price_max: string | null
        discount_price: string
      }
      tiered_price_info: {
        begin_num: number
        prices: Array<{
          beginAmount: string
          price: string
        }>
      } | null
      mixed_batch: any
      sale_info: {
        sale_quantity_90days: number
      }
      is_sold_out: boolean
      support_drop_shipping: boolean
      support_cross_border: boolean
      shop_info: {
        shop_name: string
        shop_url: string
        seller_login_id: string
        seller_user_id: string
        seller_member_id: string
      }
      delivery_info: {
        location: string
        location_code: string
        delivery_fee: number
        unit_weight: number
        template_id: string
      }
      service_tags: any[]
      sku_props: Array<{
        prop_name: string
        pid: string
        values: Array<{
          name: string
          vid: string
          imageUrl: string
        }>
      }>
      skus: Array<{
        skuid: string
        specid: string
        sale_price: string
        origin_price: string | null
        stock: number
        sale_count: number
        props_ids: string
        props_names: string
      }>
      stock: number
      promotions: any[]
    }
    created_at: string
    updated_at: string
    images: string[]
    original_currency?: string
    exchange_rate?: {
      from_currency_id: number
      from_currency_code: string
      from_currency_name: string
      to_currency_id: number
      to_currency_code: string
      to_currency_name: string
      rate: number
      updated_at: string
    }
  }
  exchange_rate?: {
    from_currency_id: number
    from_currency_code: string
    from_currency_name: string
    to_currency_id: number
    to_currency_code: string
    to_currency_name: string
    rate: number
    updated_at: string
  }
}

// Fetch product details by product ID
export async function fetchProductDetails(productId: string): Promise<ApiResponse<ProductDetailResponse>> {
  console.log("[v0] Fetching product details for ID:", productId)

  try {
    const response = await clientApiFetch<ProductDetailResponse>(
      `/v2_0_0-products/get-product-details-info?product_id=${productId}`,
    )

    console.log("[v0] Product details API response:", response)
    console.log("[v0] Product details success:", response.data?.success)
    console.log("[v0] Product details data exists:", !!response.data?.data)

    if (response.data?.data) {
      console.log("[v0] Product details loaded successfully for ID:", productId)
      console.log("[v0] Product title:", response.data.data.title_en || response.data.data.title_zh)
      console.log("[v0] Product images count:", response.data.data.images?.length || 0)
    } else {
      console.log("[v0] Product details API returned no data")
    }

    return response
  } catch (error) {
    console.error("[v0] Error fetching product details:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch product details",
    }
  }
}

export interface ProductVariant {
  id: number
  product_id: number
  sku_id: string
  spec_id: string
  variant_name: string
  props_ids: string
  props_names: string
  origin_price: string
  sale_price: string
  previous_origin_price: string | null
  stock: number
  sale_count: number
  variant_image: string
  status: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductVariantsResponse {
  success: boolean
  data: ProductVariant[]
  total: number
}

// Fetch product variants by product ID
export async function fetchProductVariants(productId: string): Promise<ApiResponse<ProductVariantsResponse>> {
  console.log("[v0] Fetching product variants for ID:", productId)

  try {
    const response = await clientApiFetch<ProductVariantsResponse>(
      `/v2_0_0-products/get-product-variants?product_id=${productId}`,
    )

    console.log("[v0] Product variants API response:", response)
    console.log("[v0] Variants count:", response.data?.data?.length || 0)

    if (response.data?.data) {
      console.log("[v0] Product variants loaded successfully for ID:", productId)
    }

    return response
  } catch (error) {
    console.error("[v0] Error fetching product variants:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch product variants",
    }
  }
}

// Response interface for the new combined API
export interface ProductDetailsWithVariantsResponse {
  success: boolean
  from_cache?: boolean
  product_id: number
  info: {
    id: number
    product_id: number
    item_id: string
    category_id: string
    root_category_id: string
    product_url: string
    detail_url: string
    video_url: string | null
    title_zh: string | null
    title_en: string | null
    description_zh: string | null
    description_en: string | null
    currency: string
    [key: string]: any // Allow for additional fields
    original_currency?: string
    exchange_rate?: {
      from_currency_id: number
      from_currency_code: string
      from_currency_name: string
      to_currency_id: number
      to_currency_code: string
      to_currency_name: string
      rate: number
      updated_at: string
    }
  }
  variants?: ProductVariant[]
  exchange_rate?: {
    from_currency_id: number
    from_currency_code: string
    from_currency_name: string
    to_currency_id: number
    to_currency_code: string
    to_currency_name: string
    rate: number
    updated_at: string
  }
  [key: string]: any // Allow for additional fields
}

// Fetch product details with variants in a single API call (POST request)
export async function fetchProductDetailsWithVariants(
  productId: string,
): Promise<ApiResponse<{ productData: ProductDetailResponse["data"]; variants: ProductVariant[] }>> {
  console.log("[v0] Fetching product details with variants for ID:", productId)

  try {
    // Validate productId
    if (!productId || productId === "undefined" || productId === "0") {
      console.error("[v0] Invalid product ID:", productId)
      return {
        success: false,
        error: `Invalid product ID: ${productId}`,
        data: null,
      }
    }

    console.log("[v0] Creating form data with product_id:", productId)
    // Create form data for POST request
    const formData = new FormData()
    formData.append("product_id", String(productId))

    // Verify form data
    const productIdValue = formData.get("product_id")
    console.log("[v0] FormData product_id value:", productIdValue)

    const response = await fetch(`${API_BASE_URL}/v2_0_0-products/get-product-details-with-variants`, {
      method: "POST",
      body: formData,
      mode: "cors",
    })

    console.log("[v0] Product details with variants response status:", response.status)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data: ProductDetailsWithVariantsResponse = await response.json()
    console.log("[v0] Product details with variants API response:", data)

      // Transform the response to match the expected format
      if (data.success && data.info) {
        // Parse raw_data if it's a string
        let parsedRawData: any = {}
        if (data.info.raw_data) {
          if (typeof data.info.raw_data === "string") {
            try {
              parsedRawData = JSON.parse(data.info.raw_data)
            } catch (e) {
              console.error("[v0] Failed to parse raw_data:", e)
              parsedRawData = {}
            }
          } else {
            parsedRawData = data.info.raw_data
          }
        }

        // Parse images if it's a string
        let parsedImages: string[] = []
        if (data.info.images) {
          if (typeof data.info.images === "string") {
            try {
              parsedImages = JSON.parse(data.info.images)
              if (!Array.isArray(parsedImages)) {
                parsedImages = []
              }
            } catch (e) {
              console.error("[v0] Failed to parse images:", e)
              parsedImages = []
            }
          } else if (Array.isArray(data.info.images)) {
            parsedImages = data.info.images
          }
        }

        // Fallback to main_imgs from raw_data if images is empty
        if (parsedImages.length === 0 && parsedRawData.main_imgs && Array.isArray(parsedRawData.main_imgs)) {
          parsedImages = parsedRawData.main_imgs
        }

        // Parse product_props if it's a string
        let parsedProductProps: Array<Record<string, string>> = []
        if (data.info.product_props) {
          if (typeof data.info.product_props === "string") {
            try {
              parsedProductProps = JSON.parse(data.info.product_props)
              if (!Array.isArray(parsedProductProps)) {
                parsedProductProps = []
              }
            } catch (e) {
              console.error("[v0] Failed to parse product_props:", e)
              parsedProductProps = []
            }
          } else if (Array.isArray(data.info.product_props)) {
            parsedProductProps = data.info.product_props
          }
        }

        // Fallback to product_props from raw_data if product_props is empty
        if (parsedProductProps.length === 0 && parsedRawData.product_props && Array.isArray(parsedRawData.product_props)) {
          parsedProductProps = parsedRawData.product_props
        }

        // Map the info object to match ProductDetailResponse structure
        const productData: ProductDetailResponse["data"] = {
          id: data.info.id,
          product_id: data.info.product_id,
          item_id: data.info.item_id,
          category_id: data.info.category_id,
          root_category_id: data.info.root_category_id,
          product_url: data.info.product_url,
          detail_url: data.info.detail_url,
          video_url: data.info.video_url,
          title_zh: data.info.title_zh,
          title_en: data.info.title_en,
          description_zh: data.info.description_zh,
          description_en: data.info.description_en,
          currency: data.info.currency,
          origin_price: data.info.origin_price || "0",
          origin_price_min: data.info.origin_price_min || "0",
          origin_price_max: data.info.origin_price_max || "0",
          previous_origin_price: data.info.previous_origin_price || null,
          discount_price: data.info.discount_price || null,
          sale_count: data.info.sale_count || 0,
          sale_quantity_90days: data.info.sale_quantity_90days || 0,
          total_stock: data.info.total_stock || 0,
          is_sold_out: data.info.is_sold_out || 0,
          offer_unit: data.info.offer_unit || "",
          unit_weight: data.info.unit_weight || "",
          mix_amount: data.info.mix_amount || null,
          mix_begin: data.info.mix_begin || null,
          mix_num: data.info.mix_num || null,
          delivery_location: data.info.delivery_location || "",
          delivery_location_code: data.info.delivery_location_code || "",
          delivery_fee: data.info.delivery_fee || "0",
          template_id: data.info.template_id || "",
          shop_name: data.info.shop_name || "",
          shop_url: data.info.shop_url || "",
          seller_login_id: data.info.seller_login_id || "",
          seller_user_id: data.info.seller_user_id || "",
          seller_member_id: data.info.seller_member_id || "",
          support_drop_shipping: data.info.support_drop_shipping || 0,
          support_cross_border: data.info.support_cross_border || 0,
          service_tags: data.info.service_tags || null,
          product_props: parsedProductProps,
          promotions: data.info.promotions || null,
          raw_data: parsedRawData,
          created_at: data.info.created_at || new Date().toISOString(),
          updated_at: data.info.updated_at || new Date().toISOString(),
          images: parsedImages,
        }

      const variants = data.variants || []

      const exchangeRateInfo = data.exchange_rate
      const exchangeRate = exchangeRateInfo?.rate ? Number(exchangeRateInfo.rate) : null
      const convertPrice = (value: string | number | null | undefined): string | null => {
        if (!exchangeRate || exchangeRate <= 0 || value === null || value === undefined) {
          return value !== null && value !== undefined ? String(value) : null
        }
        const numericValue = typeof value === "number" ? value : Number.parseFloat(value)
        if (Number.isNaN(numericValue)) return null
        return (numericValue * exchangeRate).toFixed(2)
      }

      if (exchangeRate) {
        const targetCurrency = exchangeRateInfo?.to_currency_code || "USD"
        const sourceCurrency = productData.currency
        productData.exchange_rate = exchangeRateInfo
        productData.original_currency = sourceCurrency
        productData.currency = targetCurrency
        productData.origin_price = convertPrice(productData.origin_price) || productData.origin_price
        productData.origin_price_min =
          convertPrice(productData.origin_price_min) || productData.origin_price_min
        productData.origin_price_max =
          convertPrice(productData.origin_price_max) || productData.origin_price_max
        productData.previous_origin_price =
          (convertPrice(productData.previous_origin_price) || productData.previous_origin_price) ?? null
        productData.discount_price = convertPrice(productData.discount_price) || productData.discount_price
        productData.delivery_fee = convertPrice(productData.delivery_fee) || productData.delivery_fee

        if (productData.raw_data?.price_info) {
          const priceInfo = productData.raw_data.price_info
          priceInfo.price = convertPrice(priceInfo.price) || priceInfo.price
          priceInfo.price_min = convertPrice(priceInfo.price_min) || priceInfo.price_min
          priceInfo.price_max = convertPrice(priceInfo.price_max) || priceInfo.price_max
          priceInfo.origin_price_min =
            convertPrice(priceInfo.origin_price_min) || priceInfo.origin_price_min
          priceInfo.origin_price_max =
            convertPrice(priceInfo.origin_price_max) || priceInfo.origin_price_max
          priceInfo.discount_price = convertPrice(priceInfo.discount_price) || priceInfo.discount_price
        }

        if (productData.raw_data?.tiered_price_info?.prices) {
          productData.raw_data.tiered_price_info.prices = productData.raw_data.tiered_price_info.prices.map(
            (tier) => ({
              ...tier,
              price: convertPrice(tier.price) || tier.price,
            }),
          )
        }

        if (productData.raw_data?.delivery_info) {
          productData.raw_data.delivery_info.delivery_fee =
            convertPrice(productData.raw_data.delivery_info.delivery_fee) ||
            productData.raw_data.delivery_info.delivery_fee
        }

        if (productData.raw_data) {
          productData.raw_data.currency = targetCurrency
        }

        for (const variant of variants) {
          variant.origin_price = convertPrice(variant.origin_price) || variant.origin_price
          variant.sale_price = convertPrice(variant.sale_price) || variant.sale_price
          variant.previous_origin_price =
            convertPrice(variant.previous_origin_price) || variant.previous_origin_price
        }
      }

      console.log("[v0] Product details with variants loaded successfully for ID:", productId)
      console.log("[v0] Variants count:", variants.length)

      return {
        success: true,
        data: {
          productData,
          variants,
        },
      }
    } else {
      console.log("[v0] Product details with variants API returned no data")
      return {
        success: false,
        error: "Product not found",
        data: null,
      }
    }
  } catch (error) {
    console.error("[v0] Error fetching product details with variants:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch product details with variants",
      data: null,
    }
  }
}
