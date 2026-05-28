'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Bike,
  Wrench,
  Eye,
  EyeOff,
  ArrowLeft,
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Search,
  ChevronRight,
  BarChart3,
  Settings,
  Bell,
  Star,
  Upload,
  Image as ImageIcon,
  X,
  Link,
  Loader2,
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

type Tab = 'dashboard' | 'motorbikes' | 'spare-parts' | 'settings'

export default function AdminPage() {
  const { isLoggedIn, login, logout, closeAdminPage } = useAdminStore()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [motorbikes, setMotorbikes] = useState<Motorbike[]>([])
  const [spareParts, setSpareParts] = useState<SparePart[]>([])
  const [editingItem, setEditingItem] = useState<Motorbike | SparePart | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)

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
        setTab('dashboard')
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
    setTab('dashboard')
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
    setUploadPreview(null)
    setImageMode('upload')
  }

  const handleEditMotorbike = (bike: Motorbike) => {
    setEditingItem(bike)
    setIsAdding(false)
    setShowForm(true)
    setUploadPreview(null)
    setImageMode(bike.imageUrl.startsWith('/uploads/') ? 'upload' : 'url')
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
    setUploadPreview(null)
    setImageMode(part.imageUrl.startsWith('/uploads/') ? 'upload' : 'url')
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

  // ============ LOGIN SCREEN ============
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#DC2626]" />
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#DC2626]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#DC2626]/3 rounded-full blur-3xl" />

        {/* Back button */}
        <button
          onClick={closeAdminPage}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Website</span>
        </button>

        {/* Logo */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div className="bg-[#DC2626] p-1.5 rounded">
            <Bike className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-wider">
            MOKA <span className="text-[#DC2626]">MOTORS</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md px-6"
        >
          <div className="bg-[#1A1A1A] rounded-sm border border-gray-800 p-8 md:p-10 shadow-2xl">
            {/* Login Header */}
            <div className="text-center mb-8">
              <div className="bg-[#DC2626]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="h-8 w-8 text-[#DC2626]" />
              </div>
              <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm mt-2">
                Sign in to manage your inventory
              </p>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-sm p-3 mb-6">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                  placeholder="Enter password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-3.5 rounded-sm transition-all duration-300 shadow-lg shadow-[#DC2626]/20 hover:shadow-[#DC2626]/30"
              >
                Sign In
              </button>
            </form>

            <p className="text-gray-600 text-xs text-center mt-6">
              Moka Motors Admin Panel — Authorized access only
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // ============ ADMIN DASHBOARD (FULL PAGE) ============
  const sidebarItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'motorbikes' as Tab, label: 'Motorbikes', icon: Bike },
    { id: 'spare-parts' as Tab, label: 'Spare Parts', icon: Wrench },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ]

  const totalProducts = motorbikes.length + spareParts.length
  const featuredCount = motorbikes.filter(b => b.featured).length + spareParts.filter(p => p.featured).length
  const newStockCount = motorbikes.filter(b => b.isNewStock).length
  const outOfStockCount = spareParts.filter(p => !p.inStock).length

  const filteredMotorbikes = motorbikes.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSpareParts = spareParts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#111111] border-r border-gray-800 flex flex-col transition-all duration-300 shrink-0`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="bg-[#DC2626] p-1.5 rounded">
                <Bike className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm tracking-wider">
                MOKA <span className="text-[#DC2626]">ADMIN</span>
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-white p-1.5 rounded hover:bg-white/5 transition-colors"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); resetForm() }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                tab === item.id
                  ? 'bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-800 space-y-1">
          <button
            onClick={closeAdminPage}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Back to Website</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-400 hover:text-[#DC2626] hover:bg-[#DC2626]/5 transition-all"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-[#111111] border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 className="text-white font-bold text-lg">
              {tab === 'dashboard' && 'Dashboard'}
              {tab === 'motorbikes' && 'Motorbikes Management'}
              {tab === 'spare-parts' && 'Spare Parts Management'}
              {tab === 'settings' && 'Settings'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {(tab === 'motorbikes' || tab === 'spare-parts') && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1A1A1A] border border-gray-700 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#DC2626] transition-colors w-48 md:w-64"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <button className="relative text-gray-400 hover:text-white p-2 rounded-md hover:bg-white/5 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full" />
              </button>
              <div className="flex items-center gap-2 ml-2">
                <div className="w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                {sidebarOpen !== false && (
                  <span className="text-gray-300 text-sm font-medium hidden md:block">Admin</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ===== DASHBOARD TAB ===== */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Products', value: totalProducts, icon: Package, color: 'bg-blue-500/10 text-blue-400' },
                  { label: 'Featured Items', value: featuredCount, icon: Star, color: 'bg-yellow-500/10 text-yellow-400' },
                  { label: 'New Stock', value: newStockCount, icon: TrendingUp, color: 'bg-green-500/10 text-green-400' },
                  { label: 'Out of Stock', value: outOfStockCount, icon: Package, color: 'bg-red-500/10 text-red-400' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#1A1A1A] rounded-md border border-gray-800 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                      <div className={`p-2 rounded-md ${stat.color}`}>
                        <stat.icon className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => { setTab('motorbikes'); setIsAdding(true); setShowForm(true); setUploadPreview(null); setImageMode('upload') }}
                      className="w-full flex items-center gap-3 bg-[#111111] hover:bg-[#DC2626]/10 border border-gray-700 hover:border-[#DC2626]/30 rounded-md p-3 transition-all text-left group"
                    >
                      <div className="bg-[#DC2626]/10 group-hover:bg-[#DC2626]/20 p-2 rounded-md transition-colors">
                        <Bike className="h-5 w-5 text-[#DC2626]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">Add New Motorbike</p>
                        <p className="text-gray-500 text-xs">Add a motorbike to the inventory</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-600 ml-auto" />
                    </button>
                    <button
                      onClick={() => { setTab('spare-parts'); setIsAdding(true); setShowForm(true); setUploadPreview(null); setImageMode('upload') }}
                      className="w-full flex items-center gap-3 bg-[#111111] hover:bg-[#DC2626]/10 border border-gray-700 hover:border-[#DC2626]/30 rounded-md p-3 transition-all text-left group"
                    >
                      <div className="bg-[#DC2626]/10 group-hover:bg-[#DC2626]/20 p-2 rounded-md transition-colors">
                        <Wrench className="h-5 w-5 text-[#DC2626]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">Add New Spare Part</p>
                        <p className="text-gray-500 text-xs">Add a spare part to the inventory</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-600 ml-auto" />
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Inventory Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Motorbikes</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#DC2626] rounded-full"
                            style={{ width: `${motorbikes.length > 0 ? (motorbikes.length / totalProducts) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-bold w-8 text-right">{motorbikes.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Spare Parts</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${spareParts.length > 0 ? (spareParts.length / totalProducts) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-bold w-8 text-right">{spareParts.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Featured</span>
                      <span className="text-yellow-400 text-sm font-bold">{featuredCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">New Stock</span>
                      <span className="text-green-400 text-sm font-bold">{newStockCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Out of Stock</span>
                      <span className="text-red-400 text-sm font-bold">{outOfStockCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Distribution */}
              <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-6">
                <h3 className="text-white font-bold text-lg mb-4">Brand Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Honda', 'Kawasaki', 'KTM', 'Yamaha'].map((brand) => {
                    const bikeCount = motorbikes.filter(b => b.brand === brand).length
                    const partCount = spareParts.filter(p => p.brand === brand).length
                    return (
                      <div key={brand} className="bg-[#111111] rounded-md p-4 border border-gray-800">
                        <p className="text-white font-bold text-sm">{brand}</p>
                        <p className="text-gray-500 text-xs mt-1">{bikeCount} bikes, {partCount} parts</p>
                        <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#DC2626] rounded-full"
                            style={{ width: `${totalProducts > 0 ? ((bikeCount + partCount) / totalProducts) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===== MOTORBIKES TAB ===== */}
          {tab === 'motorbikes' && !showForm && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    {filteredMotorbikes.length} motorbike{filteredMotorbikes.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetForm()
                    setIsAdding(true)
                    setShowForm(true)
                  }}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold px-5 py-2.5 rounded-md flex items-center gap-2 transition-colors shadow-lg shadow-[#DC2626]/20"
                >
                  <Plus className="h-4 w-4" />
                  Add Motorbike
                </button>
              </div>

              {/* Table */}
              <div className="bg-[#1A1A1A] rounded-md border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Product</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Brand</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Category</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Price</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                        <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMotorbikes.map((bike) => (
                        <tr key={bike.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={bike.imageUrl}
                                alt={bike.name}
                                className="w-12 h-12 object-cover rounded-md shrink-0 bg-[#111111]"
                              />
                              <div>
                                <p className="text-white text-sm font-semibold">{bike.name}</p>
                                <p className="text-gray-500 text-xs">{bike.year} • {bike.engineSize}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-gray-300 text-sm">{bike.brand}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-gray-300 text-sm">{bike.category}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-[#DC2626] font-bold text-sm">TZS {bike.price.toLocaleString()}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1.5">
                              {bike.featured && (
                                <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded font-semibold">Featured</span>
                              )}
                              {bike.isNewStock && (
                                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-semibold">New</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleToggleFeatured(bike.id, 'motorbike', bike.featured)}
                                className={`p-1.5 rounded transition-colors ${
                                  bike.featured ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-gray-600 hover:bg-white/5'
                                }`}
                                title="Toggle Featured"
                              >
                                <Star className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleNewStock(bike.id, bike.isNewStock)}
                                className={`p-1.5 rounded transition-colors text-xs font-bold ${
                                  bike.isNewStock ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-600 hover:bg-white/5'
                                }`}
                                title="Toggle New Stock"
                              >
                                NEW
                              </button>
                              <button
                                onClick={() => handleEditMotorbike(bike)}
                                className="p-1.5 text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMotorbike(bike.id)}
                                className="p-1.5 text-gray-600 hover:text-[#DC2626] hover:bg-red-500/10 rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredMotorbikes.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-16 text-center">
                            <Bike className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500">No motorbikes found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== SPARE PARTS TAB ===== */}
          {tab === 'spare-parts' && !showForm && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    {filteredSpareParts.length} spare part{filteredSpareParts.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetForm()
                    setIsAdding(true)
                    setShowForm(true)
                  }}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold px-5 py-2.5 rounded-md flex items-center gap-2 transition-colors shadow-lg shadow-[#DC2626]/20"
                >
                  <Plus className="h-4 w-4" />
                  Add Spare Part
                </button>
              </div>

              {/* Table */}
              <div className="bg-[#1A1A1A] rounded-md border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Product</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Brand</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Type</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Price</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                        <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSpareParts.map((part) => (
                        <tr key={part.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={part.imageUrl}
                                alt={part.name}
                                className="w-12 h-12 object-cover rounded-md shrink-0 bg-[#111111]"
                              />
                              <div>
                                <p className="text-white text-sm font-semibold">{part.name}</p>
                                <p className="text-gray-500 text-xs">{part.compatibility}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-gray-300 text-sm">{part.brand}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-gray-300 text-sm">{part.type}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-[#DC2626] font-bold text-sm">TZS {part.price.toLocaleString()}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1.5">
                              {part.featured && (
                                <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded font-semibold">Featured</span>
                              )}
                              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                part.inStock ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {part.inStock ? 'In Stock' : 'Out'}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleToggleFeatured(part.id, 'spare-part', part.featured)}
                                className={`p-1.5 rounded transition-colors ${
                                  part.featured ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-gray-600 hover:bg-white/5'
                                }`}
                                title="Toggle Featured"
                              >
                                <Star className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleInStock(part.id, part.inStock)}
                                className={`p-1.5 rounded transition-colors text-xs font-bold ${
                                  part.inStock ? 'text-green-400 hover:bg-green-500/10' : 'text-red-400 hover:bg-red-500/10'
                                }`}
                                title="Toggle Stock"
                              >
                                {part.inStock ? '✓' : '✗'}
                              </button>
                              <button
                                onClick={() => handleEditSparePart(part)}
                                className="p-1.5 text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSparePart(part.id)}
                                className="p-1.5 text-gray-600 hover:text-[#DC2626] hover:bg-red-500/10 rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredSpareParts.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-16 text-center">
                            <Wrench className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500">No spare parts found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== FORM (Add/Edit) ===== */}
          {showForm && (tab === 'motorbikes' || tab === 'spare-parts') && (
            <div className="max-w-2xl">
              <div className="mb-6">
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to list
                </button>
              </div>
              <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-6 md:p-8">
                <h3 className="text-white font-bold text-xl mb-6">
                  {isAdding
                    ? tab === 'motorbikes'
                      ? 'Add New Motorbike'
                      : 'Add New Spare Part'
                    : 'Edit Item'}
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                      placeholder="Product name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Brand *</label>
                      <select
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                      >
                        <option value="">Select Brand</option>
                        <option value="Honda">Honda</option>
                        <option value="Kawasaki">Kawasaki</option>
                        <option value="KTM">KTM</option>
                        <option value="Yamaha">Yamaha</option>
                        <option value="Universal">Universal</option>
                      </select>
                    </div>
                    {tab === 'motorbikes' ? (
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Category *</label>
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                        >
                          <option value="">Select Category</option>
                          <option value="Sport">Sport</option>
                          <option value="Cruiser">Cruiser</option>
                          <option value="Off-Road">Off-Road</option>
                          <option value="Standard">Standard</option>
                          <option value="Scooter">Scooter</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Type *</label>
                        <select
                          value={form.type}
                          onChange={(e) => setForm({ ...form, type: e.target.value })}
                          className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                        >
                          <option value="">Select Type</option>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Price (TZS) *</label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                        placeholder="0"
                      />
                    </div>
                    {tab === 'motorbikes' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Year *</label>
                        <input
                          type="number"
                          value={form.year}
                          onChange={(e) => setForm({ ...form, year: e.target.value })}
                          className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                          placeholder="2024"
                        />
                      </div>
                    )}
                  </div>
                  {tab === 'motorbikes' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Engine Size *</label>
                        <input
                          type="text"
                          value={form.engineSize}
                          onChange={(e) => setForm({ ...form, engineSize: e.target.value })}
                          className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                          placeholder="e.g. 599cc"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Mileage</label>
                        <input
                          type="text"
                          value={form.mileage}
                          onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                          className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                          placeholder="e.g. 2,500 km"
                        />
                      </div>
                    </div>
                  )}
                  {tab === 'spare-parts' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Compatibility *</label>
                      <input
                        type="text"
                        value={form.compatibility}
                        onChange={(e) => setForm({ ...form, compatibility: e.target.value })}
                        className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                        placeholder="e.g. Honda CBR, CB series"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all resize-none"
                      placeholder="Product description..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Product Image</label>
                    
                    {/* Mode Toggle */}
                    <div className="flex gap-1 mb-4 bg-[#111111] rounded-md p-1 border border-gray-700">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-semibold transition-all ${
                          imageMode === 'upload'
                            ? 'bg-[#DC2626] text-white shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Upload className="h-4 w-4" />
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-semibold transition-all ${
                          imageMode === 'url'
                            ? 'bg-[#DC2626] text-white shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Link className="h-4 w-4" />
                        Image URL
                      </button>
                    </div>

                    {/* Upload Mode */}
                    {imageMode === 'upload' && (
                      <div>
                        <label
                          htmlFor="image-upload"
                          className={`relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-md cursor-pointer transition-all ${
                            isUploading
                              ? 'border-[#DC2626]/50 bg-[#DC2626]/5'
                              : uploadPreview || form.imageUrl
                                ? 'border-green-500/30 bg-green-500/5'
                                : 'border-gray-700 bg-[#111111] hover:border-[#DC2626]/50 hover:bg-[#DC2626]/5'
                          }`}
                        >
                          {isUploading ? (
                            <div className="flex flex-col items-center">
                              <Loader2 className="h-8 w-8 text-[#DC2626] animate-spin mb-2" />
                              <p className="text-gray-400 text-sm">Uploading...</p>
                            </div>
                          ) : uploadPreview || form.imageUrl ? (
                            <div className="relative w-full h-full p-2">
                              <img
                                src={uploadPreview || form.imageUrl}
                                alt="Preview"
                                className="w-full h-full object-contain rounded"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setUploadPreview(null)
                                  setForm({ ...form, imageUrl: '' })
                                }}
                                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="absolute bottom-3 left-3 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" />
                                Image uploaded
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Upload className="h-8 w-8 text-gray-500 mb-2" />
                              <p className="text-gray-300 text-sm font-medium">Click to upload image</p>
                              <p className="text-gray-600 text-xs mt-1">JPEG, PNG, GIF, WebP, SVG (max 5MB)</p>
                            </div>
                          )}
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return

                              // Validate size
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error('File too large. Maximum size is 5MB.')
                                return
                              }

                              // Show preview immediately
                              const reader = new FileReader()
                              reader.onload = (ev) => {
                                setUploadPreview(ev.target?.result as string)
                              }
                              reader.readAsDataURL(file)

                              // Upload to server
                              setIsUploading(true)
                              try {
                                const formData = new FormData()
                                formData.append('file', file)
                                const res = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData,
                                })
                                const data = await res.json()
                                if (data.success) {
                                  setForm({ ...form, imageUrl: data.url })
                                  toast.success('Image uploaded successfully!')
                                } else {
                                  toast.error(data.error || 'Upload failed')
                                  setUploadPreview(null)
                                }
                              } catch {
                                toast.error('Upload failed. Please try again.')
                                setUploadPreview(null)
                              } finally {
                                setIsUploading(false)
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}

                    {/* URL Mode */}
                    {imageMode === 'url' && (
                      <div className="space-y-3">
                        <div className="relative">
                          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <input
                            type="text"
                            value={form.imageUrl}
                            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                            placeholder="https://example.com/image.png or /images/bike.png"
                          />
                        </div>
                        {form.imageUrl && (
                          <div className="relative bg-[#111111] border border-gray-700 rounded-md p-3 h-32">
                            <img
                              src={form.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={tab === 'motorbikes' ? handleSaveMotorbike : handleSaveSparePart}
                      className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-3.5 rounded-md transition-colors shadow-lg shadow-[#DC2626]/20"
                    >
                      {isAdding ? 'Add Product' : 'Save Changes'}
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-[#1A1A1A] hover:bg-[#222222] text-gray-300 font-bold py-3.5 rounded-md transition-colors border border-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== SETTINGS TAB ===== */}
          {tab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-6 md:p-8">
                <h3 className="text-white font-bold text-lg mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value="admin"
                      readOnly
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Role</label>
                    <input
                      type="text"
                      value="Super Admin"
                      readOnly
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-6 md:p-8">
                <h3 className="text-white font-bold text-lg mb-6">Store Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Store Name</label>
                    <input
                      type="text"
                      value="Moka Motors"
                      readOnly
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">WhatsApp Number</label>
                    <input
                      type="text"
                      value="+255 625 260000"
                      readOnly
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value="Kariakoo, Dar es Salaam, Tanzania"
                      readOnly
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-red-500/5 rounded-md border border-red-500/20 p-6">
                <h3 className="text-red-400 font-bold text-lg mb-2">Danger Zone</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Logging out will end your admin session and you will need to sign in again.
                </p>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-6 py-2.5 rounded-md transition-colors border border-red-500/20 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
