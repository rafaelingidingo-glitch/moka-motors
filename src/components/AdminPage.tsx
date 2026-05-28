'use client'

import { useState, useEffect, useRef } from 'react'
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
  TrendingUp,
  Search,
  ChevronRight,
  Settings,
  Bell,
  Star,
  Upload,
  Image as ImageIcon,
  X,
  Link,
  Loader2,
  PlusCircle,
  Users,
  Shield,
  KeyRound,
  UserPlus,
  Check,
  Menu,
} from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { useTranslation } from '@/lib/i18n'
import { parseImages } from '@/lib/utils'
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
  images: string
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
  images: string
  inStock: boolean
  featured: boolean
}

type Tab = 'dashboard' | 'motorbikes' | 'spare-parts' | 'settings'

export default function AdminPage() {
  const { isLoggedIn, login, logout, closeAdminPage, currentAdmin } = useAdminStore()
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [motorbikes, setMotorbikes] = useState<Motorbike[]>([])
  const [spareParts, setSpareParts] = useState<SparePart[]>([])
  const [editingItem, setEditingItem] = useState<Motorbike | SparePart | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [imageList, setImageList] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Admin management state
  const [admins, setAdmins] = useState<Array<{ id: string; username: string; role: string; createdAt: string }>>([])
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [newAdminRole, setNewAdminRole] = useState('admin')
  const [showNewAdminForm, setShowNewAdminForm] = useState(false)
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

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
    type: '',
    compatibility: '',
  })

  const fetchMotorbikes = async () => {
    try {
      const res = await fetch('/api/motorbikes', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setMotorbikes(data)
    } catch (err) {
      console.error('Failed to fetch motorbikes:', err)
    }
  }

  const fetchSpareParts = async () => {
    try {
      const res = await fetch('/api/spare-parts', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setSpareParts(data)
    } catch (err) {
      console.error('Failed to fetch spare parts:', err)
    }
  }

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/list', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setAdmins(data.admins)
      }
    } catch (err) {
      console.error('Failed to fetch admins:', err)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/motorbikes', { credentials: 'include' })
        .then((res) => { if (!res.ok) throw new Error(); return res.json() })
        .then((data) => setMotorbikes(data))
        .catch(console.error)
      fetch('/api/spare-parts', { credentials: 'include' })
        .then((res) => { if (!res.ok) throw new Error(); return res.json() })
        .then((data) => setSpareParts(data))
        .catch(console.error)
      fetchAdmins()
    }
  }, [isLoggedIn])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.success) {
        login({ username: data.username, role: data.role })
        setTab('dashboard')
        toast.success(t('admin.loggedIn'))
      } else {
        setLoginError(data.error || 'Invalid credentials')
      }
    } catch {
      setLoginError(t('admin.loginFailed'))
    }
  }

  const handleLogout = async () => {
    // Clear the admin cookies
    document.cookie = 'admin_logged_in=; path=/; max-age=0'
    document.cookie = 'admin_user=; path=/; max-age=0'
    logout()
    setTab('dashboard')
    setUsername('')
    setPassword('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    toast.success(t('admin.loggedOut'))
  }

  const handleCreateAdmin = async () => {
    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
      toast.error(t('admin.usernamePasswordRequired'))
      return
    }
    if (newAdminUsername.trim().length < 3) {
      toast.error(t('admin.usernameMinLength'))
      return
    }
    if (newAdminPassword.length < 6) {
      toast.error(t('admin.passwordMinLengthAdmin'))
      return
    }

    setIsCreatingAdmin(true)
    try {
      const res = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: newAdminUsername.trim(),
          password: newAdminPassword,
          role: newAdminRole,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(t('admin.adminCreated', { username: newAdminUsername.trim() }))
        setNewAdminUsername('')
        setNewAdminPassword('')
        setNewAdminRole('admin')
        setShowNewAdminForm(false)
        fetchAdmins()
      } else {
        toast.error(data.error || 'Failed to create admin')
      }
    } catch {
      toast.error('Failed to create admin')
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string, adminUsername: string) => {
    if (!confirm(t('admin.deleteAdminConfirm', { username: adminUsername }))) return
    try {
      const res = await fetch(`/api/admin/delete?id=${adminId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        toast.success(t('admin.adminDeleted', { username: adminUsername }))
        fetchAdmins()
      } else {
        toast.error(data.error || 'Failed to delete admin')
      }
    } catch {
      toast.error('Failed to delete admin')
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t('admin.allFieldsRequired'))
      return
    }
    if (newPassword.length < 6) {
      toast.error(t('admin.passwordMinLength'))
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('admin.passwordsNoMatch'))
      return
    }

    setIsChangingPassword(true)
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(t('admin.passwordChanged'))
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(data.error || 'Failed to change password')
      }
    } catch {
      toast.error('Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
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
      type: '',
      compatibility: '',
    })
    setEditingItem(null)
    setIsAdding(false)
    setShowForm(false)
    setImageList([])
    setImageUrlInput('')
  }

  const handleEditMotorbike = (bike: Motorbike) => {
    setEditingItem(bike)
    setIsAdding(false)
    setShowForm(true)
    const parsedImages = parseImages(bike.images)
    setImageList(parsedImages)
    setImageUrlInput('')
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
      type: '',
      compatibility: '',
    })
  }

  const handleEditSparePart = (part: SparePart) => {
    setEditingItem(part)
    setIsAdding(false)
    setShowForm(true)
    const parsedImages = parseImages(part.images)
    setImageList(parsedImages)
    setImageUrlInput('')
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
      images: JSON.stringify(imageList),
      featured: false,
      isNewStock: false,
    }

    try {
      let res: Response
      if (editingItem) {
        res = await fetch(`/api/motorbikes/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/motorbikes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        })
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || t('admin.failedSave'))
        return
      }
      toast.success(editingItem ? t('admin.motorbikeUpdated') : t('admin.motorbikeAdded'))
      fetchMotorbikes()
      resetForm()
    } catch {
      toast.error(t('admin.failedSave'))
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
      images: JSON.stringify(imageList),
      inStock: true,
      featured: false,
    }

    try {
      let res: Response
      if (editingItem) {
        res = await fetch(`/api/spare-parts/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/spare-parts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        })
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || t('admin.failedSave'))
        return
      }
      toast.success(editingItem ? t('admin.sparePartUpdated') : t('admin.sparePartAdded'))
      fetchSpareParts()
      resetForm()
    } catch {
      toast.error(t('admin.failedSave'))
    }
  }

  const handleDeleteMotorbike = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm'))) return
    try {
      const res = await fetch(`/api/motorbikes/${id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) {
        toast.error(t('admin.failedDelete'))
        return
      }
      toast.success(t('admin.motorbikeDeleted'))
      fetchMotorbikes()
    } catch {
      toast.error(t('admin.failedDelete'))
    }
  }

  const handleDeleteSparePart = async (id: string) => {
    if (!confirm(t('admin.deleteSpareConfirm'))) return
    try {
      const res = await fetch(`/api/spare-parts/${id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) {
        toast.error(t('admin.failedDelete'))
        return
      }
      toast.success(t('admin.sparePartDeleted'))
      fetchSpareParts()
    } catch {
      toast.error(t('admin.failedDelete'))
    }
  }

  const handleToggleFeatured = async (
    id: string,
    type: 'motorbike' | 'spare-part',
    current: boolean
  ) => {
    try {
      const url = type === 'motorbike' ? `/api/motorbikes/${id}` : `/api/spare-parts/${id}`
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ featured: !current }),
      })
      if (!res.ok) {
        toast.error(t('admin.failedUpdate'))
        return
      }
      if (type === 'motorbike') fetchMotorbikes()
      else fetchSpareParts()
      toast.success(t('admin.statusUpdated'))
    } catch {
      toast.error(t('admin.failedUpdate'))
    }
  }

  const handleToggleNewStock = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/motorbikes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isNewStock: !current }),
      })
      if (!res.ok) {
        toast.error(t('admin.failedUpdate'))
        return
      }
      fetchMotorbikes()
      toast.success(t('admin.statusUpdated'))
    } catch {
      toast.error(t('admin.failedUpdate'))
    }
  }

  const handleToggleInStock = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/spare-parts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ inStock: !current }),
      })
      if (!res.ok) {
        toast.error(t('admin.failedUpdate'))
        return
      }
      fetchSpareParts()
      toast.success(t('admin.stockStatusUpdated'))
    } catch {
      toast.error(t('admin.failedUpdate'))
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate size
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('admin.imageTooLarge'))
      return
    }

    // Upload to server
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setImageList((prev) => [...prev, data.url])
        toast.success(t('admin.imageUploaded'))
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error(t('admin.uploadFailed'))
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) {
      toast.error(t('admin.enterImageUrl'))
      return
    }
    setImageList((prev) => [...prev, url])
    setImageUrlInput('')
    toast.success(t('admin.imageUrlAdded'))
  }

  const handleRemoveImage = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index))
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
          className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">{t('admin.backToWebsite')}</span>
        </button>

        {/* Logo */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <img
            src="/images/logo.jpg"
            alt="Moka Motors Logo"
            className="h-8 md:h-10 w-auto object-contain rounded-sm"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md px-6"
        >
          <div className="bg-[#1A1A1A] rounded-sm border border-gray-800 p-6 sm:p-8 md:p-10 shadow-2xl">
            {/* Login Header */}
            <div className="text-center mb-8">
              <div className="bg-[#DC2626]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="h-8 w-8 text-[#DC2626]" />
              </div>
              <h1 className="text-2xl font-black text-white">{t('admin.dashboardTitle')}</h1>
              <p className="text-gray-500 text-sm mt-2">
                {t('admin.signInSubtitle')}
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
                  {t('admin.usernameLabel')}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                  placeholder={t('admin.enterUsername')}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  {t('admin.passwordLabel')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                  placeholder={t('admin.enterPassword')}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-3.5 rounded-sm transition-all duration-300 shadow-lg shadow-[#DC2626]/20 hover:shadow-[#DC2626]/30"
              >
                {t('admin.signIn')}
              </button>
            </form>

            <p className="text-gray-600 text-xs text-center mt-6">
              {t('admin.authorizedOnly')}
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // ============ ADMIN DASHBOARD (FULL PAGE) ============
  const sidebarItems = [
    { id: 'dashboard' as Tab, label: t('admin.dashboard'), icon: LayoutDashboard },
    { id: 'motorbikes' as Tab, label: t('admin.motorbikes'), icon: Bike },
    { id: 'spare-parts' as Tab, label: t('admin.spareParts'), icon: Wrench },
    { id: 'settings' as Tab, label: t('admin.settings'), icon: Settings },
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
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-gray-800 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen ? (
            <img
              src="/images/logo.jpg"
              alt="Moka Motors Logo"
              className="h-10 w-auto object-contain rounded-sm"
            />
          ) : (
            <img
              src="/images/logo.jpg"
              alt="Moka Motors Logo"
              className="h-8 w-8 object-contain rounded-sm hidden lg:block"
            />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-white p-1.5 rounded hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5 lg:hidden" />
            <ChevronRight className={`h-4 w-4 hidden lg:block transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id)
                resetForm()
                // Only close sidebar on mobile (overlay mode)
                if (window.innerWidth < 1024) setSidebarOpen(false)
              }}
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
            {sidebarOpen && <span>{t('admin.backToWebsite')}</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-400 hover:text-[#DC2626] hover:bg-[#DC2626]/5 transition-all"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>{t('admin.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 md:h-16 bg-[#111111] border-b border-gray-800 flex items-center justify-between px-3 md:px-6 shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-white/5 transition-colors shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-white font-bold text-sm md:text-lg truncate">
              {tab === 'dashboard' && t('admin.dashboard')}
              {tab === 'motorbikes' && t('admin.motorbikesMgmt')}
              {tab === 'spare-parts' && t('admin.sparePartsMgmt')}
              {tab === 'settings' && t('admin.settings')}
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {(tab === 'motorbikes' || tab === 'spare-parts') && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder={t('admin.search') || 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1A1A1A] border border-gray-700 rounded-md pl-10 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#DC2626] transition-colors w-28 sm:w-48 md:w-64"
                />
              </div>
            )}
            <button className="relative text-gray-400 hover:text-white p-2 rounded-md hover:bg-white/5 transition-colors hidden sm:block">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{currentAdmin?.username?.charAt(0).toUpperCase() || 'A'}</span>
              </div>
              <span className="text-gray-300 text-sm font-medium hidden md:block">{currentAdmin?.username || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 pb-20 md:pb-6">
          {/* ===== DASHBOARD TAB ===== */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {[
                  { label: t('admin.totalProducts'), value: totalProducts, icon: Package, color: 'bg-blue-500/10 text-blue-400' },
                  { label: t('admin.featuredItems'), value: featuredCount, icon: Star, color: 'bg-yellow-500/10 text-yellow-400' },
                  { label: t('admin.newStock'), value: newStockCount, icon: TrendingUp, color: 'bg-green-500/10 text-green-400' },
                  { label: t('admin.outOfStock'), value: outOfStockCount, icon: Package, color: 'bg-red-500/10 text-red-400' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#1A1A1A] rounded-md border border-gray-800 p-3 md:p-5">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <p className="text-gray-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                      <div className={`p-1.5 md:p-2 rounded-md ${stat.color}`}>
                        <stat.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </div>
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-4 md:p-6">
                  <h3 className="text-white font-bold text-lg mb-4">{t('admin.quickActions')}</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => { setTab('motorbikes'); setIsAdding(true); setShowForm(true); setImageList([]); setImageUrlInput('') }}
                      className="w-full flex items-center gap-3 bg-[#111111] hover:bg-[#DC2626]/10 border border-gray-700 hover:border-[#DC2626]/30 rounded-md p-3 transition-all text-left group"
                    >
                      <div className="bg-[#DC2626]/10 group-hover:bg-[#DC2626]/20 p-2 rounded-md transition-colors shrink-0">
                        <Bike className="h-5 w-5 text-[#DC2626]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold">{t('admin.addNewMotorbike')}</p>
                        <p className="text-gray-500 text-xs truncate">{t('admin.addNewMotorbikeDesc')}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-600 ml-auto shrink-0" />
                    </button>
                    <button
                      onClick={() => { setTab('spare-parts'); setIsAdding(true); setShowForm(true); setImageList([]); setImageUrlInput('') }}
                      className="w-full flex items-center gap-3 bg-[#111111] hover:bg-[#DC2626]/10 border border-gray-700 hover:border-[#DC2626]/30 rounded-md p-3 transition-all text-left group"
                    >
                      <div className="bg-[#DC2626]/10 group-hover:bg-[#DC2626]/20 p-2 rounded-md transition-colors shrink-0">
                        <Wrench className="h-5 w-5 text-[#DC2626]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold">{t('admin.addNewSparePart')}</p>
                        <p className="text-gray-500 text-xs truncate">{t('admin.addNewSparePartDesc')}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-600 ml-auto shrink-0" />
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-4 md:p-6">
                  <h3 className="text-white font-bold text-lg mb-4">{t('admin.inventoryOverview')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Motorbikes</span>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-16 sm:w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#DC2626] rounded-full"
                            style={{ width: `${motorbikes.length > 0 ? (motorbikes.length / totalProducts) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-bold w-6 sm:w-8 text-right">{motorbikes.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Spare Parts</span>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-16 sm:w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${spareParts.length > 0 ? (spareParts.length / totalProducts) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-bold w-6 sm:w-8 text-right">{spareParts.length}</span>
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
              <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-4 md:p-6">
                <h3 className="text-white font-bold text-lg mb-4">{t('admin.brandDistribution')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {['Honda', 'Kawasaki', 'KTM', 'Yamaha'].map((brand) => {
                    const bikeCount = motorbikes.filter(b => b.brand === brand).length
                    const partCount = spareParts.filter(p => p.brand === brand).length
                    return (
                      <div key={brand} className="bg-[#111111] rounded-md p-3 md:p-4 border border-gray-800">
                        <p className="text-white font-bold text-sm">{brand}</p>
                        <p className="text-gray-500 text-xs mt-1">{bikeCount} {t('admin.bikes')}, {partCount} {t('admin.partsLabel')}</p>
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
              <div className="flex items-center justify-between gap-3">
                <p className="text-gray-400 text-sm">
                  {filteredMotorbikes.length} motorbike{filteredMotorbikes.length !== 1 ? 's' : ''} found
                </p>
                <button
                  onClick={() => {
                    resetForm()
                    setIsAdding(true)
                    setShowForm(true)
                  }}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold px-3 md:px-5 py-2.5 rounded-md flex items-center gap-2 transition-colors shadow-lg shadow-[#DC2626]/20 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('admin.addMotorbike')}</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-3">
                {filteredMotorbikes.map((bike) => {
                  const bikeImages = parseImages(bike.images)
                  const firstImage = bikeImages.length > 0 ? bikeImages[0] : ''
                  return (
                    <div key={bike.id} className="bg-[#1A1A1A] rounded-md border border-gray-800 p-3">
                      <div className="flex gap-3">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={bike.name}
                            className="w-16 h-16 object-cover rounded-md shrink-0 bg-[#111111]"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#111111] rounded-md shrink-0 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{bike.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{bike.brand} • {bike.category}</p>
                          <p className="text-gray-500 text-xs">{bike.year} • {bike.engineSize}</p>
                          <p className="text-[#DC2626] font-bold text-sm mt-1">TZS {bike.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/50">
                        <div className="flex gap-1.5">
                          {bike.featured && (
                            <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded font-semibold">Featured</span>
                          )}
                          {bike.isNewStock && (
                            <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-semibold">New</span>
                          )}
                          {!bike.featured && !bike.isNewStock && (
                            <span className="text-[10px] text-gray-600">—</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleFeatured(bike.id, 'motorbike', bike.featured)}
                            className={`p-2 rounded transition-colors ${
                              bike.featured ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-gray-600 hover:bg-white/5'
                            }`}
                            title="Toggle Featured"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleNewStock(bike.id, bike.isNewStock)}
                            className={`p-2 rounded transition-colors text-xs font-bold ${
                              bike.isNewStock ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-600 hover:bg-white/5'
                            }`}
                            title="Toggle New Stock"
                          >
                            NEW
                          </button>
                          <button
                            onClick={() => handleEditMotorbike(bike)}
                            className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMotorbike(bike.id)}
                            className="p-2 text-gray-600 hover:text-[#DC2626] hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {filteredMotorbikes.length === 0 && (
                  <div className="text-center py-12">
                    <Bike className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500">{t('admin.noMotorbikes')}</p>
                  </div>
                )}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block bg-[#1A1A1A] rounded-md border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.product')}</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.brand')}</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.category')}</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.price')}</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.status')}</th>
                        <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMotorbikes.map((bike) => {
                        const bikeImages = parseImages(bike.images)
                        const firstImage = bikeImages.length > 0 ? bikeImages[0] : ''
                        return (
                          <tr key={bike.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {firstImage ? (
                                  <img
                                    src={firstImage}
                                    alt={bike.name}
                                    className="w-12 h-12 object-cover rounded-md shrink-0 bg-[#111111]"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-[#111111] rounded-md shrink-0 flex items-center justify-center">
                                    <ImageIcon className="h-5 w-5 text-gray-600" />
                                  </div>
                                )}
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
                        )
                      })}
                      {filteredMotorbikes.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-16 text-center">
                            <Bike className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500">{t('admin.noMotorbikes')}</p>
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
              <div className="flex items-center justify-between gap-3">
                <p className="text-gray-400 text-sm">
                  {filteredSpareParts.length} spare part{filteredSpareParts.length !== 1 ? 's' : ''} found
                </p>
                <button
                  onClick={() => {
                    resetForm()
                    setIsAdding(true)
                    setShowForm(true)
                  }}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold px-3 md:px-5 py-2.5 rounded-md flex items-center gap-2 transition-colors shadow-lg shadow-[#DC2626]/20 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('admin.addSparePart')}</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-3">
                {filteredSpareParts.map((part) => {
                  const partImages = parseImages(part.images)
                  const firstImage = partImages.length > 0 ? partImages[0] : ''
                  return (
                    <div key={part.id} className="bg-[#1A1A1A] rounded-md border border-gray-800 p-3">
                      <div className="flex gap-3">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={part.name}
                            className="w-16 h-16 object-cover rounded-md shrink-0 bg-[#111111]"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#111111] rounded-md shrink-0 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{part.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{part.brand} • {part.type}</p>
                          <p className="text-gray-500 text-xs truncate">{part.compatibility}</p>
                          <p className="text-[#DC2626] font-bold text-sm mt-1">TZS {part.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/50">
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
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleFeatured(part.id, 'spare-part', part.featured)}
                            className={`p-2 rounded transition-colors ${
                              part.featured ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-gray-600 hover:bg-white/5'
                            }`}
                            title="Toggle Featured"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleInStock(part.id, part.inStock)}
                            className={`p-2 rounded transition-colors text-xs font-bold ${
                              part.inStock ? 'text-green-400 hover:bg-green-500/10' : 'text-red-400 hover:bg-red-500/10'
                            }`}
                            title="Toggle Stock"
                          >
                            {part.inStock ? '✓' : '✗'}
                          </button>
                          <button
                            onClick={() => handleEditSparePart(part)}
                            className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSparePart(part.id)}
                            className="p-2 text-gray-600 hover:text-[#DC2626] hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {filteredSpareParts.length === 0 && (
                  <div className="text-center py-12">
                    <Wrench className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500">{t('admin.noSpareParts')}</p>
                  </div>
                )}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block bg-[#1A1A1A] rounded-md border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.product')}</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.brand')}</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.type')}</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.price')}</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.status')}</th>
                        <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSpareParts.map((part) => {
                        const partImages = parseImages(part.images)
                        const firstImage = partImages.length > 0 ? partImages[0] : ''
                        return (
                          <tr key={part.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {firstImage ? (
                                  <img
                                    src={firstImage}
                                    alt={part.name}
                                    className="w-12 h-12 object-cover rounded-md shrink-0 bg-[#111111]"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-[#111111] rounded-md shrink-0 flex items-center justify-center">
                                    <ImageIcon className="h-5 w-5 text-gray-600" />
                                  </div>
                                )}
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
                        )
                      })}
                      {filteredSpareParts.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-16 text-center">
                            <Wrench className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500">{t('admin.noSpareParts')}</p>
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
            <div className="w-full max-w-2xl">
              <div className="mb-4 md:mb-6">
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to list
                </button>
              </div>
              <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-4 md:p-6 lg:p-8">
                <h3 className="text-white font-bold text-xl mb-6">
                  {isAdding
                    ? tab === 'motorbikes'
                      ? t('admin.addNewMotorbike')
                      : t('admin.addNewSparePart')
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  {/* ===== MULTI-IMAGE SECTION ===== */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Product Images</label>

                    {/* Image Gallery */}
                    {imageList.length > 0 && (
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                        {imageList.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Product image ${index + 1}`}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border border-gray-700 bg-[#111111]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white p-0.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white text-center py-0.5 rounded-b-md">
                              {index === 0 ? 'Main' : `#${index + 1}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {imageList.length === 0 && (
                      <div className="mb-4 bg-[#111111] border border-dashed border-gray-700 rounded-md p-6 text-center">
                        <ImageIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No images added yet</p>
                        <p className="text-gray-600 text-xs mt-1">Upload files or add URLs below</p>
                      </div>
                    )}

                    {/* Add Image Methods */}
                    <div className="space-y-3">
                      {/* File Upload */}
                      <div>
                        <input
                          ref={fileInputRef}
                          id="image-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-semibold transition-all border ${
                            isUploading
                              ? 'border-[#DC2626]/50 bg-[#DC2626]/5 text-[#DC2626] cursor-wait'
                              : 'border-gray-700 bg-[#111111] hover:border-[#DC2626]/50 hover:bg-[#DC2626]/5 text-gray-300 hover:text-white'
                          }`}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Upload Image File
                            </>
                          )}
                        </button>
                      </div>

                      {/* URL Input */}
                      <div className="flex gap-2">
                        <div className="relative flex-1 min-w-0">
                          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <input
                            type="text"
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddImageUrl()
                              }
                            }}
                            className="w-full pl-10 pr-3 py-3 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all text-sm"
                            placeholder="Image URL..."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="bg-[#111111] hover:bg-[#DC2626]/10 border border-gray-700 hover:border-[#DC2626]/30 text-gray-300 hover:text-white px-3 sm:px-4 rounded-md transition-all flex items-center gap-1.5 text-sm font-semibold shrink-0"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span className="hidden xs:inline">Add</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs mt-2">
                      {imageList.length} image{imageList.length !== 1 ? 's' : ''} added. First image will be the main product photo.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
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
                      {t('admin.cancel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== SETTINGS TAB ===== */}
          {tab === 'settings' && (
            <div className="max-w-2xl space-y-4 md:space-y-6">
              {/* Account Information */}
              <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-4 md:p-6 lg:p-8">
                <h3 className="text-white font-bold text-lg mb-4 md:mb-6 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#DC2626]" />
                  {t('admin.accountInfo')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t('admin.usernameLabel')}</label>
                    <input
                      type="text"
                      value={currentAdmin?.username || 'admin'}
                      readOnly
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t('admin.role')}</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <input
                        type="text"
                        value={currentAdmin?.role === 'super_admin' ? t('admin.superAdmin') : t('admin.adminRole')}
                        readOnly
                        className="flex-1 px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-gray-500 cursor-not-allowed"
                      />
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full text-center whitespace-nowrap self-start ${
                        currentAdmin?.role === 'super_admin'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {currentAdmin?.role === 'super_admin' ? t('admin.fullAccess') : t('admin.standard')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-4 md:p-6 lg:p-8">
                <h3 className="text-white font-bold text-lg mb-4 md:mb-6 flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-[#DC2626]" />
                  {t('admin.changePassword')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t('admin.currentPassword')}</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                        placeholder={t('admin.enterCurrentPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t('admin.newPassword')}</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                        placeholder={t('admin.enterNewPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t('admin.confirmNewPassword')}</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                      placeholder={t('admin.confirmPasswordPlaceholder')}
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="w-full sm:w-auto bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-md transition-all flex items-center justify-center gap-2"
                  >
                    {isChangingPassword ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {isChangingPassword ? t('admin.changing') : t('admin.changePasswordBtn')}
                  </button>
                </div>
              </div>

              {/* Manage Admins - Only visible to super_admin */}
              {currentAdmin?.role === 'super_admin' && (
                <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#DC2626]" />
                      {t('admin.manageAdmins')}
                    </h3>
                    <button
                      onClick={() => setShowNewAdminForm(!showNewAdminForm)}
                      className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold px-4 py-2 rounded-md flex items-center gap-2 transition-colors whitespace-nowrap self-start"
                    >
                      <UserPlus className="h-4 w-4" />
                      {t('admin.addAdmin')}
                    </button>
                  </div>

                  {/* New Admin Form */}
                  {showNewAdminForm && (
                    <div className="bg-[#111111] rounded-md border border-gray-700 p-5 mb-6 space-y-4">
                      <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                        <PlusCircle className="h-4 w-4 text-[#DC2626]" />
                        {t('admin.createNewAdmin')}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">{t('admin.usernameLabel')}</label>
                          <input
                            type="text"
                            value={newAdminUsername}
                            onChange={(e) => setNewAdminUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                            placeholder={t('admin.usernameMin')}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">{t('admin.passwordLabel')}</label>
                          <input
                            type="password"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                            placeholder={t('admin.passwordMin')}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">{t('admin.role')}</label>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="newAdminRole"
                              value="admin"
                              checked={newAdminRole === 'admin'}
                              onChange={(e) => setNewAdminRole(e.target.value)}
                              className="accent-[#DC2626]"
                            />
                            <span className="text-gray-300 text-sm">{t('admin.adminRoleLabel')}</span>
                            <span className="text-gray-600 text-xs">{t('admin.adminRoleDesc')}</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="newAdminRole"
                              value="super_admin"
                              checked={newAdminRole === 'super_admin'}
                              onChange={(e) => setNewAdminRole(e.target.value)}
                              className="accent-[#DC2626]"
                            />
                            <span className="text-gray-300 text-sm">{t('admin.superAdminRoleLabel')}</span>
                            <span className="text-gray-600 text-xs">{t('admin.superAdminRoleDesc')}</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleCreateAdmin}
                          disabled={isCreatingAdmin}
                          className="bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-md transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          {isCreatingAdmin ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          {isCreatingAdmin ? t('admin.creating') : t('admin.createAdmin')}
                        </button>
                        <button
                          onClick={() => {
                            setShowNewAdminForm(false)
                            setNewAdminUsername('')
                            setNewAdminPassword('')
                            setNewAdminRole('admin')
                          }}
                          className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-5 py-2.5 rounded-md transition-colors text-sm text-center"
                        >
                          {t('admin.cancel')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Admin List */}
                  <div className="space-y-2">
                    {admins.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center justify-between bg-[#111111] rounded-md border border-gray-800 p-3 md:p-4 hover:border-gray-700 transition-colors gap-2"
                      >
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
                            admin.role === 'super_admin'
                              ? 'bg-yellow-500/10'
                              : 'bg-blue-500/10'
                          }`}>
                            <span className={`text-xs md:text-sm font-bold ${
                              admin.role === 'super_admin' ? 'text-yellow-400' : 'text-blue-400'
                            }`}>
                              {admin.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-white font-semibold text-sm truncate">{admin.username}</p>
                              {admin.username === currentAdmin?.username && (
                                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-semibold">{t('admin.you')}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className={`text-[10px] md:text-xs font-medium px-2 py-0.5 rounded ${
                                admin.role === 'super_admin'
                                  ? 'bg-yellow-500/10 text-yellow-400'
                                  : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                {admin.role === 'super_admin' ? t('admin.superAdmin') : t('admin.adminRole')}
                              </span>
                              <span className="text-gray-600 text-[10px] md:text-xs">
                                {t('admin.created')} {new Date(admin.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {admin.username !== currentAdmin?.username && (
                          <button
                            onClick={() => handleDeleteAdmin(admin.id, admin.username)}
                            className="p-2 text-gray-600 hover:text-[#DC2626] hover:bg-red-500/10 rounded transition-colors shrink-0"
                            title={t('admin.deleteAdmin')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {admins.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="h-10 w-10 text-gray-700 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">{t('admin.noAdmins')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Store Information */}
              <div className="bg-[#1A1A1A] rounded-md border border-gray-800 p-4 md:p-6 lg:p-8">
                <h3 className="text-white font-bold text-lg mb-4 md:mb-6">{t('admin.storeInfo')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t('admin.storeName')}</label>
                    <input
                      type="text"
                      value="Moka Motors"
                      readOnly
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t('admin.whatsappNumber')}</label>
                    <input
                      type="text"
                      value="+255 625 260000"
                      readOnly
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t('admin.locationLabel')}</label>
                    <input
                      type="text"
                      value="Kariakoo, Dar es Salaam, Tanzania"
                      readOnly
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/5 rounded-md border border-red-500/20 p-4 md:p-6">
                <h3 className="text-red-400 font-bold text-lg mb-2">{t('admin.dangerZone')}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {t('admin.dangerDesc')}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-6 py-2.5 rounded-md transition-colors border border-red-500/20 flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t('admin.logout')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden bg-[#111111] border-t border-gray-800 flex items-center justify-around px-2 py-1 shrink-0 safe-area-bottom">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id)
                resetForm()
              }}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-md transition-all ${
                tab === item.id
                  ? 'text-[#DC2626]'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  )
}
