import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createAuthSlice } from './slices/createAuthSlice'
import { createChatSlice } from './slices/createChatSlice'
import { createGroupSlice } from './slices/createGroupSlice'


const createResettableStore = (createState) => {
  const store = create(createState);
  const initialState = store.getState();

  store.reset = () => {
    store.setState(initialState, true); // Reset to initial state
  };

  return store;
};

export const useAppStore = create(devtools((set, get) => ({
  ...createAuthSlice(set, get),
  ...createChatSlice(set, get),
  ...createGroupSlice(set, get),
  theme: 'light',
  setTheme: (theme) => set({ theme })
})))
