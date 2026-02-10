"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CartContextType {
  quantity: number
  setQuantity: (q: number) => void
  increment: () => void
  decrement: () => void
  clear: () => void
  unitPrice: number
  total: number
}

const UNIT_PRICE = 1499

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantity, setQuantity] = useState(0)

  return (
    <CartContext.Provider
      value={{
        quantity,
        setQuantity,
        increment: () => setQuantity((q) => q + 1),
        decrement: () => setQuantity((q) => Math.max(0, q - 1)),
        clear: () => setQuantity(0),
        unitPrice: UNIT_PRICE,
        total: quantity * UNIT_PRICE,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
