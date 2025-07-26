import { useState, useEffect, useCallback } from 'react'
import { AdminAPI } from '@/lib/adminAPI'
import { Project } from '@/types'
import { logger } from '@/utils/logger'
import { handleError } from '@/utils/errorHandler'

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
      
      // 로컬 상태 업데이트 (순서 유지)
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? { 
            ...project, 
            ...updates,
            updated_at: new Date().toISOString()
          } : project
        )
      )
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 업데이트에 실패했습니다'
      logger.error('프로젝트 업데이트 실패:', errorMessage)
      setError(errorMessage)
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
      const errorMessage = err instanceof Error ? err.message : '프로젝트 삭제에 실패했습니다'
      setError(errorMessage)
      logger.error('프로젝트 삭제 실패:', err)
      throw new Error(errorMessage)
    }
  }

  const updateProjectsOrder = async (newOrder: Project[]) => {
    const previousOrder = [...projects]
    
    try {
      // 로컬 상태 즉시 업데이트 (낙관적 업데이트)
      setProjects(newOrder)
      
      // 서버에 순서 저장 (각 프로젝트에 order_index 부여)
      const orderUpdates = newOrder.map((project, index) => ({
        id: project.id,
        order_index: index
      }))
      
      await AdminAPI.updateProjectsOrder(orderUpdates)
      return true
    } catch (err) {
      // 에러 시 이전 순서로 되돌리기
      setProjects(previousOrder)
      
      const errorMessage = err instanceof Error ? err.message : '프로젝트 순서 업데이트에 실패했습니다'
      logger.error('프로젝트 순서 업데이트 실패:', errorMessage)
      setError(errorMessage)
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