import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminStore {
  isAdminMode: boolean
  toggleAdminMode: () => void
  setAdminMode: (value: boolean) => void
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAdminMode: false,
      toggleAdminMode: () => set((state) => ({ isAdminMode: !state.isAdminMode })),
      setAdminMode: (value) => set({ isAdminMode: value }),
    }),
    {
      name: 'admin-mode',
    }
  )
)