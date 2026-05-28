import { create } from 'zustand'

interface AdminUser {
  username: string
  role: string
}

interface AdminState {
  isLoggedIn: boolean
  isPanelOpen: boolean
  showAdminPage: boolean
  currentAdmin: AdminUser | null
  login: (admin: AdminUser) => void
  logout: () => void
  setPanelOpen: (open: boolean) => void
  openAdminPage: () => void
  closeAdminPage: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
  isLoggedIn: false,
  isPanelOpen: false,
  showAdminPage: false,
  currentAdmin: null,

  login: (admin: AdminUser) => set({ isLoggedIn: true, currentAdmin: admin }),

  logout: () => set({ isLoggedIn: false, isPanelOpen: false, showAdminPage: false, currentAdmin: null }),

  setPanelOpen: (open) => set({ isPanelOpen: open }),

  openAdminPage: () => set({ showAdminPage: true }),

  closeAdminPage: () => set({ showAdminPage: false }),
}))
