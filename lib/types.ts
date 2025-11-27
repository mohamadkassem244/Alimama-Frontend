export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: Category
  image: string
  images: string[]
  sizes: string[]
  colors: string[]
  inStock: boolean
  rating: number
  reviews: number
  tags: string[]
  salesCount?: number
  quantityBegin?: number
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: Address
  createdAt: string
  updatedAt: string
}

export interface Address {
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

export interface User {
  id: string
  email: string
  name: string
  role: "customer" | "admin"
  createdAt: string
}

export interface SubSubCategory {
  id: string
  name: string
  slug: string
}

export interface SubCategory {
  id: string
  name: string
  slug: string
  subSubCategories: SubSubCategory[]
}

export interface Category {
  id: string
  name: string
  slug: string
  subCategories: SubCategory[]
  icon?: string
}

export interface ApiCategory {
  id: number
  category_name: string
  parent: number | null
  has_children: 0 | 1
  level: number
  children: ApiCategory[]
}

export interface ApiCategoryResponse {
  tree: ApiCategory[]
}
