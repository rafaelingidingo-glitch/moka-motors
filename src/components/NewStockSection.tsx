'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useLikeStore } from '@/store/likeStore'
import { getProductInquiryMessage, getWhatsAppUrl } from '@/lib/whatsapp'
import { toast } from 'sonner'

interface Motorbike {
  id: string
  name: string
  brand: string
  category: string
  price: number
  year: number
  engineSize: string
  mileage: string | null
  color: string | null
  description: string
  imageUrl: string
  featured: boolean
  isNewStock: boolean
}

export default function NewStockSection() {
  const [bikes, setBikes] = useState<Motorbike[]>([])
  const { addItem } = useCartStore()
  const { toggleLike, isLiked } = useLikeStore()

  useEffect(() => {
    fetch('/api/motorbikes?isNewStock=true&sort=newest')
      .then((res) => res.json())
      .then((data) => setBikes(data))
      .catch(console.error)
  }, [])

  const scrollToMotorbikes = () => {
    document.querySelector('#motorbikes')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="new-stock" className="py-20 md:py-28 bg-[#111111] relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(220,38,38,0.1) 35px, rgba(220,38,38,0.1) 36px)',
        }} />
      </div>
      {/* Red accent glow */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#DC2626]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-[2px] bg-[#DC2626]" />
            <p className="text-[#DC2626] font-bold text-sm uppercase tracking-[0.15em]">
              JUST ARRIVED
            </p>
            <div className="w-8 h-[2px] bg-[#DC2626]" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            New Stock <span className="text-[#DC2626]">Available</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Check out our latest arrivals — fresh off the container, ready for you to ride.
          </p>
        </motion.div>

        {/* New Stock Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bikes.slice(0, 4).map((bike, i) => (
            <motion.div
              key={bike.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#1A1A1A] rounded-sm overflow-hidden group hover:shadow-xl hover:shadow-[#DC2626]/10 transition-all duration-300 border border-gray-800 hover:border-[#DC2626]/30"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={bike.imageUrl}
                  alt={bike.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#DC2626] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm flex items-center gap-1 uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" /> NEW
                  </span>
                </div>
                <button
                  onClick={() => toggleLike(bike.id)}
                  className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 p-1.5 rounded-full transition-all"
                >
                  <svg
                    className={`h-4 w-4 ${
                      isLiked(bike.id) ? 'text-[#DC2626] fill-[#DC2626]' : 'text-white'
                    }`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-[#DC2626] text-[10px] font-bold uppercase tracking-[0.15em]">
                  {bike.brand}
                </p>
                <h3 className="text-white font-black text-lg mt-1">{bike.name}</h3>
                <p className="text-[#DC2626] font-black text-xl mt-2">
                  TZS {bike.price.toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {bike.description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-gray-500 text-xs">
                  <span>{bike.year}</span>
                  <span>•</span>
                  <span>{bike.engineSize}</span>
                  {bike.mileage && (
                    <>
                      <span>•</span>
                      <span>{bike.mileage}</span>
                    </>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      addItem({
                        id: bike.id,
                        name: bike.name,
                        price: bike.price,
                        imageUrl: bike.imageUrl,
                        brand: bike.brand,
                        type: 'motorbike',
                      })
                      toast.success(`${bike.name} added to cart!`)
                    }}
                    className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold py-2.5 rounded-sm transition-colors"
                  >
                    Add to Cart
                  </button>
                  <a
                    href={getWhatsAppUrl(
                      getProductInquiryMessage(bike.name, bike.price, bike.brand, 'motorbike')
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2.5 rounded-sm transition-colors"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <button
            onClick={scrollToMotorbikes}
            className="inline-flex items-center gap-2 border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-bold px-8 py-3 rounded-sm transition-all duration-300"
          >
            View All Inventory
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
