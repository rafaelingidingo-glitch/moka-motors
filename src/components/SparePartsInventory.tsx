'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { SlidersHorizontal, ArrowUpDown, Wrench } from 'lucide-react'
import SparePartCard from './SparePartCard'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
  images: string
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
  priceRange: [0, Infinity],
  inStockOnly: false,
}

export default function SparePartsInventory() {
  const [parts, setParts] = useState<SparePart[]>([])
  // Committed filters - these actually filter the product list
  const [filters, setFilters] = useState<PartFilterState>(defaultFilters)
  // Pending filters - UI changes update these, committed on "Apply Filter"
  const [pendingFilters, setPendingFilters] = useState<PartFilterState>(defaultFilters)
  const [sort, setSort] = useState('newest')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showCount, setShowCount] = useState(6)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    type: true,
    brand: true,
    price: true,
    stock: true,
  })

  const { t } = useTranslation()

  const typeKeyMap: Record<string, string> = {
    'Engine Parts': 'spareParts.types.engineParts',
    'Body Parts': 'spareParts.types.bodyParts',
    'Electrical': 'spareParts.types.electrical',
    'Brakes': 'spareParts.types.brakes',
    'Tires': 'spareParts.types.tires',
    'Filters': 'spareParts.types.filters',
    'Chain/Sprocket': 'spareParts.types.chainSprocket',
    'Accessories': 'spareParts.types.accessories',
  }

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

  // Sync pending filters when committed filters change (e.g., on Clear All)
  useEffect(() => {
    setPendingFilters(filters)
  }, [filters])

  const toggleType = (type: string) => {
    const newTypes = pendingFilters.types.includes(type)
      ? pendingFilters.types.filter((t) => t !== type)
      : [...pendingFilters.types, type]
    setPendingFilters({ ...pendingFilters, types: newTypes })
  }

  const toggleBrand = (brand: string) => {
    const newBrands = pendingFilters.brands.includes(brand)
      ? pendingFilters.brands.filter((b) => b !== brand)
      : [...pendingFilters.brands, brand]
    setPendingFilters({ ...pendingFilters, brands: newBrands })
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Check if pending filters differ from committed filters
  const hasPendingChanges =
    JSON.stringify(pendingFilters) !== JSON.stringify(filters)

  const handleApply = useCallback(() => {
    setFilters(pendingFilters)
    setShowCount(6)
    setIsFilterOpen(false)
  }, [pendingFilters])

  const handleClear = useCallback(() => {
    setPendingFilters(defaultFilters)
    setFilters(defaultFilters)
    setShowCount(6)
  }, [])

  const activeFilterCount =
    pendingFilters.types.length +
    pendingFilters.brands.length +
    (pendingFilters.priceRange[0] > 0 || isFinite(pendingFilters.priceRange[1]) ? 1 : 0) +
    (pendingFilters.inStockOnly ? 1 : 0)

  const filterContent = (
    <div className="space-y-1">
      {/* Header Banner - matching design inspiration */}
      <div className="bg-[#DC2626] text-white px-4 py-3 flex items-center gap-2 -mx-5 -mt-5 mb-4">
        <SlidersHorizontal className="h-5 w-5" />
        <h3 className="font-black text-sm uppercase tracking-wider">{t('filter.filterParts')}</h3>
        {activeFilterCount > 0 && (
          <span className="ml-auto bg-white text-[#DC2626] text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </div>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-xs text-gray-500">{t('filter.filtersActive', { count: activeFilterCount })}</span>
          <button
            onClick={handleClear}
            className="text-[#DC2626] text-xs font-bold hover:underline uppercase tracking-wider"
          >
            {t('filter.clearAll')}
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
          {t('filter.selectType')}
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
                  checked={pendingFilters.types.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                  className="data-[state=checked]:bg-[#DC2626] data-[state=checked]:border-[#DC2626]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#111111] transition-colors">
                  {t(typeKeyMap[type] || type)}
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
          {t('filter.selectBrand')}
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
                  checked={pendingFilters.brands.includes(brand)}
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
          {t('filter.priceRange')}
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.price && (
          <div className="mt-2 px-1 space-y-3">
            <p className="text-xs text-[#DC2626] font-semibold">
              Range: TZS {pendingFilters.priceRange[0].toLocaleString()} — {isFinite(pendingFilters.priceRange[1]) ? `TZS ${pendingFilters.priceRange[1].toLocaleString()}` : t('filter.noLimit')}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
                  {t('filter.minPrice')}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">TZS</span>
                  <input
                    type="number"
                    min={0}
                    value={pendingFilters.priceRange[0] || ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value)
                      if (!isNaN(val) && val >= 0) {
                        setPendingFilters({ ...pendingFilters, priceRange: [val, pendingFilters.priceRange[1]] })
                      }
                    }}
                    placeholder="0"
                    className="w-full pl-11 pr-2 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20 bg-white text-[#111111] font-medium [appearance:none] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <span className="text-gray-300 mt-5">—</span>
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
                  {t('filter.maxPrice')}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">TZS</span>
                  <input
                    type="number"
                    min={0}
                    value={isFinite(pendingFilters.priceRange[1]) ? pendingFilters.priceRange[1] || '' : ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? Infinity : Number(e.target.value)
                      if (!isNaN(val) && (val === Infinity || val >= 0)) {
                        setPendingFilters({ ...pendingFilters, priceRange: [pendingFilters.priceRange[0], val] })
                      }
                    }}
                    placeholder={t('filter.noLimit')}
                    className="w-full pl-11 pr-2 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20 bg-white text-[#111111] font-medium [appearance:none] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
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
          {t('filter.availability')}
          {expandedSections.stock ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.stock && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">{t('filter.inStockOnly')}</span>
            <Switch
              checked={pendingFilters.inStockOnly}
              onCheckedChange={(checked) =>
                setPendingFilters({ ...pendingFilters, inStockOnly: checked })
              }
            />
          </div>
        )}
      </div>

      {/* Apply Filter Button */}
      <div className="pt-4 sticky bottom-0 bg-white pb-1 lg:static lg:pb-0">
        <Button
          onClick={handleApply}
          className={`w-full font-bold rounded-sm transition-all ${
            hasPendingChanges
              ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-md animate-pulse'
              : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'
          }`}
        >
          {hasPendingChanges ? t('filter.applyChanges') : t('filter.apply')}
        </Button>
      </div>
    </div>
  )

  return (
    <section id="spare-parts" className="py-12 md:py-20 lg:py-28 bg-white" style={{ overflowAnchor: 'none' }}>
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
              {t('spareParts.tag')}
            </p>
            <div className="w-8 h-[2px] bg-[#DC2626]" />
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-[#111111]">
            {t('spareParts.heading1')} <span className="text-[#DC2626]">{t('spareParts.heading2')}</span>
          </h2>
          <p className="text-[#6B7280] mt-4 max-w-2xl mx-auto">
            {t('spareParts.description')}
          </p>
        </motion.div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              variant="outline"
              className="flex items-center gap-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white rounded-sm w-full justify-center"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t('filter.filters')}
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
              <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-80 bg-white shadow-2xl flex flex-col">
                <div className="overflow-y-auto flex-1 p-5">
                  {filterContent}
                </div>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-[#F5F5F5] rounded-sm p-3 border border-gray-200">
              <p className="text-sm text-gray-600">
                {t('spareParts.searchResults')}{' '}
                <span className="font-black text-[#111111]">{filteredParts.length}</span>{' '}
                {t('spareParts.partsWord')}
              </p>
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border border-gray-200 rounded-sm px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#DC2626] max-w-[180px]"
                >
                  <option value="newest">{t('spareParts.sortFeatured')}</option>
                  <option value="price-asc">{t('spareParts.sortPriceLow')}</option>
                  <option value="price-desc">{t('spareParts.sortPriceHigh')}</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredParts.length === 0 ? (
              <div className="text-center py-16 bg-[#F5F5F5] rounded-sm">
                <Wrench className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  {t('spareParts.noMatch')}
                </p>
                <button
                  onClick={handleClear}
                  className="text-[#DC2626] font-medium mt-2 hover:underline"
                >
                  {t('spareParts.clearFilters')}
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
                  {t('spareParts.loadMore')} ({filteredParts.length - showCount} {t('spareParts.remaining')})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
