import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Save, Upload, Plus, Trash2, Move, Eye, Image as ImageIcon } from 'lucide-react'
import { Project } from '@/types'
import { vibeProjects, automationProjects } from '@/data'
import AdminNavigation from '@/components/admin/AdminNavigation'

interface ProjectImage {
  id: string
  url: string
  caption: string
  order: number
}

interface ProjectFeature {
  id: string
  title: string
  description: string
}

const AdminProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  
  // 프로젝트 찾기
  const allProjects = [...vibeProjects, ...automationProjects]
  const initialProject = allProjects.find(p => p.id === projectId)
  
  const [project, setProject] = useState<Project | null>(initialProject || null)
  const [images, setImages] = useState<ProjectImage[]>([])
  const [features, setFeatures] = useState<ProjectFeature[]>([])
  const [detailDescription, setDetailDescription] = useState('')
  const [techStackDetail, setTechStackDetail] = useState<string[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'features' | 'detail'>('basic')

  // 초기 데이터 설정
  useEffect(() => {
    if (project) {
      // 실제로는 데이터베이스에서 추가 정보를 로드해야 함
      setDetailDescription(project.detailDescription || '')
      setTechStackDetail(project.techStack || [])
      
      // 기본 이미지 데이터 (실제로는 DB에서 로드)
      setImages([
        { id: '1', url: '/api/placeholder/800/600', caption: '메인 스크린샷', order: 0 },
        { id: '2', url: '/api/placeholder/800/600', caption: '대시보드 화면', order: 1 },
        { id: '3', url: '/api/placeholder/800/600', caption: '모바일 뷰', order: 2 }
      ])
      
      // 기본 기능 데이터 (실제로는 DB에서 로드)
      if (project.features) {
        setFeatures(project.features.map((f, idx) => ({
          id: `feature-${idx}`,
          title: f,
          description: '상세 설명을 입력해주세요.'
        })))
      }
    }
  }, [project])

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">프로젝트를 찾을 수 없습니다</h1>
          <button
            onClick={() => navigate('/admin/projects')}
            className="text-gray-600 hover:text-black transition-colors"
          >
            프로젝트 목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  // 이미지 업로드 처리
  const handleImageUpload = (files: FileList) => {
    // 실제로는 서버에 업로드하고 URL을 받아와야 함
    const newImages = Array.from(files).map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      caption: file.name,
      order: images.length + index
    }))
    setImages([...images, ...newImages])
    setHasChanges(true)
  }

  // 이미지 삭제
  const handleImageDelete = (imageId: string) => {
    setImages(images.filter(img => img.id !== imageId))
    setHasChanges(true)
  }

  // 이미지 캡션 수정
  const handleImageCaptionChange = (imageId: string, caption: string) => {
    setImages(images.map(img => 
      img.id === imageId ? { ...img, caption } : img
    ))
    setHasChanges(true)
  }

  // 기능 추가
  const handleAddFeature = () => {
    const newFeature: ProjectFeature = {
      id: `feature-${Date.now()}`,
      title: '',
      description: ''
    }
    setFeatures([...features, newFeature])
    setHasChanges(true)
  }

  // 기능 삭제
  const handleDeleteFeature = (featureId: string) => {
    setFeatures(features.filter(f => f.id !== featureId))
    setHasChanges(true)
  }

  // 기능 수정
  const handleFeatureChange = (featureId: string, field: 'title' | 'description', value: string) => {
    setFeatures(features.map(f => 
      f.id === featureId ? { ...f, [field]: value } : f
    ))
    setHasChanges(true)
  }

  // 저장
  const handleSave = async () => {
    try {
      // TODO: 실제 API 호출로 저장
      setHasChanges(false)
      alert('프로젝트가 성공적으로 저장되었습니다!')
    } catch (error) {
      alert('저장에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 미리보기
  const handlePreview = () => {
    window.open(`/project/${projectId}`, '_blank')
  }

  const tabClasses = (isActive: boolean) => `
    px-6 py-3 font-medium transition-all
    ${isActive 
      ? 'text-black border-b-2 border-black' 
      : 'text-gray-500 hover:text-black'
    }
  `

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 관리자 네비게이션 */}
      <AdminNavigation />
      
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-[1100px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/projects')}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft size={20} />
                <span>프로젝트 목록</span>
              </button>
              <h1 className="text-2xl font-bold">{project.title} 관리</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black transition-colors"
              >
                <Eye size={18} />
                <span>미리보기</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                  hasChanges 
                    ? 'bg-black text-white hover:bg-gray-900' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save size={18} />
                <span>저장</span>
              </button>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('basic')}
              className={tabClasses(activeTab === 'basic')}
            >
              기본 정보
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={tabClasses(activeTab === 'images')}
            >
              이미지 관리
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={tabClasses(activeTab === 'features')}
            >
              주요 기능
            </button>
            <button
              onClick={() => setActiveTab('detail')}
              className={tabClasses(activeTab === 'detail')}
            >
              상세 설명
            </button>
          </div>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="max-w-[1100px] mx-auto px-8 py-8">
        <AnimatePresence mode="wait">
          {/* 기본 정보 탭 */}
          {activeTab === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 space-y-6"
            >
              <h2 className="text-xl font-bold mb-6">기본 정보</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 제목
                </label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => {
                    setProject({ ...project, title: e.target.value })
                    setHasChanges(true)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  간단 설명
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) => {
                    setProject({ ...project, description: e.target.value })
                    setHasChanges(true)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <input
                    type="text"
                    value={project.category}
                    onChange={(e) => {
                      setProject({ ...project, category: e.target.value })
                      setHasChanges(true)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    개발 상태
                  </label>
                  <select
                    value={project.development_status || 'completed'}
                    onChange={(e) => {
                      setProject({ ...project, development_status: e.target.value })
                      setHasChanges(true)
                    }}
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
                  기술 스택
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => {
                          const newTags = project.tags.filter((_, i) => i !== index)
                          setProject({ ...project, tags: newTags })
                          setHasChanges(true)
                        }}
                        className="text-gray-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="새 기술 스택 추가 (Enter로 추가)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      setProject({ 
                        ...project, 
                        tags: [...project.tags, e.currentTarget.value.trim()] 
                      })
                      e.currentTarget.value = ''
                      setHasChanges(true)
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>
            </motion.div>
          )}

          {/* 이미지 관리 탭 */}
          {activeTab === 'images' && (
            <motion.div
              key="images"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8"
            >
              <h2 className="text-xl font-bold mb-6">이미지 관리</h2>
              
              {/* 이미지 업로드 영역 */}
              <div className="mb-8">
                <label className="block border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                  <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">이미지를 드래그하거나 클릭하여 업로드</p>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG, GIF (최대 5MB)</p>
                </label>
              </div>

              {/* 이미지 목록 */}
              <div className="grid grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img 
                        src={image.url} 
                        alt={image.caption}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <input
                      type="text"
                      value={image.caption}
                      onChange={(e) => handleImageCaptionChange(image.id, e.target.value)}
                      className="w-full mt-2 px-2 py-1 text-sm border border-gray-300 focus:outline-none focus:border-black"
                      placeholder="이미지 설명"
                    />
                    <button
                      onClick={() => handleImageDelete(image.id)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 주요 기능 탭 */}
          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">주요 기능</h2>
                <button
                  onClick={handleAddFeature}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  <Plus size={18} />
                  <span>기능 추가</span>
                </button>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={feature.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="cursor-move text-gray-400">
                        <Move size={20} />
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => handleFeatureChange(feature.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 font-medium border border-gray-300 focus:outline-none focus:border-black"
                          placeholder="기능 제목"
                        />
                        <textarea
                          value={feature.description}
                          onChange={(e) => handleFeatureChange(feature.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                          rows={2}
                          placeholder="기능 설명"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 상세 설명 탭 */}
          {activeTab === 'detail' && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8"
            >
              <h2 className="text-xl font-bold mb-6">상세 설명</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    프로젝트 상세 설명
                  </label>
                  <textarea
                    value={detailDescription}
                    onChange={(e) => {
                      setDetailDescription(e.target.value)
                      setHasChanges(true)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    rows={10}
                    placeholder="프로젝트에 대한 자세한 설명을 작성해주세요. 마크다운 문법을 지원합니다."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    마크다운 문법을 사용할 수 있습니다. (제목: #, 굵게: **텍스트**, 리스트: - 항목)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기술 스택 상세
                  </label>
                  <div className="space-y-2">
                    {techStackDetail.map((tech, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => {
                            const newTechStack = [...techStackDetail]
                            newTechStack[index] = e.target.value
                            setTechStackDetail(newTechStack)
                            setHasChanges(true)
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                          placeholder="예: Frontend: React 19 + TypeScript + Vite"
                        />
                        <button
                          onClick={() => {
                            setTechStackDetail(techStackDetail.filter((_, i) => i !== index))
                            setHasChanges(true)
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setTechStackDetail([...techStackDetail, ''])
                        setHasChanges(true)
                      }}
                      className="w-full py-2 border border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
                    >
                      + 기술 스택 추가
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      라이브 URL
                    </label>
                    <input
                      type="url"
                      value={project.url || ''}
                      onChange={(e) => {
                        setProject({ ...project, url: e.target.value })
                        setHasChanges(true)
                      }}
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
                      value={project.github_url || ''}
                      onChange={(e) => {
                        setProject({ ...project, github_url: e.target.value })
                        setHasChanges(true)
                      }}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AdminProjectDetailPage