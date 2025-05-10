import { create } from 'zustand'

export const useProjectStore = create((set) => ({
    project: null,
    setProject: (project) => set({ project }),
  clearProject: () => set({ project: null }),
}))