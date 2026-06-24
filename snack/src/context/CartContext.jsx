import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]')
    } catch { return [] }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (menuItem) => {
    const isExisting = items.some(i => i._id === menuItem._id)
    setItems(prev => {
      const existing = prev.find(i => i._id === menuItem._id)
      if (existing) return prev.map(i => i._id === menuItem._id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...menuItem, quantity: 1 }]
    })
    if (isExisting) toast.success(`${menuItem.name} quantity updated`, { icon: '🛒' })
    else toast.success(`${menuItem.name} added to cart`, { icon: '✅' })
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const updateQuantity = (id, qty) => {
    if (qty <= 0) { removeItem(id); return }
    setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('cart')
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
