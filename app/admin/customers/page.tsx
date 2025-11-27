"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users } from "lucide-react"

export default function AdminCustomersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "admin") {
    return null
  }

  // Mock customers data
  const customers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      orders: 5,
      totalSpent: 459.95,
      joinedDate: "2024-12-01",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      orders: 3,
      totalSpent: 289.5,
      joinedDate: "2024-12-15",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      orders: 8,
      totalSpent: 789.99,
      joinedDate: "2024-11-20",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-1">Customers</h1>
            <p className="text-muted-foreground">View and manage customer accounts</p>
          </div>

          <div className="space-y-4">
            {customers.map((customer) => (
              <Card key={customer.id} className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{customer.email}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Orders</p>
                        <p className="font-semibold">{customer.orders}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Spent</p>
                        <p className="font-semibold">${customer.totalSpent.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Joined</p>
                        <p className="font-semibold">{customer.joinedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {customers.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No customers yet</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
