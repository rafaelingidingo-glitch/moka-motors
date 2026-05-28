'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, User } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAdminStore } from '@/store/adminStore'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'New Stock', href: '#new-stock' },
  { label: 'Motorbikes', href: '#motorbikes' },
  { label: 'Spare Parts', href: '#spare-parts' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getItemCount, toggleCart } = useCartStore()
  const { isLoggedIn, openAdminPage } = useAdminStore()
  const itemCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#111111]/95 backdrop-blur-md shadow-lg'
            : 'bg-[#111111]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('#home')
              }}
              className="flex items-center gap-2 group"
            >
              <img
                src="/images/logo.jpg"
                alt="Sky Motors Logo"
                className="h-10 md:h-12 w-auto object-contain rounded-sm"
              />
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(link.href)
                  }}
                  className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative text-gray-300 hover:text-white p-2 rounded-md hover:bg-white/10 transition-all duration-200"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Admin Login */}
              <button
                onClick={openAdminPage}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isLoggedIn
                    ? 'bg-[#DC2626] text-white'
                    : 'text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400'
                }`}
              >
                <User className="h-4 w-4" />
                {isLoggedIn ? 'Admin' : 'Login'}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-300 hover:text-white p-2 rounded-md hover:bg-white/10 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-[#111111] shadow-2xl"
            >
              <div className="pt-20 px-4">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(link.href)
                      }}
                      className="block text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-md text-base font-medium transition-all duration-200"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      openAdminPage()
                    }}
                    className="flex items-center gap-2 text-gray-300 hover:text-white px-4 py-3 rounded-md text-base font-medium transition-all duration-200 w-full"
                  >
                    <User className="h-5 w-5" />
                    {isLoggedIn ? 'Admin Dashboard' : 'Admin Login'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
