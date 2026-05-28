'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, ArrowUpDown, Wrench } from 'lucide-react'
import SparePartCard from './SparePartCard'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

interface SparePart {
  id: string
  name: string
  type: string
  brand: string
  compatibility: string
  price: number
  description: string
  imageUrl: string
  inStock: boolean
  featured: boolean
}

interface PartFilterState {
  types: string[]
  brands: string[]
  priceRange: [number, number]
  inStockOnly: boolean
}

const partTypes = [
  'Engine Parts',
  'Body Parts',
  'Electrical',
  'Brakes',
  'Tires',
  'Filters',
  'Chain/Sprocket',
  'Accessories',
]
const partBrands = ['Honda', 'Yamaha', 'Kawasaki', 'KTM', 'Universal']

const defaultFilters: PartFilterState = {
  types: [],
  brands: [],
  priceRange: [0, 600000],
  inStockOnly: false,
}

export default function SparePartsInventory() {
  const [parts, setParts] = useState<SparePart[]>([])
  const [filters, setFilters] = useState<PartFilterState>(defaultFilters)
  const [sort, setSort] = useState('newest')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showCount, setShowCount] = useState(6)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    type: true,
    brand: true,
    price: true,
    stock: true,
  })

  useEffect(() => {
    fetch('/api/spare-parts')
      .then((res) => res.json())
      .then((data) => setParts(data))
      .catch(console.error)
  }, [])

  const filteredParts = useMemo(() => {
    let result = [...parts]

    if (filters.types.length > 0) {
      result = result.filter((p) => filters.types.includes(p.type))
    }
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand))
    }
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock)
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
    }

    return result
  }, [parts, filters, sort])

  const toggleType = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]
    setFilters({ ...filters, types: newTypes })
    setShowCount(6)
  }

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    setFilters({ ...filters, brands: newBrands })
    setShowCount(6)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const activeFilterCount =
    filters.types.length +
    filters.brands.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 600000 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)

  const filterContent = (
    <div className="space-y-1">
      {/* Header Banner - matching design inspiration */}
      <div className="bg-[#DC2626] text-white px-4 py-3 flex items-center gap-2 -mx-5 -mt-5 mb-4">
        <SlidersHorizontal className="h-5 w-5" />
        <h3 className="font-black text-sm uppercase tracking-wider">Filter Parts</h3>
        {activeFilterCount > 0 && (
          <span className="ml-auto bg-white text-[#DC2626] text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </div>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-xs text-gray-500">{activeFilterCount} filters active</span>
          <button
            onClick={() => {
              setFilters(defaultFilters)
              setShowCount(6)
            }}
            className="text-[#DC2626] text-xs font-bold hover:underline uppercase tracking-wider"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Close button for mobile */}
      <div className="lg:hidden flex justify-end">
        <button
          onClick={() => setIsFilterOpen(false)}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Type Filter */}
      <div className="border-b border-gray-100 pb-3">
        <button
          onClick={() => toggleSection('type')}
          className="flex items-center justify-between w-full py-3 font-bold text-xs uppercase tracking-wider text-[#111111]"
        >
          Select Type
          {expandedSections.type ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.type && (
          <div className="space-y-2.5 mt-1">
            {partTypes.map((type) => (
              <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                <Checkbox
                  checked={filters.types.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                  className="data-[state=checked]:bg-[#DC2626] data-[state=checked]:border-[#DC2626]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#111111] transition-colors">
                  {type}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="border-b border-gray-100 pb-3">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full py-3 font-bold text-xs uppercase tracking-wider text-[#111111]"
        >
          Select Brand
          {expandedSections.brand ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.brand && (
          <div className="space-y-2.5 mt-1">
            {partBrands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <Checkbox
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                  className="data-[state=checked]:bg-[#DC2626] data-[state=checked]:border-[#DC2626]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#111111] transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-100 pb-3">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full py-3 font-bold text-xs uppercase tracking-wider text-[#111111]"
        >
          Price Range
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.price && (
          <div className="mt-2 px-1">
            <p className="text-xs text-[#DC2626] font-semibold mb-2">
              Range: TZS {filters.priceRange[0].toLocaleString()} - TZS {filters.priceRange[1].toLocaleString()}
            </p>
            <Slider
              value={filters.priceRange}
              min={0}
              max={600000}
              step={25000}
              onValueChange={(value) =>
                setFilters({ ...filters, priceRange: value as [number, number] })
              }
              className="mt-4"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>TZS {filters.priceRange[0].toLocaleString()}</span>
              <span>TZS {filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* In Stock Toggle */}
      <div className="pb-3">
        <button
          onClick={() => toggleSection('stock')}
          className="flex items-center justify-between w-full py-3 font-bold text-xs uppercase tracking-wider text-[#111111]"
        >
          Availability
          {expandedSections.stock ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.stock && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">In Stock Only</span>
            <Switch
              checked={filters.inStockOnly}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, inStockOnly: checked })
              }
            />
          </div>
        )}
      </div>

      {/* Apply Filter Button */}
      <div className="pt-4">
        <Button
          onClick={() => setIsFilterOpen(false)}
          className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-sm"
        >
          APPLY FILTER
        </Button>
      </div>
    </div>
  )

  return (
    <section id="spare-parts" className="py-20 md:py-28 bg-white">
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
              PARTS & ACCESSORIES
            </p>
            <div className="w-8 h-[2px] bg-[#DC2626]" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#111111]">
            Spare Parts <span className="text-[#DC2626]">Inventory</span>
          </h2>
          <p className="text-[#6B7280] mt-4 max-w-2xl mx-auto">
            Find the exact parts you need. Filter by type, brand, compatibility, and price.
          </p>
        </motion.div>

        {/* Layout */}
        <div className="flex gap-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              variant="outline"
              className="flex items-center gap-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white rounded-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#DC2626] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Overlay */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto p-5">
                {filterContent}
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-sm border border-gray-200 p-5 sticky top-24 shadow-sm">
              {filterContent}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-[#F5F5F5] rounded-sm p-3 border border-gray-200">
              <p className="text-sm text-gray-600">
                Your search returned{' '}
                <span className="font-black text-[#111111]">{filteredParts.length}</span>{' '}
                parts
              </p>
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border border-gray-200 rounded-sm px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#DC2626]"
                >
                  <option value="newest">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredParts.length === 0 ? (
              <div className="text-center py-16 bg-[#F5F5F5] rounded-sm">
                <Wrench className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  No spare parts match your filters.
                </p>
                <button
                  onClick={() => {
                    setFilters(defaultFilters)
                    setShowCount(6)
                  }}
                  className="text-[#DC2626] font-medium mt-2 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredParts.slice(0, showCount).map((part, i) => (
                  <motion.div
                    key={part.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <SparePartCard part={part} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More */}
            {showCount < filteredParts.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowCount((prev) => prev + 6)}
                  className="bg-[#111111] hover:bg-[#333333] text-white font-bold px-8 py-3 rounded-sm transition-colors"
                >
                  Load More ({filteredParts.length - showCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
