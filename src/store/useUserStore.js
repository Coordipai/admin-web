import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null })
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage
    }
  )
)

export const useAccessTokenStore = create(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      clearAccessToken: () => set({ accessToken: null })
    }),
    {
      name: 'access-token-storage',
      getStorage: () => localStorage
    }
  )
)

export const useRefreshTokenStore = create(
  persist(
    (set) => ({
      refreshToken: null,
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearRefreshToken: () => set({ refreshToken: null })
    }),
    {
      name: 'refresh-token-storage',
      getStorage: () => localStorage
    }
  )
)
