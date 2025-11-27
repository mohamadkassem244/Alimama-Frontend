"use client"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchResults } from "@/components/search-results"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="w-full px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-muted-foreground mb-8">
              Showing results for <span className="font-semibold text-foreground">"{query}"</span>
            </p>
          )}

          <SearchResults searchQuery={query} />
        </div>
      </main>
      <Footer />
    </>
  )
}
