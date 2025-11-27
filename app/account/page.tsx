"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { User, Package, Heart, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export default function AccountPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-serif font-bold mb-1">My Account</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Profile</h3>
                    <p className="text-sm text-muted-foreground mb-4">Manage your personal information</p>
                    <Link href="/account/profile">
                      <Button variant="outline" size="sm">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Orders</h3>
                    <p className="text-sm text-muted-foreground mb-4">Track and manage your orders</p>
                    <Link href="/account/orders">
                      <Button variant="outline" size="sm">
                        View Orders
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Wishlist</h3>
                    <p className="text-sm text-muted-foreground mb-4">View your saved items</p>
                    <Link href="/account/wishlist">
                      <Button variant="outline" size="sm">
                        View Wishlist
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Settings className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Settings</h3>
                    <p className="text-sm text-muted-foreground mb-4">Update your preferences</p>
                    <Link href="/account/settings">
                      <Button variant="outline" size="sm">
                        Go to Settings
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

            {user.role === "admin" && (
              <Card className="mt-6 p-6 border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Admin Access</h3>
                    <p className="text-sm text-muted-foreground">Manage products, orders, and customers</p>
                  </div>
                  <Link href="/admin">
                    <Button>Go to Admin Dashboard</Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
