import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createAuthSlice } from './slices/createAuthSlice'
import { createChatSlice } from './slices/createChatSlice'
import { createUserSlice } from './slices/createUserSlice'

export const useAppStore = create(devtools((set, get) => ({
  ...createAuthSlice(set, get),
  ...createChatSlice(set, get),
  ...createUserSlice(set, get),
  theme: localStorage.getItem('theme') || 'cupcake',
  setTheme: (theme) => set({ theme }),
  resetStore: () => {
    createAuthSlice(set, get).reset()
    createChatSlice(set, get).reset()
    createUserSlice(set, get).reset()
  }
}), { enabled: import.meta.env.VITE_NODE_ENV === 'development' } // Disable in production
))
