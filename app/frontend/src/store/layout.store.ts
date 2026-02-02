import { create } from 'zustand'

type LayoutStore = {
  pageTitle: string | null
  setPageTitle: (title: string | null) => void
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  pageTitle: null,
  setPageTitle: (title) => set({ pageTitle: title }),
}))
