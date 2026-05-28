'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCartStore } from '@/store/cartStore'
import { useLikeStore } from '@/store/likeStore'
import { getProductInquiryMessage, getWhatsAppUrl } from '@/lib/whatsapp'
import { parseImages } from '@/lib/utils'
import {
  ShoppingCart,
  Calendar,
  Cog,
  Gauge,
  Settings,
  Star,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Paintbrush,
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n'

interface MotorbikeData {
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

interface SparePartData {
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

type ProductData = MotorbikeData | SparePartData

function isMotorbike(product: ProductData): product is MotorbikeData {
  return 'engineSize' in product
}

interface ProductDetailModalProps {
  product: ProductData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductDetailModal({
  product,
  open,
  onOpenChange,
}: ProductDetailModalProps) {
  const { addItem } = useCartStore()
  const { toggleLike, isLiked } = useLikeStore()
  const { t } = useTranslation()
  const [currentImage, setCurrentImage] = useState(0)

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImage(0)
  }, [product?.id])

  if (!product) return null

  const images = parseImages(product.images)
  const liked = isLiked(product.id)
  const hasMultipleImages = images.length > 1
  const primaryImage = images[0] || '/images/placeholder.png'

  const handleAddToCart = () => {
    if (!isMotorbike(product) && !product.inStock) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: primaryImage,
      brand: product.brand,
      type: isMotorbike(product) ? 'motorbike' : 'spare-part',
    })
    toast.success(t('product.addedToCart', { name: product.name }))
  }

  const goToPrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl max-h-[100vh] sm:max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-none sm:rounded-lg"
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">{product.name} - Product Details</DialogTitle>
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="relative lg:w-1/2 bg-[#F5F5F5]">
            <img
              src={images[currentImage] || '/images/placeholder.png'}
              alt={product.name}
              className="w-full h-56 sm:h-72 md:h-80 lg:h-full min-h-[200px] sm:min-h-[280px] object-cover"
            />
            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2.5 rounded-full transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2.5 rounded-full transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                {/* Image Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentImage ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
            {/* Image Counter */}
            {hasMultipleImages && (
              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
                {currentImage + 1} / {images.length}
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2 z-10">
              {product.featured && (
                <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1 uppercase tracking-wider">
                  <Star className="h-3.5 w-3.5" /> {t('product.featured')}
                </span>
              )}
              {isMotorbike(product) && product.isNewStock && (
                <span className="bg-[#DC2626] text-white text-xs font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider">
                  {t('product.new')}
                </span>
              )}
              {!isMotorbike(product) && (
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1 uppercase tracking-wider ${
                    product.inStock
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.inStock ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  {product.inStock ? t('product.inStock') : t('product.outOfStock')}
                </span>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col pb-20 sm:pb-6 lg:pb-8">
            {/* Category / Type Tag */}
            <p className="text-[#DC2626] text-xs font-bold uppercase tracking-[0.15em] mb-2">
              {isMotorbike(product) ? `${t('product.category')} ${product.category}` : `${t('product.type')} ${product.type}`}
            </p>

            {/* Name */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#111111] leading-tight">
              {product.name}
            </h2>

            {/* Brand */}
            <p className="text-gray-500 text-sm font-medium mt-1">
              {t('product.brand')} <span className="text-[#111111] font-bold">{product.brand}</span>
            </p>

            {/* Price */}
            <p className="text-[#DC2626] font-black text-2xl sm:text-3xl mt-3">
              TZS {product.price.toLocaleString()}
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed mt-4 border-t border-gray-100 pt-4">
                {product.description}
              </p>
            )}

            {/* Specs - Motorbike */}
            {isMotorbike(product) && (
              <div className="grid grid-cols-2 gap-3 mt-5 bg-[#F5F5F5] rounded-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-sm shadow-sm">
                    <Calendar className="h-4 w-4 text-[#DC2626]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t('product.year')}</p>
                    <p className="text-sm font-bold text-[#111111]">{product.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-sm shadow-sm">
                    <Cog className="h-4 w-4 text-[#DC2626]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t('product.engine')}</p>
                    <p className="text-sm font-bold text-[#111111]">{product.engineSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-sm shadow-sm">
                    <Gauge className="h-4 w-4 text-[#DC2626]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t('product.mileage')}</p>
                    <p className="text-sm font-bold text-[#111111]">{product.mileage || t('product.na')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-sm shadow-sm">
                    <Paintbrush className="h-4 w-4 text-[#DC2626]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t('product.color')}</p>
                    <p className="text-sm font-bold text-[#111111]">{product.color || t('product.na')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Specs - Spare Part */}
            {!isMotorbike(product) && (
              <div className="mt-5 bg-[#F5F5F5] rounded-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-sm shadow-sm">
                    <Settings className="h-4 w-4 text-[#DC2626]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t('product.compatibility')}</p>
                    <p className="text-sm font-bold text-[#111111]">{product.compatibility}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`shrink-0 w-16 h-16 rounded-sm overflow-hidden border-2 transition-all ${
                      idx === currentImage
                        ? 'border-[#DC2626] shadow-sm'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
              <button
                onClick={handleAddToCart}
                disabled={!isMotorbike(product) && !product.inStock}
                className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-sm transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">{t('product.addToCart')}</span>
                <span className="sm:hidden">{t('product.cart')}</span>
              </button>
              <button
                onClick={() => toggleLike(product.id)}
                className={`px-4 py-3 rounded-sm border-2 transition-all shrink-0 ${
                  liked
                    ? 'bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626]'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-[#DC2626]/30 hover:text-[#DC2626]'
                }`}
              >
                <svg
                  className={`h-5 w-5 ${liked ? 'fill-[#DC2626]' : ''}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <a
                href={getWhatsAppUrl(
                  getProductInquiryMessage(
                    product.name,
                    product.price,
                    product.brand,
                    isMotorbike(product) ? 'motorbike' : 'spare-part'
                  )
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-5 py-3 rounded-sm transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                {t('product.buyNow')}
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
