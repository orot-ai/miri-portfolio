import { useState, useEffect } from 'react'
import { AdminAPI } from '@/lib/adminAPI'
import { Project } from '@/types'

interface UseAdminProjectsProps {
  category?: 'vibe' | 'automation'
}

export const useAdminProjects = (category?: 'vibe' | 'automation') => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = category 
        ? await AdminAPI.getProjectsByCategory(category)
        : await AdminAPI.getProjects()
      setProjects(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로젝트를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await AdminAPI.updateProject(id, updates)
      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...updates } : project
      ))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로젝트 업데이트에 실패했습니다')
      return false
    }
  }

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProject = await AdminAPI.createProject(projectData)
      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로젝트 생성에 실패했습니다')
      return null
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await AdminAPI.deleteProject(id)
      setProjects(prev => prev.filter(project => project.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로젝트 삭제에 실패했습니다')
      return false
    }
  }

  const updateProjectsOrder = async (orderedProjects: { id: string; order_index: number }[]) => {
    try {
      await AdminAPI.updateProjectsOrder(orderedProjects)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로젝트 순서 업데이트에 실패했습니다')
      return false
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [category])

  return {
    projects,
    loading,
    error,
    updateProject,
    createProject,
    deleteProject,
    updateProjectsOrder,
    refetch: fetchProjects
  }
}