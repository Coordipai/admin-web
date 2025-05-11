import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  setUser: (rawResponse) => {
    const user = rawResponse?.content?.data?.[0] ?? null
    set({ user })
  },
  clearUser: () => set({ user: null }),
}))
