import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { OrderProvider } from "@/lib/order-context"
import { TranslationProvider } from "@/lib/translation-context"
import { AutoTranslateWrapper } from "@/components/auto-translate-wrapper"
import { CategoriesProvider } from "@/lib/categories-provider"
import { categoryTree } from "@/lib/categories"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "ShopHub - Fashion & Lifestyle",
  description: "Discover the latest trends in fashion, accessories, and lifestyle products",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = categoryTree

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <AuthProvider>
          <OrderProvider>
            <TranslationProvider>
              <AutoTranslateWrapper>
                <CategoriesProvider initialCategories={categories}>
                  <CartProvider>{children}</CartProvider>
                </CategoriesProvider>
              </AutoTranslateWrapper>
            </TranslationProvider>
          </OrderProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
