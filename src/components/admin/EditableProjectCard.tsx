import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, Star, Edit, Trash2, Plus, GripVertical, Tag } from 'lucide-react'
import { Project } from '@/types'
import { EditableText } from './EditableText'
import { EditableImage } from './EditableImage'
import { useAdminStore } from '@/stores/adminStore'
import { useAdminProjects } from '@/hooks/useAdminProjects'
import { AdminAPI } from '@/lib/adminAPI'

interface EditableProjectCardProps {
  project: Project
  featured?: boolean
  className?: string
  onDelete?: () => void
  onUpdate?: (id: string, updates: Partial<Project>) => Promise<boolean>
  dragHandleProps?: any // 드래그 핸들 props
}

export const EditableProjectCard: React.FC<EditableProjectCardProps> = ({
  project,
  featured = false,
  className = '',
  onDelete,
  onUpdate,
  dragHandleProps
}) => {
  
  const navigate = useNavigate()
  const { isAdminMode } = useAdminStore()
  const { updateProject: defaultUpdateProject } = useAdminProjects()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  // onUpdate가 제공되면 사용하고, 아니면 기본 updateProject 사용
  const updateProject = onUpdate || defaultUpdateProject

  const handleClick = (e: React.MouseEvent) => {
    // 버튼이나 다른 인터랙티브 요소를 클릭한 경우 무시
    const target = e.target as HTMLElement
    if (target.closest('button') || 
        target.closest('[contenteditable="true"]') ||
        target.closest('input') ||
        target.closest('a')) {
      return
    }
    
    // 드래그 중이거나 편집 모드에서는 카드 클릭 비활성화
    if (isDragging || isAdminMode) {
      return
    }
    
    navigate(`/project/${project.id}`)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm(`'${project.title}' 프로젝트를 정말로 삭제하시겠습니까?`)) {
      return
    }
    
    setIsDeleting(true)
    
    try {
      if (onDelete) {
        await onDelete()
      }
    } catch (error) {
      alert('프로젝트 삭제에 실패했습니다: ' + (error as Error).message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTitleUpdate = async (newTitle: string) => {
    return await updateProject(project.id, { title: newTitle })
  }

  const handleDescriptionUpdate = async (newDescription: string) => {
    return await updateProject(project.id, { description_card: newDescription })
  }

  const handleImageUpdate = async (file: File) => {
    try {
      const imageUrl = await AdminAPI.uploadFile(file, 'projects')
      const success = await updateProject(project.id, { image_url: imageUrl })
      
      if (success) {
        return imageUrl
      } else {
        throw new Error('이미지 URL 업데이트 실패')
      }
    } catch (error) {
      alert('이미지 업로드에 실패했습니다. ' + (error as Error).message)
      throw error
    }
  }

  const handleTagAdd = async () => {
    const newTag = prompt('새 기술 스택을 입력하세요:')
    if (!newTag) return
    
    const updatedTechStack = [...(project.tech_stack || []), newTag]
    await updateProject(project.id, { tech_stack: updatedTechStack })
  }

  const handleTagRemove = async (tagToRemove: string) => {
    const updatedTechStack = project.tech_stack?.filter(tech => tech !== tagToRemove) || []
    await updateProject(project.id, { tech_stack: updatedTechStack })
  }
  
  const handleCategoryChange = async () => {
    const newCategory = project.category === 'vibe' ? 'automation' : 'vibe'
    const categoryName = newCategory === 'vibe' ? '바이브코딩' : '자동화'
    
    if (!confirm(`이 프로젝트를 '${categoryName}' 카테고리로 이동하시겠습니까?\n현재 탭에서 사라지게 됩니다.`)) {
      return
    }
    
    await updateProject(project.id, { category: newCategory })
  }

  const handleFeatureToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    // featured는 DB에 없으므로 site_settings에 저장하거나 다른 방법 필요
    // TODO: featured 관리 방법 결정
  }


  return (
    <motion.div
      className={`group relative bg-white border border-gray-200 shadow-lg overflow-hidden ${!isAdminMode ? 'hover:shadow-xl transition-all duration-300' : 'cursor-grab active:cursor-grabbing'} ${
        featured ? 'md:col-span-2' : ''
      } ${className} ${isDeleting ? 'opacity-50' : ''}`}
      onClick={handleClick}
      style={{ cursor: isAdminMode ? 'grab' : 'pointer' }}
      whileHover={!isAdminMode ? { y: -8 } : {}}
      initial={!isAdminMode ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={!isAdminMode ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={!isAdminMode ? { duration: 0.6 } : {}}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >

      {/* 드래그 표시 */}
      {isAdminMode && (
        <div 
          className="absolute top-4 left-4 z-10 p-2 bg-gray-600 text-white rounded-lg opacity-80 cursor-grab active:cursor-grabbing"
          title="카드를 드래그하여 순서 변경"
          {...dragHandleProps}
        >
          <GripVertical size={16} />
        </div>
      )}

      {/* 관리자 모드 컨트롤 */}
      {isAdminMode && (
        <div className="absolute top-4 right-4 z-50 flex gap-2 pointer-events-auto">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              navigate(`/project/${project.id}`)
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors relative z-50"
            title="상세 페이지로 이동"
            type="button"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleFeatureToggle()
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`p-2 rounded-lg ${
              project.featured 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white text-gray-600 border border-gray-200'
            } hover:opacity-80 transition-opacity relative z-50`}
            title={project.featured ? 'Featured 해제' : 'Featured 설정'}
            type="button"
          >
            <Star size={16} fill={project.featured ? 'white' : 'none'} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleDelete(e)
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative z-50"
            disabled={isDeleting}
            title="프로젝트 삭제"
            type="button"
          >
            {isDeleting ? '...' : <Trash2 size={16} />}
          </button>
        </div>
      )}

      {/* 프로젝트 이미지 */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <EditableImage
          src={project.image_url || ''}
          alt={project.title}
          onSave={handleImageUpdate}
          className="w-full h-full object-cover object-center"
          placeholder="클릭하여 이미지 추가"
        />
      </div>

      {/* 프로젝트 정보 */}
      <div className="p-6">
        {/* 카테고리 */}
        <div className="text-sm font-medium mb-2 flex items-center gap-2">
          <span className={project.category === 'vibe' ? 'text-purple-600' : 'text-blue-600'}>
            {project.category === 'vibe' ? '바이브코딩' : '자동화'}
          </span>
          {isAdminMode && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCategoryChange()
              }}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              title="카테고리 변경"
            >
              <Tag size={12} />
              변경
            </button>
          )}
        </div>

        {/* 제목 */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          <EditableText
            value={project.title}
            onSave={handleTitleUpdate}
            placeholder="프로젝트 제목"
          />
        </h3>

        {/* 설명 */}
        <p className="text-gray-600 mb-4">
          <EditableText
            value={project.description_card || project.description || ''}
            onSave={handleDescriptionUpdate}
            placeholder="프로젝트 설명 (카드용)"
            multiline
          />
        </p>

        {/* 기술 스택 (태그로 표시) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack?.map((tech, index) => (
            <span
              key={index}
              className={`text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full group/tag relative ${
                isAdminMode ? 'min-w-[80px] inline-flex items-center' : ''
              }`}
            >
              {isAdminMode ? (
                <>
                  <EditableText
                    value={tech}
                    onSave={async (newValue) => {
                      const updatedTechStack = [...(project.tech_stack || [])]
                      updatedTechStack[index] = newValue
                      await updateProject(project.id, { tech_stack: updatedTechStack })
                      return true
                    }}
                    className="inline-block min-w-[60px] px-1"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTagRemove(tech)
                    }}
                    className="ml-1 text-red-500 opacity-0 group-hover/tag:opacity-100 transition-opacity flex-shrink-0"
                  >
                    ×
                  </button>
                </>
              ) : (
                tech
              )}
            </span>
          ))}
          {isAdminMode && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleTagAdd()
              }}
              className="text-xs px-3 py-1 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors flex items-center gap-1"
            >
              <Plus size={12} />
              기술 추가
            </button>
          )}
        </div>

        {/* 링크 */}
        {!isAdminMode && project.demo_url && (
          <a
            href={project.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <span>프로젝트 보기</span>
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </motion.div>
  )
}