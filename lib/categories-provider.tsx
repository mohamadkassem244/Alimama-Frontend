"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Category } from "./types"
import { fetchCategoriesClient } from "@/services/category-service"

const CategoriesContext = createContext<{
  categories: Category[]
  loading: boolean
  refetch: () => Promise<void>
  usingFallback: boolean
}>({
  categories: [],
  loading: true,
  refetch: async () => {},
  usingFallback: true,
})

export function CategoriesProvider({
  children,
  initialCategories,
}: {
  children: React.ReactNode
  initialCategories: Category[]
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [usingFallback, setUsingFallback] = useState(true)

  useEffect(() => {
    const fetchFromApi = async () => {
      console.log("[v0] Auto-fetching categories from API on mount...")
      setLoading(true)

      try {
        const freshCategories = await fetchCategoriesClient()

        const isRealApiData =
          freshCategories.length > 0 && JSON.stringify(freshCategories) !== JSON.stringify(initialCategories)

        if (isRealApiData) {
          console.log("[v0] Got real API categories, updating...")
          setCategories(freshCategories)
          setUsingFallback(false)
        } else {
          console.log("[v0] API returned fallback data, keeping initial categories")
        }
      } catch (error) {
        console.error("[v0] Failed to fetch categories on mount:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFromApi()
  }, []) // Run once on mount

  const refetch = async () => {
    setLoading(true)
    console.log("[v0] Manually refetching categories from client...")

    try {
      const freshCategories = await fetchCategoriesClient()
      setCategories(freshCategories)

      const isRealApiData =
        freshCategories.length > 0 && JSON.stringify(freshCategories) !== JSON.stringify(initialCategories)
      setUsingFallback(!isRealApiData)

      console.log("[v0] Categories refetched successfully:", freshCategories.length)
    } catch (error) {
      console.error("[v0] Failed to refetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CategoriesContext.Provider value={{ categories, loading, refetch, usingFallback }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error("useCategories must be used within CategoriesProvider")
  }
  return context
}
