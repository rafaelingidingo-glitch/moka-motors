'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useLikeStore } from '@/store/likeStore'
import { getProductInquiryMessage, getWhatsAppUrl } from '@/lib/whatsapp'
import { ShoppingCart, Star, MessageCircle, Settings, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import ProductDetailModal from './ProductDetailModal'

interface SparePart {
  id: string
  name: string
  type: string
  brand: string
  compatibility: string
  price: number
  description: string
  images: string
  inStock: boolean
  featured: boolean
}

function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return []
  } catch {
    return []
  }
}

export default function SparePartCard({ part }: { part: SparePart }) {
  const { addItem } = useCartStore()
  const { toggleLike, isLiked } = useLikeStore()
  const liked = isLiked(part.id)
  const images = parseImages(part.images)
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
    if (!part.inStock) return
    addItem({
      id: part.id,
      name: part.name,
      price: part.price,
      imageUrl: primaryImage,
      brand: part.brand,
      type: 'spare-part',
    })
    toast.success(`${part.name} added to cart!`)
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
            alt={part.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
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
            {part.featured && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm flex items-center gap-1 uppercase tracking-wider">
                <Star className="h-3 w-3" /> Featured
              </span>
            )}
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-sm flex items-center gap-1 uppercase tracking-wider ${
                part.inStock
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {part.inStock ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {part.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          {/* Like Button */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleLike(part.id) }}
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
          {/* Brand overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
              {part.brand}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[#DC2626] text-[10px] font-bold uppercase tracking-[0.15em]">
              Type: {part.type}
            </p>
          </div>
          <h3 className="text-[#111111] font-black text-lg leading-tight">{part.name}</h3>
          <p className="text-[#DC2626] font-black text-2xl mt-1">
            TZS {part.price.toLocaleString()}
          </p>

          {/* Compatibility */}
          <div className="mt-3 bg-[#F5F5F5] rounded-sm p-3">
            <div className="flex items-center gap-2">
              <Settings className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Compatibility</p>
                <p className="text-xs font-semibold text-[#111111]">{part.compatibility}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={!part.inStock}
              className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleLike(part.id) }}
              className={`px-3 py-2.5 rounded-sm border transition-colors ${
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
                getProductInquiryMessage(part.name, part.price, part.brand, 'spare-part')
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2.5 rounded-sm transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="h-4 w-4" />
              Buy Now
            </a>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={part}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}
