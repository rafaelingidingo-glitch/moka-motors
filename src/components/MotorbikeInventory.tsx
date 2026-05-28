'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Grid3X3, List, ArrowUpDown, Bike } from 'lucide-react'
import ProductCard from './ProductCard'
import FilterSidebar from './FilterSidebar'

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
  priceRange: [0, 25000000],
  year: '',
  engineSize: '',
}

export default function MotorbikeInventory() {
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
      result = result.filter((b) => String(b.year) === filters.year)
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
    <section id="motorbikes" className="py-20 md:py-28 bg-[#F5F5F5]">
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
              OUR COLLECTION
            </p>
            <div className="w-8 h-[2px] bg-[#DC2626]" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#111111]">
            Choose a <span className="text-[#DC2626]">Motorcycle</span>
          </h2>
          <p className="text-[#6B7280] mt-4 max-w-2xl mx-auto">
            Browse our complete inventory of premium motorbikes from top brands.
            Use the filters to find your perfect ride.
          </p>
        </motion.div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex gap-6">
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
            <div className="flex items-center justify-between mb-6 bg-white rounded-sm p-3 border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600">
                Your search returned{' '}
                <span className="font-black text-[#111111]">{filteredBikes.length}</span>{' '}
                results
              </p>
              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="text-sm border border-gray-200 rounded-sm px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#DC2626]"
                  >
                    <option value="newest">Sort By: Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="year-desc">Year: Newest</option>
                    <option value="year-asc">Year: Oldest</option>
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
                <p className="text-gray-400 text-lg">No motorbikes match your filters.</p>
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="text-[#DC2626] font-medium mt-2 hover:underline"
                >
                  Clear all filters
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
                  Load More ({filteredBikes.length - showCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
