'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Bike,
  Wrench,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
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

type Tab = 'login' | 'motorbikes' | 'spare-parts'

export default function AdminPanel() {
  const { isLoggedIn, login, logout, isAdminPanelOpen, setAdminPanelOpen } =
    useAdminStore()
  const [tab, setTab] = useState<Tab>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [motorbikes, setMotorbikes] = useState<Motorbike[]>([])
  const [spareParts, setSpareParts] = useState<SparePart[]>([])
  const [editingItem, setEditingItem] = useState<Motorbike | SparePart | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [form, setForm] = useState<Record<string, string>>({
    name: '',
    brand: '',
    category: '',
    price: '',
    year: '',
    engineSize: '',
    mileage: '',
    color: '',
    description: '',
    imageUrl: '',
    type: '',
    compatibility: '',
  })

  const fetchMotorbikes = async () => {
    const res = await fetch('/api/motorbikes')
    const data = await res.json()
    setMotorbikes(data)
  }

  const fetchSpareParts = async () => {
    const res = await fetch('/api/spare-parts')
    const data = await res.json()
    setSpareParts(data)
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/motorbikes')
        .then((res) => res.json())
        .then((data) => setMotorbikes(data))
        .catch(console.error)
      fetch('/api/spare-parts')
        .then((res) => res.json())
        .then((data) => setSpareParts(data))
        .catch(console.error)
    }
  }, [isLoggedIn])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.success) {
        login()
        setTab('motorbikes')
        toast.success('Logged in successfully!')
      } else {
        setLoginError(data.error || 'Invalid credentials')
      }
    } catch {
      setLoginError('Login failed. Please try again.')
    }
  }

  const handleLogout = () => {
    logout()
    setTab('login')
    setUsername('')
    setPassword('')
    toast.success('Logged out')
  }

  const resetForm = () => {
    setForm({
      name: '',
      brand: '',
      category: '',
      price: '',
      year: '',
      engineSize: '',
      mileage: '',
      color: '',
      description: '',
      imageUrl: '',
      type: '',
      compatibility: '',
    })
    setEditingItem(null)
    setIsAdding(false)
    setShowForm(false)
  }

  const handleEditMotorbike = (bike: Motorbike) => {
    setEditingItem(bike)
    setIsAdding(false)
    setShowForm(true)
    setForm({
      name: bike.name,
      brand: bike.brand,
      category: bike.category,
      price: String(bike.price),
      year: String(bike.year),
      engineSize: bike.engineSize,
      mileage: bike.mileage || '',
      color: bike.color || '',
      description: bike.description,
      imageUrl: bike.imageUrl,
      type: '',
      compatibility: '',
    })
  }

  const handleEditSparePart = (part: SparePart) => {
    setEditingItem(part)
    setIsAdding(false)
    setShowForm(true)
    setForm({
      name: part.name,
      brand: part.brand,
      category: '',
      price: String(part.price),
      year: '',
      engineSize: '',
      mileage: '',
      color: '',
      description: part.description,
      imageUrl: part.imageUrl,
      type: part.type,
      compatibility: part.compatibility,
    })
  }

  const handleSaveMotorbike = async () => {
    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: form.price,
      year: form.year,
      engineSize: form.engineSize,
      mileage: form.mileage || null,
      color: form.color || null,
      description: form.description,
      imageUrl: form.imageUrl,
      featured: false,
      isNewStock: false,
    }

    try {
      if (editingItem) {
        await fetch(`/api/motorbikes/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        toast.success('Motorbike updated!')
      } else {
        await fetch('/api/motorbikes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        toast.success('Motorbike added!')
      }
      fetchMotorbikes()
      resetForm()
    } catch {
      toast.error('Failed to save motorbike')
    }
  }

  const handleSaveSparePart = async () => {
    const payload = {
      name: form.name,
      type: form.type,
      brand: form.brand,
      compatibility: form.compatibility,
      price: form.price,
      description: form.description,
      imageUrl: form.imageUrl,
      inStock: true,
      featured: false,
    }

    try {
      if (editingItem) {
        await fetch(`/api/spare-parts/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        toast.success('Spare part updated!')
      } else {
        await fetch('/api/spare-parts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        toast.success('Spare part added!')
      }
      fetchSpareParts()
      resetForm()
    } catch {
      toast.error('Failed to save spare part')
    }
  }

  const handleDeleteMotorbike = async (id: string) => {
    if (!confirm('Are you sure you want to delete this motorbike?')) return
    try {
      await fetch(`/api/motorbikes/${id}`, { method: 'DELETE' })
      toast.success('Motorbike deleted!')
      fetchMotorbikes()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleDeleteSparePart = async (id: string) => {
    if (!confirm('Are you sure you want to delete this spare part?')) return
    try {
      await fetch(`/api/spare-parts/${id}`, { method: 'DELETE' })
      toast.success('Spare part deleted!')
      fetchSpareParts()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleToggleFeatured = async (
    id: string,
    type: 'motorbike' | 'spare-part',
    current: boolean
  ) => {
    try {
      if (type === 'motorbike') {
        await fetch(`/api/motorbikes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featured: !current }),
        })
        fetchMotorbikes()
      } else {
        await fetch(`/api/spare-parts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featured: !current }),
        })
        fetchSpareParts()
      }
      toast.success('Status updated!')
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleToggleNewStock = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/motorbikes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isNewStock: !current }),
      })
      fetchMotorbikes()
      toast.success('Status updated!')
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleToggleInStock = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/spare-parts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !current }),
      })
      fetchSpareParts()
      toast.success('Stock status updated!')
    } catch {
      toast.error('Failed to update')
    }
  }

  return (
    <AnimatePresence>
      {isAdminPanelOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setAdminPanelOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#111111]">
              <h2 className="font-bold text-lg text-white">Admin Panel</h2>
              <div className="flex items-center gap-2">
                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-[#DC2626] flex items-center gap-1 text-sm transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                )}
                <button
                  onClick={() => setAdminPanelOpen(false)}
                  className="text-gray-300 hover:text-white p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {!isLoggedIn ? (
                /* Login Form */
                <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-16">
                  <h3 className="text-xl font-bold text-[#111111] text-center mb-6">
                    Admin Login
                  </h3>
                  {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md p-3 mb-4">
                      {loginError}
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                        placeholder="Enter password"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-3 rounded-md transition-colors"
                    >
                      Login
                    </button>
                  </div>
                </form>
              ) : (
                /* Admin Dashboard */
                <div>
                  {/* Tabs */}
                  <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => {
                        setTab('motorbikes')
                        resetForm()
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all ${
                        tab === 'motorbikes'
                          ? 'bg-[#DC2626] text-white shadow'
                          : 'text-gray-600 hover:text-[#111111]'
                      }`}
                    >
                      <Bike className="h-4 w-4" />
                      Motorbikes
                    </button>
                    <button
                      onClick={() => {
                        setTab('spare-parts')
                        resetForm()
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all ${
                        tab === 'spare-parts'
                          ? 'bg-[#DC2626] text-white shadow'
                          : 'text-gray-600 hover:text-[#111111]'
                      }`}
                    >
                      <Wrench className="h-4 w-4" />
                      Spare Parts
                    </button>
                  </div>

                  {/* Motorbikes Tab */}
                  {tab === 'motorbikes' && !showForm && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[#111111]">
                          Motorbikes ({motorbikes.length})
                        </h3>
                        <button
                          onClick={() => {
                            resetForm()
                            setIsAdding(true)
                            setShowForm(true)
                          }}
                          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add New
                        </button>
                      </div>
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                        {motorbikes.map((bike) => (
                          <div
                            key={bike.id}
                            className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                          >
                            <img
                              src={bike.imageUrl}
                              alt={bike.name}
                              className="w-16 h-16 object-cover rounded-md shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-[#111111] truncate">
                                {bike.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {bike.brand} • {bike.year} •{' '}
                                <span className="text-[#DC2626] font-bold">
                                  TZS {bike.price.toLocaleString()}
                                </span>
                              </p>
                              <div className="flex gap-1 mt-1">
                                {bike.featured && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                                    Featured
                                  </span>
                                )}
                                {bike.isNewStock && (
                                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
                                    New Stock
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  handleToggleFeatured(bike.id, 'motorbike', bike.featured)
                                }
                                className={`p-1.5 rounded transition-colors ${
                                  bike.featured
                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                    : 'text-gray-400 hover:bg-gray-100'
                                }`}
                                title="Toggle Featured"
                              >
                                {bike.featured ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleNewStock(bike.id, bike.isNewStock)
                                }
                                className={`p-1.5 rounded transition-colors text-xs font-bold ${
                                  bike.isNewStock
                                    ? 'text-[#DC2626] hover:bg-red-50'
                                    : 'text-gray-400 hover:bg-gray-100'
                                }`}
                                title="Toggle New Stock"
                              >
                                NEW
                              </button>
                              <button
                                onClick={() => handleEditMotorbike(bike)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMotorbike(bike.id)}
                                className="p-1.5 text-gray-400 hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Spare Parts Tab */}
                  {tab === 'spare-parts' && !showForm && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[#111111]">
                          Spare Parts ({spareParts.length})
                        </h3>
                        <button
                          onClick={() => {
                            resetForm()
                            setIsAdding(true)
                            setShowForm(true)
                          }}
                          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add New
                        </button>
                      </div>
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                        {spareParts.map((part) => (
                          <div
                            key={part.id}
                            className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                          >
                            <img
                              src={part.imageUrl}
                              alt={part.name}
                              className="w-16 h-16 object-cover rounded-md shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-[#111111] truncate">
                                {part.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {part.brand} • {part.type} •{' '}
                                <span className="text-[#DC2626] font-bold">
                                  TZS {part.price.toLocaleString()}
                                </span>
                              </p>
                              <div className="flex gap-1 mt-1">
                                {part.featured && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                                    Featured
                                  </span>
                                )}
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                    part.inStock
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {part.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  handleToggleFeatured(
                                    part.id,
                                    'spare-part',
                                    part.featured
                                  )
                                }
                                className={`p-1.5 rounded transition-colors ${
                                  part.featured
                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                    : 'text-gray-400 hover:bg-gray-100'
                                }`}
                                title="Toggle Featured"
                              >
                                {part.featured ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleInStock(part.id, part.inStock)
                                }
                                className={`p-1.5 rounded transition-colors text-xs font-bold ${
                                  part.inStock
                                    ? 'text-green-600 hover:bg-green-50'
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                                title="Toggle Stock"
                              >
                                {part.inStock ? '✓' : '✗'}
                              </button>
                              <button
                                onClick={() => handleEditSparePart(part)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSparePart(part.id)}
                                className="p-1.5 text-gray-400 hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  {showForm && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[#111111]">
                          {isAdding
                            ? tab === 'motorbikes'
                              ? 'Add Motorbike'
                              : 'Add Spare Part'
                            : 'Edit'}
                        </h3>
                        <button
                          onClick={resetForm}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Brand *
                            </label>
                            <select
                              value={form.brand}
                              onChange={(e) => setForm({ ...form, brand: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                            >
                              <option value="">Select</option>
                              <option value="Honda">Honda</option>
                              <option value="Kawasaki">Kawasaki</option>
                              <option value="KTM">KTM</option>
                              <option value="Yamaha">Yamaha</option>
                              <option value="Universal">Universal</option>
                            </select>
                          </div>
                          {tab === 'motorbikes' ? (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                              </label>
                              <select
                                value={form.category}
                                onChange={(e) =>
                                  setForm({ ...form, category: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                              >
                                <option value="">Select</option>
                                <option value="Sport">Sport</option>
                                <option value="Cruiser">Cruiser</option>
                                <option value="Off-Road">Off-Road</option>
                                <option value="Standard">Standard</option>
                                <option value="Scooter">Scooter</option>
                              </select>
                            </div>
                          ) : (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type *
                              </label>
                              <select
                                value={form.type}
                                onChange={(e) =>
                                  setForm({ ...form, type: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                              >
                                <option value="">Select</option>
                                <option value="Engine Parts">Engine Parts</option>
                                <option value="Body Parts">Body Parts</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Brakes">Brakes</option>
                                <option value="Tires">Tires</option>
                                <option value="Filters">Filters</option>
                                <option value="Chain/Sprocket">Chain/Sprocket</option>
                                <option value="Accessories">Accessories</option>
                              </select>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price (TZS) *
                            </label>
                            <input
                              type="number"
                              value={form.price}
                              onChange={(e) => setForm({ ...form, price: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                            />
                          </div>
                          {tab === 'motorbikes' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year *
                              </label>
                              <input
                                type="number"
                                value={form.year}
                                onChange={(e) => setForm({ ...form, year: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                              />
                            </div>
                          )}
                        </div>
                        {tab === 'motorbikes' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Engine Size *
                              </label>
                              <input
                                type="text"
                                value={form.engineSize}
                                onChange={(e) =>
                                  setForm({ ...form, engineSize: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                                placeholder="e.g. 599cc"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mileage
                              </label>
                              <input
                                type="text"
                                value={form.mileage}
                                onChange={(e) =>
                                  setForm({ ...form, mileage: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                                placeholder="e.g. 2,500 km"
                              />
                            </div>
                          </div>
                        )}
                        {tab === 'spare-parts' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Compatibility *
                            </label>
                            <input
                              type="text"
                              value={form.compatibility}
                              onChange={(e) =>
                                setForm({ ...form, compatibility: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                              placeholder="e.g. Honda CBR, CB series"
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            value={form.description}
                            onChange={(e) =>
                              setForm({ ...form, description: e.target.value })
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL
                          </label>
                          <input
                            type="text"
                            value={form.imageUrl}
                            onChange={(e) =>
                              setForm({ ...form, imageUrl: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                            placeholder="/images/bike-xxx.png"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={
                              tab === 'motorbikes'
                                ? handleSaveMotorbike
                                : handleSaveSparePart
                            }
                            className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-2.5 rounded-md transition-colors"
                          >
                            {isAdding ? 'Add' : 'Save Changes'}
                          </button>
                          <button
                            onClick={resetForm}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-md transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
