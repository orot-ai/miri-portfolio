import { useState, useEffect, useCallback } from 'react'
import { Project } from '@/types'
import { arrayMove } from '@dnd-kit/sortable'
import { DragEndEvent } from '@dnd-kit/core'

interface UseProjectOrderProps {
  projects: Project[]
  updateProjectsOrder: (projects: Project[]) => Promise<boolean>
}

interface UseProjectOrderReturn {
  orderedProjects: Project[]
  handleDragEnd: (event: DragEndEvent) => Promise<void>
  isReordering: boolean
}

export const useProjectOrder = ({ 
  projects, 
  updateProjectsOrder 
}: UseProjectOrderProps): UseProjectOrderReturn => {
  const [orderedProjects, setOrderedProjects] = useState<Project[]>([])
  const [isReordering, setIsReordering] = useState(false)

  // 프로젝트 데이터가 변경되면 로컬 순서 상태 동기화
  useEffect(() => {
    if (projects.length > 0) {
      setOrderedProjects(projects)
    }
  }, [projects])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = orderedProjects.findIndex(project => project.id === active.id)
    const newIndex = orderedProjects.findIndex(project => project.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newOrder = arrayMove(orderedProjects, oldIndex, newIndex)
    
    // 즉시 UI 업데이트
    setOrderedProjects(newOrder)
    setIsReordering(true)

    try {
      const success = await updateProjectsOrder(newOrder)
      if (!success) {
        // 실패 시 원래 순서로 복원
        setOrderedProjects(orderedProjects)
        console.error('프로젝트 순서 업데이트에 실패했습니다')
      }
    } catch (error) {
      // 에러 시 원래 순서로 복원
      setOrderedProjects(orderedProjects)
      console.error('프로젝트 순서 업데이트 중 에러:', error)
    } finally {
      setIsReordering(false)
    }
  }, [orderedProjects, updateProjectsOrder])

  return {
    orderedProjects,
    handleDragEnd,
    isReordering
  }
}