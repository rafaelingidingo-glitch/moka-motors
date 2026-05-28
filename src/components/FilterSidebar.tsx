'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, X, SlidersHorizontal, Bike } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface FilterState {
  brands: string[]
  categories: string[]
  priceRange: [number, number]
  year: string
  engineSize: string
}

interface FilterSidebarProps {
  type: 'motorbike' | 'spare-part'
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClear: () => void
  isOpen: boolean
  onToggle: () => void
}

const bikeBrands = ['Honda', 'Kawasaki', 'KTM', 'Yamaha']
const bikeCategoryKeys = ['Sport', 'Cruiser', 'Off-Road', 'Standard', 'Scooter'] as const
const partBrands = ['Honda', 'Yamaha', 'Kawasaki', 'KTM', 'Universal']
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

const currentYear = new Date().getFullYear()

export default function FilterSidebar({
  type,
  filters,
  onFilterChange,
  onClear,
  isOpen,
  onToggle,
}: FilterSidebarProps) {
  const { t } = useTranslation()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brand: true,
    category: true,
    price: true,
    year: true,
    engineSize: false,
  })

  // Pending filters: UI changes update this, only committed on "Apply Filter"
  const [pendingFilters, setPendingFilters] = useState<FilterState>(filters)

  // Sync pending filters when the parent filters change (e.g., on Clear All)
  useEffect(() => {
    setPendingFilters(filters)
  }, [filters])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleBrand = (brand: string) => {
    const newBrands = pendingFilters.brands.includes(brand)
      ? pendingFilters.brands.filter((b) => b !== brand)
      : [...pendingFilters.brands, brand]
    setPendingFilters({ ...pendingFilters, brands: newBrands })
  }

  const toggleCategory = (category: string) => {
    const newCats = pendingFilters.categories.includes(category)
      ? pendingFilters.categories.filter((c) => c !== category)
      : [...pendingFilters.categories, category]
    setPendingFilters({ ...pendingFilters, categories: newCats })
  }

  const bikeCategoryLabels: Record<string, string> = {
    'Sport': t('filter.categories.sport'),
    'Cruiser': t('filter.categories.cruiser'),
    'Off-Road': t('filter.categories.offRoad'),
    'Standard': t('filter.categories.standard'),
    'Scooter': t('filter.categories.scooter'),
  }

  const brands = type === 'motorbike' ? bikeBrands : partBrands
  const categories = type === 'motorbike' ? bikeCategoryKeys : partTypes

  const activeFilterCount =
    pendingFilters.brands.length +
    pendingFilters.categories.length +
    (pendingFilters.priceRange[0] > 0 || isFinite(pendingFilters.priceRange[1]) ? 1 : 0) +
    (pendingFilters.year ? 1 : 0) +
    (pendingFilters.engineSize ? 1 : 0)

  // Check if pending filters differ from committed filters (to show indicator)
  const hasPendingChanges =
    JSON.stringify(pendingFilters) !== JSON.stringify(filters)

  const handleApply = () => {
    onFilterChange(pendingFilters)
    // Only close overlay on mobile (where the overlay is visible)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onToggle()
    }
  }

  const handleClear = () => {
    setPendingFilters({
      brands: [],
      categories: [],
      priceRange: [0, Infinity],
      year: '',
      engineSize: '',
    })
    onClear()
  }

  const filterContent = (
    <div className="space-y-1">
      {/* Header Banner - matching design inspiration */}
      <div className="bg-[#DC2626] text-white px-4 py-3 flex items-center gap-2 -mx-5 -mt-5 mb-4">
        {type === 'motorbike' ? (
          <Bike className="h-5 w-5" />
        ) : (
          <SlidersHorizontal className="h-5 w-5" />
        )}
        <h3 className="font-black text-sm uppercase tracking-wider">
          {type === 'motorbike' ? t('filter.searchOptions') : t('filter.filterParts')}
        </h3>
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
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Brand Filter */}
      <div className="border-b border-gray-100 pb-3">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full py-3 font-bold text-xs uppercase tracking-wider text-[#111111]"
        >
          {t('filter.selectMake')}
          {expandedSections.brand ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.brand && (
          <div className="space-y-2.5 mt-1">
            {brands.map((brand) => (
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

      {/* Category/Type Filter */}
      <div className="border-b border-gray-100 pb-3">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full py-3 font-bold text-xs uppercase tracking-wider text-[#111111]"
        >
          {type === 'motorbike' ? t('filter.selectCategory') : t('filter.selectType')}
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2.5 mt-1">
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <Checkbox
                  checked={pendingFilters.categories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  className="data-[state=checked]:bg-[#DC2626] data-[state=checked]:border-[#DC2626]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#111111] transition-colors">
                  {type === 'motorbike' ? (bikeCategoryLabels[cat] || cat) : cat}
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
                        setPendingFilters({
                          ...pendingFilters,
                          priceRange: [val, pendingFilters.priceRange[1]],
                        })
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
                        setPendingFilters({
                          ...pendingFilters,
                          priceRange: [pendingFilters.priceRange[0], val],
                        })
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

      {/* Year (motorbikes only) */}
      {type === 'motorbike' && (
        <div className="border-b border-gray-100 pb-3">
          <button
            onClick={() => toggleSection('year')}
            className="flex items-center justify-between w-full py-3 font-bold text-xs uppercase tracking-wider text-[#111111]"
          >
            {t('filter.modelYear')}
            {expandedSections.year ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>
          {expandedSections.year && (
            <div className="mt-2 px-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
                    {t('filter.fromYear')}
                  </label>
                  <input
                    type="number"
                    min={2000}
                    max={currentYear}
                    value={pendingFilters.year ? pendingFilters.year.split('-')[0] : ''}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '' || (!isNaN(Number(val)) && Number(val) >= 0)) {
                        const toYear = pendingFilters.year ? pendingFilters.year.split('-')[1] : ''
                        setPendingFilters({
                          ...pendingFilters,
                          year: val || toYear ? [val, toYear].filter(Boolean).join('-') : '',
                        })
                      }
                    }}
                    placeholder={t('filter.yearPlaceholder')}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20 bg-white text-[#111111] font-medium [appearance:none] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <span className="text-gray-300 mt-5">—</span>
                <div className="flex-1">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
                    {t('filter.toYear')}
                  </label>
                  <input
                    type="number"
                    min={2000}
                    max={currentYear}
                    value={pendingFilters.year ? pendingFilters.year.split('-')[1] : ''}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '' || (!isNaN(Number(val)) && Number(val) >= 0)) {
                        const fromYear = pendingFilters.year ? pendingFilters.year.split('-')[0] : ''
                        setPendingFilters({
                          ...pendingFilters,
                          year: fromYear || val ? [fromYear, val].filter(Boolean).join('-') : '',
                        })
                      }
                    }}
                    placeholder={t('filter.yearPlaceholder')}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20 bg-white text-[#111111] font-medium [appearance:none] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Engine Size (motorbikes only) */}
      {type === 'motorbike' && (
        <div className="pb-3">
          <button
            onClick={() => toggleSection('engineSize')}
            className="flex items-center justify-between w-full py-3 font-bold text-xs uppercase tracking-wider text-[#111111]"
          >
            {t('filter.engineSize')}
            {expandedSections.engineSize ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>
          {expandedSections.engineSize && (
            <div className="flex flex-wrap gap-2 mt-1">
              {['150-250cc', '250-400cc', '400-600cc', '600-1000cc', '1000cc+'].map(
                (es) => (
                  <button
                    key={es}
                    onClick={() =>
                      setPendingFilters({
                        ...pendingFilters,
                        engineSize: pendingFilters.engineSize === es ? '' : es,
                      })
                    }
                    className={`px-4 py-2 rounded-sm text-sm font-semibold transition-all ${
                      pendingFilters.engineSize === es
                        ? 'bg-[#DC2626] text-white shadow-sm'
                        : 'bg-[#F5F5F5] text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {es}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}

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
          {hasPendingChanges ? t('filter.applyChanges') || 'Apply Changes' : t('filter.apply')}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={onToggle}
          variant="outline"
          className="flex items-center gap-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white rounded-sm"
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
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onToggle} />
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
    </>
  )
}
