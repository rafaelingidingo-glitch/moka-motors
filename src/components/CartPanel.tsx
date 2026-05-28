'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { getCartCheckoutMessage, getWhatsAppUrl } from '@/lib/whatsapp'

export default function CartPanel() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore()
  const total = getTotal()

  const handleCheckout = () => {
    const cartItems = items.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      brand: item.brand,
    }))
    const url = getWhatsAppUrl(getCartCheckoutMessage(cartItems))
    window.open(url, '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setCartOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#DC2626]" />
                <h2 className="font-bold text-lg text-[#111111]">Shopping Cart</h2>
                <span className="bg-[#DC2626] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Your cart is empty</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Start adding motorbikes or spare parts!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 bg-gray-50 rounded-lg p-3"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-[#111111] truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">{item.brand}</p>
                        <p className="text-[#DC2626] font-bold text-sm mt-1">
                          TZS {item.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="bg-white border border-gray-200 rounded p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="bg-white border border-gray-200 rounded p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-gray-400 hover:text-[#DC2626] transition-colors text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#111111]">Total</span>
                  <span className="text-[#DC2626] font-black text-xl">
                    TZS {total.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Checkout via WhatsApp
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-gray-500 hover:text-[#DC2626] text-sm font-medium py-2 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
