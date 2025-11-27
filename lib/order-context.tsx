"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Order, CartItem, Address } from "./types"

interface OrderContextType {
  orders: Order[]
  addOrder: (items: CartItem[], shippingAddress: Address, total: number) => string
  getOrder: (orderId: string) => Order | undefined
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  const addOrder = (items: CartItem[], shippingAddress: Address, total: number): string => {
    const orderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase()

    const newOrder: Order = {
      id: orderId,
      userId: "current-user", // Would come from auth in production
      items,
      total,
      status: "pending",
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setOrders((prev) => [newOrder, ...prev])
    return orderId
  }

  const getOrder = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId)
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order)),
    )
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrder, updateOrderStatus }}>{children}</OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}
