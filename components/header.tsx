"use client"

import type React from "react"

import { ShoppingBag, Search, Menu, User, Heart, Camera } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCategories } from "@/lib/categories-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSelector } from "./language-selector"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { SearchModal } from "./search-modal"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const { cartCount } = useCart()
  const { user, logout } = useAuth()
  const { categories } = useCategories()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchModalOpen(true)
      }
      if (e.key === "Escape") {
        setSearchModalOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleImageSearchClick = () => {
    imageInputRef.current?.click()
  }

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    toast({
      title: "Image selected",
      description: `${file.name} is ready for image search.`,
    })

    // Reset input so same file can be chosen again later
    event.target.value = ""
  }

  return (
    <>
      <header className="sticky top-0 z-[9999] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Mobile Menu */}
        <div className="w-full px-4 flex h-16 items-center justify-between">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-muted-foreground">
                  Home
                </Link>
                {categories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <Link href={`/category/${category.slug}`} className="text-lg font-semibold hover:text-primary">
                      {category.name}
                    </Link>
                    {category.subCategories.map((sub) => (
                      <div key={sub.id} className="ml-4 space-y-1">
                        <Link
                          href={`/category/${category.slug}/${sub.slug}`}
                          className="text-sm font-medium hover:text-primary block"
                        >
                          {sub.name}
                        </Link>
                        {sub.subSubCategories.map((subSub) => (
                          <Link
                            key={subSub.id}
                            href={`/category/${category.slug}/${sub.slug}/${subSub.slug}`}
                            className="text-xs text-muted-foreground hover:text-foreground block ml-4"
                          >
                            {subSub.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
                <Link href="/sale" className="text-lg font-medium text-destructive hover:opacity-80">
                  Sale
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="font-serif text-2xl font-bold">ShopHub</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-muted-foreground">
              New Arrivals
            </Link>
            <Link href="/?tag=trending" className="text-sm font-medium hover:text-muted-foreground">
              Trending
            </Link>
            <Link href="/?tag=bestseller" className="text-sm font-medium hover:text-muted-foreground">
              Best Sellers
            </Link>
            <Link href="/sale" className="text-sm font-medium text-destructive hover:opacity-80">
              Sale
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelected}
            />
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              onClick={() => setSearchModalOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={handleImageSearchClick}>
              <Camera className="h-5 w-5" />
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">Orders</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden border-t px-4 py-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      </header>

      <div className="hidden md:block border-b bg-background relative z-[9998]">
        <div className="w-full px-4">
          <nav className="flex items-center justify-start gap-1 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <div key={category.id} className="group relative flex-shrink-0">
                <Link
                  href={`/category/${category.slug}`}
                  className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-accent block"
                >
                  {category.name}
                </Link>

                {category.subCategories && category.subCategories.length > 0 && (
                  <div className="fixed left-0 right-0 top-[128px] pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                    <div className="max-w-screen-xl mx-auto px-4">
                      <div className="bg-background border rounded-lg shadow-xl p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-4 max-h-[70vh] overflow-y-auto pr-2">
                          {category.subCategories.map((subCategory) => (
                            <div key={subCategory.id} className="min-w-0">
                              <Link
                                href={`/category/${category.slug}/${subCategory.slug}`}
                                className="font-semibold text-sm hover:text-primary transition-colors mb-2 block truncate"
                                title={subCategory.name}
                              >
                                {subCategory.name}
                              </Link>
                              {subCategory.subSubCategories && subCategory.subSubCategories.length > 0 && (
                                <ul className="space-y-1.5">
                                  {subCategory.subSubCategories.map((subSubCategory) => (
                                    <li key={subSubCategory.id}>
                                      <Link
                                        href={`/category/${category.slug}/${subCategory.slug}/${subSubCategory.slug}`}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors block truncate"
                                        title={subSubCategory.name}
                                      >
                                        {subSubCategory.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <Link
                            href={`/category/${category.slug}`}
                            className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
                          >
                            View All {category.name} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* SearchModal component */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  )
}
