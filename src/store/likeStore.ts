import { create } from 'zustand'

interface LikeState {
  likedIds: string[]
  toggleLike: (id: string) => void
  isLiked: (id: string) => boolean
  getLikedCount: () => number
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likedIds: [],

  toggleLike: (id) => {
    set((state) => {
      if (state.likedIds.includes(id)) {
        return { likedIds: state.likedIds.filter((i) => i !== id) }
      }
      return { likedIds: [...state.likedIds, id] }
    })
  },

  isLiked: (id) => {
    return get().likedIds.includes(id)
  },

  getLikedCount: () => {
    return get().likedIds.length
  },
}))
