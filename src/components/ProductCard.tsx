'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useLikeStore } from '@/store/likeStore'
import { getProductInquiryMessage, getWhatsAppUrl } from '@/lib/whatsapp'
import { parseImages } from '@/lib/utils'
import { ShoppingCart, Star, Gauge, Calendar, Cog, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import ProductDetailModal from './ProductDetailModal'

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
  images: string
  featured: boolean
  isNewStock: boolean
}

export default function ProductCard({ bike }: { bike: Motorbike }) {
  const { addItem } = useCartStore()
  const { toggleLike, isLiked } = useLikeStore()
  const liked = isLiked(bike.id)
  const images = parseImages(bike.images)
  const [currentImage, setCurrentImage] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const hasMultipleImages = images.length > 1

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const primaryImage = images[0] || '/images/placeholder.png'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: bike.id,
      name: bike.name,
      price: bike.price,
      imageUrl: primaryImage,
      brand: bike.brand,
      type: 'motorbike',
    })
    toast.success(`${bike.name} added to cart!`)
  }

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="bg-white rounded-sm overflow-hidden group hover:shadow-xl hover:shadow-[#DC2626]/5 transition-all duration-300 border border-gray-100 hover:border-[#DC2626]/20 cursor-pointer"
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-[#F5F5F5]">
          <img
            src={images[currentImage] || '/images/placeholder.png'}
            alt={bike.name}
            className="w-full h-44 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              {/* Image Dots Indicator */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentImage(idx) }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImage ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {bike.featured && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm flex items-center gap-1 uppercase tracking-wider">
                <Star className="h-3 w-3" /> Featured
              </span>
            )}
            {bike.isNewStock && (
              <span className="bg-[#DC2626] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                New
              </span>
            )}
          </div>
          {/* Like Button */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleLike(bike.id) }}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-all shadow-sm hover:shadow-md z-10"
            aria-label="Like"
          >
            <svg
              className={`h-5 w-5 transition-colors ${
                liked ? 'text-[#DC2626] fill-[#DC2626]' : 'text-gray-400'
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          {/* Powered by brand overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
              Powered by {bike.brand}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category Tag */}
          <div className="flex items-center justify-between mb-1">
            <p className="text-[#DC2626] text-[10px] font-bold uppercase tracking-[0.15em]">
              Category: {bike.category}
            </p>
          </div>
          <h3 className="text-[#111111] font-black text-lg leading-tight">{bike.name}</h3>
          <p className="text-[#DC2626] font-black text-2xl mt-1">
            TZS {bike.price.toLocaleString()}
          </p>

          {/* Specs Grid - matching design inspiration */}
          <div className="grid grid-cols-3 gap-2 mt-4 bg-[#F5F5F5] rounded-sm p-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                <Calendar className="h-3 w-3" />
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Year</p>
              <p className="text-xs font-bold text-[#111111]">{bike.year}</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                <Cog className="h-3 w-3" />
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Engine</p>
              <p className="text-xs font-bold text-[#111111]">{bike.engineSize}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                <Gauge className="h-3 w-3" />
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Mileage</p>
              <p className="text-xs font-bold text-[#111111]">{bike.mileage || 'N/A'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold py-2.5 rounded-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="sm:inline">Add to Cart</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleLike(bike.id) }}
              className={`px-3 py-2.5 rounded-sm border transition-colors shrink-0 ${
                liked
                  ? 'bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626]'
                  : 'bg-white border-gray-200 text-gray-400 hover:border-[#DC2626]/30 hover:text-[#DC2626]'
              }`}
            >
              <svg
                className={`h-4 w-4 ${liked ? 'fill-[#DC2626]' : ''}`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <a
              href={getWhatsAppUrl(
                getProductInquiryMessage(bike.name, bike.price, bike.brand, 'motorbike')
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2.5 rounded-sm transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
                Buy Now
            </a>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={bike}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}
