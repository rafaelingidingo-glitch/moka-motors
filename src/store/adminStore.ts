import { create } from 'zustand'

interface AdminState {
  isLoggedIn: boolean
  isPanelOpen: boolean
  showAdminPage: boolean
  login: () => void
  logout: () => void
  setPanelOpen: (open: boolean) => void
  openAdminPage: () => void
  closeAdminPage: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
  isLoggedIn: false,
  isPanelOpen: false,
  showAdminPage: false,

  login: () => set({ isLoggedIn: true }),

  logout: () => set({ isLoggedIn: false, isPanelOpen: false, showAdminPage: false }),

  setPanelOpen: (open) => set({ isPanelOpen: open }),

  openAdminPage: () => set({ showAdminPage: true }),

  closeAdminPage: () => set({ showAdminPage: false }),
}))
