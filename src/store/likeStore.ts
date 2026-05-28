import { create } from 'zustand'

interface LikeState {
  likedItems: Set<string>
  toggleLike: (id: string) => void
  isLiked: (id: string) => boolean
  getLikedCount: () => number
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likedItems: new Set<string>(),

  toggleLike: (id) => {
    set((state) => {
      const newSet = new Set(state.likedItems)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return { likedItems: newSet }
    })
  },

  isLiked: (id) => {
    return get().likedItems.has(id)
  },

  getLikedCount: () => {
    return get().likedItems.size
  },
}))
