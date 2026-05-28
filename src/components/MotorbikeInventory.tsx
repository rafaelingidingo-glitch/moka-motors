'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Grid3X3, List, ArrowUpDown, Bike } from 'lucide-react'
import ProductCard from './ProductCard'
import FilterSidebar from './FilterSidebar'
import { useTranslation } from '@/lib/i18n'

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
  createdAt?: string
}

interface FilterState {
  brands: string[]
  categories: string[]
  priceRange: [number, number]
  year: string
  engineSize: string
}

const defaultFilters: FilterState = {
  brands: [],
  categories: [],
  priceRange: [0, Infinity],
  year: '',
  engineSize: '',
}

export default function MotorbikeInventory() {
  const { t } = useTranslation()
  const [bikes, setBikes] = useState<Motorbike[]>([])
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [sort, setSort] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showCount, setShowCount] = useState(6)

  useEffect(() => {
    fetch('/api/motorbikes')
      .then((res) => res.json())
      .then((data) => setBikes(data))
      .catch(console.error)
  }, [])

  const filteredBikes = useMemo(() => {
    let result = [...bikes]

    if (filters.brands.length > 0) {
      result = result.filter((b) => filters.brands.includes(b.brand))
    }
    if (filters.categories.length > 0) {
      result = result.filter((b) => filters.categories.includes(b.category))
    }
    result = result.filter(
      (b) => b.price >= filters.priceRange[0] && b.price <= filters.priceRange[1]
    )
    if (filters.year) {
      const yearParts = filters.year.split('-')
      const fromYear = yearParts[0] ? Number(yearParts[0]) : null
      const toYear = yearParts[1] ? Number(yearParts[1]) : null
      result = result.filter((b) => {
        if (fromYear && toYear) {
          return b.year >= fromYear && b.year <= toYear
        } else if (fromYear) {
          return b.year >= fromYear
        } else if (toYear) {
          return b.year <= toYear
        }
        return true
      })
    }
    if (filters.engineSize) {
      const parts = filters.engineSize.replace('cc', '').split('-')
      const min = Number(parts[0])
      const max = parts[1] ? Number(parts[1]) : null
      if (max) {
        result = result.filter((b) => {
          const cc = parseInt(b.engineSize)
          return cc >= min && cc <= max
        })
      } else {
        const minCC = filters.engineSize.replace('cc', '').replace('+', '')
        result = result.filter((b) => parseInt(b.engineSize) >= parseInt(minCC))
      }
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'year-desc':
        result.sort((a, b) => b.year - a.year)
        break
      case 'year-asc':
        result.sort((a, b) => a.year - b.year)
        break
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )
    }

    return result
  }, [bikes, filters, sort])

  return (
    <section id="motorbikes" className="py-12 md:py-20 lg:py-28 bg-[#F5F5F5]" style={{ overflowAnchor: 'none' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {t('motorbikes.tag')}
            </p>
            <div className="w-8 h-[2px] bg-[#DC2626]" />
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-[#111111]">
            {t('motorbikes.heading1')} <span className="text-[#DC2626]">{t('motorbikes.heading2')}</span>
          </h2>
          <p className="text-[#6B7280] mt-4 max-w-2xl mx-auto">
            {t('motorbikes.description')}
          </p>
        </motion.div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            type="motorbike"
            filters={filters}
            onFilterChange={(f) => {
              setFilters(f)
              setShowCount(6)
            }}
            onClear={() => {
              setFilters(defaultFilters)
              setShowCount(6)
            }}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white rounded-sm p-3 border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600">
                {t('motorbikes.searchResults')}{' '}
                <span className="font-black text-[#111111]">{filteredBikes.length}</span>{' '}
                {t('motorbikes.resultsWord')}
              </p>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                {/* Sort */}
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="text-sm border border-gray-200 rounded-sm px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#DC2626] max-w-[180px]"
                  >
                    <option value="newest">{t('motorbikes.sortNewest')}</option>
                    <option value="price-asc">{t('motorbikes.sortPriceLow')}</option>
                    <option value="price-desc">{t('motorbikes.sortPriceHigh')}</option>
                    <option value="year-desc">{t('motorbikes.sortYearNew')}</option>
                    <option value="year-asc">{t('motorbikes.sortYearOld')}</option>
                  </select>
                </div>
                {/* View Toggle */}
                <div className="hidden sm:flex items-center border border-gray-200 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${
                      viewMode === 'grid'
                        ? 'bg-[#DC2626] text-white'
                        : 'bg-white text-gray-400 hover:text-gray-600'
                    } transition-colors`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${
                      viewMode === 'list'
                        ? 'bg-[#DC2626] text-white'
                        : 'bg-white text-gray-400 hover:text-gray-600'
                    } transition-colors`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredBikes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-sm">
                <Bike className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">{t('motorbikes.noMatch')}</p>
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="text-[#DC2626] font-medium mt-2 hover:underline"
                >
                  {t('motorbikes.clearFilters')}
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'space-y-4'
                }
              >
                {filteredBikes.slice(0, showCount).map((bike, i) => (
                  <motion.div
                    key={bike.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <ProductCard bike={bike} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More */}
            {showCount < filteredBikes.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowCount((prev) => prev + 6)}
                  className="bg-[#111111] hover:bg-[#333333] text-white font-bold px-8 py-3 rounded-sm transition-colors"
                >
                  {t('motorbikes.loadMore')} ({filteredBikes.length - showCount} {t('motorbikes.remaining')})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
