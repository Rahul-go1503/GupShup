import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createAuthSlice } from './slices/createAuthSlice'
import { createChatSlice } from './slices/createChatSlice'
import { createGroupSlice } from './slices/createGroupSlice'
import { createUserSlice } from './slices/createUserSlice'


export const useAppStore = create(devtools((set, get) => ({
  ...createAuthSlice(set, get),
  ...createChatSlice(set, get),
  ...createGroupSlice(set, get),
  ...createUserSlice(set, get),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  resetStore: () => {
    createAuthSlice(set, get).reset()
    createChatSlice(set, get).reset()
    createGroupSlice(set, get).reset()
    createUserSlice(set, get).reset()
  }
})))
