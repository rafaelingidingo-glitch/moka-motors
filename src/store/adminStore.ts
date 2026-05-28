import { create } from 'zustand'

interface AdminState {
  isLoggedIn: boolean
  isAdminPanelOpen: boolean
  login: () => void
  logout: () => void
  setAdminPanelOpen: (open: boolean) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  isLoggedIn: false,
  isAdminPanelOpen: false,

  login: () => set({ isLoggedIn: true }),

  logout: () => set({ isLoggedIn: false, isAdminPanelOpen: false }),

  setAdminPanelOpen: (open) => set({ isAdminPanelOpen: open }),
}))
