import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, GripVertical, ExternalLink, Github, ArrowLeft } from 'lucide-react'
import { Project } from '@/types'
import { vibeProjects, automationProjects } from '@/data'
import AdminNavigation from '@/components/admin/AdminNavigation'

type TabType = 'vibe' | 'automation'

const AdminProjectsPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('vibe')
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  // 초기 데이터 로드
  useEffect(() => {
    // 실제로는 데이터베이스에서 로드해야 함
    const loadedProjects = activeTab === 'vibe' ? [...vibeProjects] : [...automationProjects]
    setProjects(loadedProjects)
  }, [activeTab])

  // 프로젝트 삭제
  const handleDelete = (project: Project) => {
    setProjectToDelete(project)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id))
      setIsDeleteModalOpen(false)
      setProjectToDelete(null)
      // TODO: 실제 데이터베이스에서 삭제
    }
  }

  // 프로젝트 추가/수정
  const handleEdit = (project: Project | null) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (selectedProject) {
      // 수정
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id ? { ...p, ...projectData } : p
      ))
    } else {
      // 추가
      const newProject: Project = {
        id: `project-${Date.now()}`,
        title: projectData.title || '',
        description: projectData.description || '',
        category: projectData.category || '',
        tags: projectData.tags || [],
        featured: projectData.featured || false,
        url: projectData.url,
        ...projectData
      }
      setProjects(prev => [...prev, newProject])
    }
    setIsModalOpen(false)
    setSelectedProject(null)
    // TODO: 실제 데이터베이스에 저장
  }

  // 프로젝트 상세 페이지로 이동
  const handleViewDetail = (project: Project) => {
    navigate(`/admin/project/${project.id}`)
  }

  // 프로젝트 미리보기
  const handlePreview = (project: Project) => {
    window.open(`/project/${project.id}`, '_blank')
  }

  const tabVariants = {
    inactive: { 
      backgroundColor: '#FFFFFF',
      color: '#6B7280'
    },
    active: { 
      backgroundColor: '#000000',
      color: '#FFFFFF'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 관리자 네비게이션 */}
      <AdminNavigation />
      
      {/* 헤더 */}
      <div className="bg-white border-b mt-16">
        <div className="max-w-[1100px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">프로젝트 관리</h1>
            <button
              onClick={() => handleEdit(null)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 transition-colors"
            >
              <Plus size={20} />
              <span>새 프로젝트</span>
            </button>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="flex gap-4 py-4">
            <motion.button
              onClick={() => setActiveTab('vibe')}
              className="px-6 py-2 font-medium"
              variants={tabVariants}
              animate={activeTab === 'vibe' ? 'active' : 'inactive'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              바이브코딩 프로젝트
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('automation')}
              className="px-6 py-2 font-medium"
              variants={tabVariants}
              animate={activeTab === 'automation' ? 'active' : 'inactive'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              자동화 프로젝트
            </motion.button>
          </div>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="max-w-[1100px] mx-auto px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="cursor-move text-gray-400 hover:text-gray-600">
                      <GripVertical size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-4 mb-2">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        {project.featured && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800">Featured</span>
                        )}
                        <span className="text-xs text-gray-500">{project.category}</span>
                      </div>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        {project.url && (
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink size={14} />
                            <span>라이브 사이트</span>
                          </a>
                        )}
                        {project.github_url && (
                          <a 
                            href={project.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                          >
                            <Github size={14} />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleViewDetail(project)}
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                      title="상세 관리"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handlePreview(project)}
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                      title="미리보기"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                      title="수정"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(project)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                      title="삭제"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 프로젝트 추가/수정 모달 */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6">
                {selectedProject ? '프로젝트 수정' : '새 프로젝트 추가'}
              </h2>
              
              <ProjectForm
                project={selectedProject}
                onSave={handleSaveProject}
                onCancel={() => setIsModalOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 삭제 확인 모달 */}
      <AnimatePresence>
        {isDeleteModalOpen && projectToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">프로젝트 삭제</h2>
              <p className="text-gray-600 mb-6">
                "{projectToDelete.title}" 프로젝트를 정말 삭제하시겠습니까?
                <br />
                이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-black transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  삭제
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 프로젝트 폼 컴포넌트
const ProjectForm: React.FC<{
  project: Project | null
  onSave: (data: Partial<Project>) => void
  onCancel: () => void
}> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || '',
    tags: project?.tags?.join(', ') || '',
    featured: project?.featured || false,
    url: project?.url || '',
    github_url: project?.github_url || '',
    development_status: project?.development_status || 'completed'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          프로젝트 제목 *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          설명 *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
            placeholder="예: SaaS Platform, Mobile App"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            개발 상태
          </label>
          <select
            value={formData.development_status}
            onChange={(e) => setFormData({ ...formData, development_status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
          >
            <option value="completed">완료</option>
            <option value="in-progress">개발중</option>
            <option value="planning">기획중</option>
            <option value="suspended">중단</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          기술 스택 (쉼표로 구분)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
          placeholder="예: React, TypeScript, Node.js"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            라이브 URL
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
            placeholder="https://github.com/username/repo"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">주요 프로젝트로 설정</span>
        </label>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-black transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white hover:bg-gray-900 transition-colors"
        >
          {project ? '수정' : '추가'}
        </button>
      </div>
    </form>
  )
}

export default AdminProjectsPage