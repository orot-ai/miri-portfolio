import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Upload, Trash2, Download, Copy, Search, Filter, Grid, List, Image as ImageIcon, FileText, Video, File } from 'lucide-react'
import AdminNavigation from '@/components/admin/AdminNavigation'

interface MediaFile {
  id: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  created_at: string
  thumbnail?: string
}

type ViewMode = 'grid' | 'list'
type FileTypeFilter = 'all' | 'image' | 'video' | 'document' | 'other'

const AdminMediaPage: React.FC = () => {
  const navigate = useNavigate()
  const [files, setFiles] = useState<MediaFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [fileTypeFilter, setFileTypeFilter] = useState<FileTypeFilter>('all')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // 초기 데이터 로드
  useEffect(() => {
    // 실제로는 데이터베이스에서 로드해야 함
    const mockFiles: MediaFile[] = [
      {
        id: '1',
        file_name: 'hero-background.jpg',
        file_path: '/uploads/hero-background.jpg',
        file_type: 'image/jpeg',
        file_size: 2048576,
        created_at: '2025-01-20',
        thumbnail: '/api/placeholder/200/200'
      },
      {
        id: '2',
        file_name: 'project-screenshot-1.png',
        file_path: '/uploads/project-screenshot-1.png',
        file_type: 'image/png',
        file_size: 1024768,
        created_at: '2025-01-18',
        thumbnail: '/api/placeholder/200/200'
      },
      {
        id: '3',
        file_name: 'resume.pdf',
        file_path: '/uploads/resume.pdf',
        file_type: 'application/pdf',
        file_size: 524288,
        created_at: '2025-01-15'
      }
    ]
    setFiles(mockFiles)
  }, [])

  // 파일 업로드 처리
  const handleFileUpload = async (fileList: FileList) => {
    setIsUploading(true)
    const uploadedFiles: MediaFile[] = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      
      // 진행률 시뮬레이션 (실제로는 XMLHttpRequest나 fetch의 progress 이벤트 사용)
      setUploadProgress(((i + 1) / fileList.length) * 100)
      
      // 실제로는 서버에 업로드하고 결과를 받아와야 함
      await new Promise(resolve => setTimeout(resolve, 1000)) // 시뮬레이션
      
      const newFile: MediaFile = {
        id: `file-${Date.now()}-${i}`,
        file_name: file.name,
        file_path: `/uploads/${file.name}`,
        file_type: file.type,
        file_size: file.size,
        created_at: new Date().toISOString().split('T')[0],
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }
      
      uploadedFiles.push(newFile)
    }

    setFiles(prev => [...uploadedFiles, ...prev])
    setIsUploading(false)
    setUploadProgress(0)
  }

  // 파일 삭제
  const handleDelete = (fileIds: string[]) => {
    if (confirm(`${fileIds.length}개의 파일을 삭제하시겠습니까?`)) {
      setFiles(prev => prev.filter(file => !fileIds.includes(file.id)))
      setSelectedFiles([])
      // TODO: 실제 서버에서 삭제
    }
  }

  // 파일 선택
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  // 전체 선택/해제
  const toggleSelectAll = () => {
    const filteredFiles = getFilteredFiles()
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id))
    }
  }

  // 파일 필터링
  const getFilteredFiles = () => {
    return files.filter(file => {
      // 검색어 필터
      if (searchQuery && !file.file_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // 파일 타입 필터
      if (fileTypeFilter !== 'all') {
        if (fileTypeFilter === 'image' && !file.file_type.startsWith('image/')) return false
        if (fileTypeFilter === 'video' && !file.file_type.startsWith('video/')) return false
        if (fileTypeFilter === 'document' && !file.file_type.includes('pdf') && !file.file_type.includes('doc')) return false
        if (fileTypeFilter === 'other' && (
          file.file_type.startsWith('image/') || 
          file.file_type.startsWith('video/') || 
          file.file_type.includes('pdf') || 
          file.file_type.includes('doc')
        )) return false
      }
      
      return true
    })
  }

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // 파일 아이콘 가져오기
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon size={24} />
    if (fileType.startsWith('video/')) return <Video size={24} />
    if (fileType.includes('pdf') || fileType.includes('doc')) return <FileText size={24} />
    return <File size={24} />
  }

  // URL 복사
  const copyFileUrl = (filePath: string) => {
    const fullUrl = window.location.origin + filePath
    navigator.clipboard.writeText(fullUrl)
    alert('URL이 클립보드에 복사되었습니다.')
  }

  const filteredFiles = getFilteredFiles()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 관리자 네비게이션 */}
      <AdminNavigation />
      
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-[1200px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">미디어 라이브러리</h1>
            
            {/* 업로드 버튼 */}
            <label className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 transition-colors cursor-pointer">
              <Upload size={18} />
              <span>파일 업로드</span>
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                accept="image/*,video/*,application/pdf,.doc,.docx"
              />
            </label>
          </div>
        </div>

        {/* 툴바 */}
        <div className="max-w-[1200px] mx-auto px-8 py-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* 검색 */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="파일 검색..."
                  className="pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              {/* 필터 */}
              <select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value as FileTypeFilter)}
                className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
              >
                <option value="all">모든 파일</option>
                <option value="image">이미지</option>
                <option value="video">비디오</option>
                <option value="document">문서</option>
                <option value="other">기타</option>
              </select>

              {/* 선택된 파일 작업 */}
              {selectedFiles.length > 0 && (
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm text-gray-600">
                    {selectedFiles.length}개 선택됨
                  </span>
                  <button
                    onClick={() => handleDelete(selectedFiles)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    선택 해제
                  </button>
                </div>
              )}
            </div>

            {/* 보기 모드 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'text-black bg-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'text-black bg-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 업로드 진행 표시 */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border-b border-blue-200"
          >
            <div className="max-w-[1200px] mx-auto px-8 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">업로드 중...</span>
                <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-blue-100 h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 파일 목록 */}
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">
              {searchQuery || fileTypeFilter !== 'all' 
                ? '검색 결과가 없습니다.' 
                : '아직 업로드된 파일이 없습니다.'}
            </p>
            {!searchQuery && fileTypeFilter === 'all' && (
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 transition-colors cursor-pointer">
                <Upload size={18} />
                <span>첫 파일 업로드하기</span>
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // 그리드 뷰
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map(file => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative group cursor-pointer ${
                  selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {file.thumbnail ? (
                    <img 
                      src={file.thumbnail} 
                      alt={file.file_name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {getFileIcon(file.file_type)}
                    </div>
                  )}
                </div>
                
                {/* 오버레이 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-end">
                  <div className="w-full p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">{file.file_name}</p>
                    <p className="text-white text-xs opacity-75">{formatFileSize(file.file_size)}</p>
                  </div>
                </div>

                {/* 선택 체크박스 */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => {}}
                    className="w-4 h-4 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* 액션 버튼 */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyFileUrl(file.file_path)
                    }}
                    className="p-1 bg-white text-gray-600 hover:text-black"
                    title="URL 복사"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete([file.id])
                    }}
                    className="p-1 bg-white text-red-600 hover:text-red-800"
                    title="삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // 리스트 뷰
          <div className="bg-white border">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">파일명</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">타입</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">크기</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">업로드 날짜</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map(file => (
                  <tr key={file.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400">
                          {getFileIcon(file.file_type)}
                        </div>
                        <span className="text-sm font-medium">{file.file_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {file.file_type.split('/')[1]?.toUpperCase() || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatFileSize(file.file_size)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {file.created_at}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyFileUrl(file.file_path)}
                          className="p-1 text-gray-600 hover:text-black"
                          title="URL 복사"
                        >
                          <Copy size={16} />
                        </button>
                        <a
                          href={file.file_path}
                          download
                          className="p-1 text-gray-600 hover:text-black"
                          title="다운로드"
                        >
                          <Download size={16} />
                        </a>
                        <button
                          onClick={() => handleDelete([file.id])}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminMediaPage