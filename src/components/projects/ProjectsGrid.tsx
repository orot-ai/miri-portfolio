import React from 'react'
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <EditableProjectCard 
        project={project} 
        featured={project.featured}
        className="h-full"
        onDelete={onDelete}
        onUpdate={onUpdate}
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
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          다시 시도
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">아직 프로젝트가 없습니다.</p>
        {isAdminMode && (
          <button
            onClick={onAddProject}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus size={20} />
            첫 프로젝트 추가하기
          </button>
        )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
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
          // 일반 모드: 기존 StaggeredContainer
          <StaggeredContainer
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
            staggerDelay={0.2}
            threshold={0.2}
          >
            {projects.map((project) => (
              <StaggeredItem 
                key={project.id}
                className={project.featured ? 'md:col-span-2 lg:col-span-1' : ''}
              >
                <ProjectCard 
                  project={project} 
                  featured={project.featured}
                  className="h-full"
                  onClick={() => onProjectClick(project)}
                />
              </StaggeredItem>
            ))}
          </StaggeredContainer>
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