import { create } from 'zustand'
import { Project } from '@/types'

interface ProjectsCacheStore {
  vibeProjects: Project[] | null
  automationProjects: Project[] | null
  lastFetchTime: number | null
  setVibeProjects: (projects: Project[]) => void
  setAutomationProjects: (projects: Project[]) => void
  clearCache: () => void
  isStale: () => boolean
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const useProjectsCache = create<ProjectsCacheStore>((set, get) => ({
  vibeProjects: null,
  automationProjects: null,
  lastFetchTime: null,
  
  setVibeProjects: (projects) => set({ 
    vibeProjects: projects, 
    lastFetchTime: Date.now() 
  }),
  
  setAutomationProjects: (projects) => set({ 
    automationProjects: projects, 
    lastFetchTime: Date.now() 
  }),
  
  clearCache: () => set({ 
    vibeProjects: null, 
    automationProjects: null, 
    lastFetchTime: null 
  }),
  
  isStale: () => {
    const { lastFetchTime } = get()
    if (!lastFetchTime) return true
    return Date.now() - lastFetchTime > CACHE_DURATION
  }
}))