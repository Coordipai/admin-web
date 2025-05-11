import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: {
     "id": 0,
        "name": "UserName",
        "discord_id": 0,
        "github_id": 0,
        "github_name": "GithubName",
        "category": "Category",
        "career": "Career",
        "created_at": "2025-05-10T15:16:29.882Z",
        "profile_img": "string"
      },
  setUser: (rawResponse) => {
    const user = rawResponse?.content?.data ?? null
    set({ user })
  },
  clearUser: () => set({ user: null }),
}))
