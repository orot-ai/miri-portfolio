import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Project } from '@/types'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { EditableProjectCard } from '@/components/admin/EditableProjectCard'
import { StaggeredContainer, StaggeredItem } from '@/components/animations/StaggeredContainer'
import { useAdminStore } from '@/stores/adminStore'

interface SortableProjectCardProps {
  project: Project
  onDelete: () => void
  onUpdate: (id: string, updates: Partial<Project>) => Promise<boolean>
}

const SortableProjectCard: React.FC<SortableProjectCardProps> = ({ 
  project, 
  onDelete, 
  onUpdate 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <EditableProjectCard 
        project={project} 
        featured={project.featured}
        className="h-full"
        onDelete={onDelete}
        onUpdate={onUpdate}
        dragHandleProps={listeners}
      />
    </div>
  )
}

interface ProjectsGridProps {
  projects: Project[]
  loading: boolean
  error: string | null
  onProjectClick: (project: Project) => void
  onAddProject: () => void
  onDeleteProject: (id: string) => void
  onUpdateProject: (id: string, updates: Partial<Project>) => Promise<boolean>
  onDragEnd: (event: DragEndEvent) => void
  isReordering?: boolean
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  loading,
  error,
  onProjectClick,
  onAddProject,
  onDeleteProject,
  onUpdateProject,
  onDragEnd,
  isReordering = false
}) => {
  const { isAdminMode } = useAdminStore()
  

  // dnd-kit 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (loading) {
    return (
      <div className="min-h-[400px] sm:min-h-[500px]">
        {/* 스켈레톤 로딩 UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              {/* 이미지 스켈레톤 */}
              <div className="aspect-[16/9] bg-gray-200"></div>
              
              {/* 콘텐츠 스켈레톤 */}
              <div className="p-4 sm:p-5 md:p-6 space-y-3">
                {/* 제목 */}
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                
                {/* 설명 */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                
                {/* 태그 */}
                <div className="flex gap-2 pt-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 로딩 인디케이터 */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
            <span className="text-sm">프로젝트를 불러오는 중...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] sm:min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-[400px] sm:min-h-[500px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">
              {isAdminMode 
                ? "등록된 프로젝트가 없습니다" 
                : "준비 중입니다"}
            </p>
          </div>
          {isAdminMode && (
            <motion.button
              onClick={onAddProject}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} />
              프로젝트 추가
            </motion.button>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        key={`${projects.length}-${isReordering}`}
        initial={!isAdminMode ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={!isAdminMode ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        exit={!isAdminMode ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
        transition={!isAdminMode ? { duration: 0.4 } : {}}
      >
        {isAdminMode ? (
          // 관리자 모드: 드래그 앤 드롭 가능한 DND Kit
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext 
              items={projects.map(p => p.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                {projects.map((project) => (
                  <SortableProjectCard
                    key={project.id}
                    project={project}
                    onDelete={() => onDeleteProject(project.id)}
                    onUpdate={onUpdateProject}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          // 일반 모드: 즉시 로드되는 그리드
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className={project.featured ? 'md:col-span-2 lg:col-span-1' : ''}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: 'easeOut' 
                }}
              >
                <ProjectCard 
                  project={project} 
                  featured={project.featured}
                  className="h-full"
                  onClick={() => onProjectClick(project)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
      
      {/* 관리자 모드에서 프로젝트 추가 버튼 */}
      {isAdminMode && (
        <motion.div
          initial={!isAdminMode ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={!isAdminMode ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <button
            onClick={onAddProject}
            disabled={isReordering}
            className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            새 프로젝트 추가
          </button>
        </motion.div>
      )}
    </>
  )
}