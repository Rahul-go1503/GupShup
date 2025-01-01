import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createAuthSlice } from './slices/createAuthSlice'
import { createChatSlice } from './slices/createChatSlice'

export const useAppStore = create(devtools((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a)
})))
