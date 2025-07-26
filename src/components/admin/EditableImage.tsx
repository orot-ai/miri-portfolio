import React, { useState, useRef } from 'react'
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react'
import { AdminAPI } from '@/lib/adminAPI'
import { useAdminStore } from '@/stores/adminStore'
import { logger } from '@/utils/logger'

interface EditableImageProps {
  src?: string
  alt: string
  onSave: (file: File) => Promise<string>
  className?: string
  placeholder?: string
  disabled?: boolean
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onSave,
  className = 'w-full h-full object-cover object-center',
  placeholder = '이미지를 업로드하세요',
  disabled = false
}) => {
  const { isAdminMode } = useAdminStore()
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    if (disabled || !isAdminMode) {
      return
    }
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    setSelectedFile(file)
    
    // 미리보기 생성
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!selectedFile) {
      return
    }

    setIsUploading(true)
    try {
      const uploadedUrl = await onSave(selectedFile)
      
      if (uploadedUrl) {
        setPreviewUrl(null)
        setSelectedFile(null)
      }
    } catch (error) {
      logger.error('Image upload failed:', error)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const displaySrc = previewUrl || src

  return (
    <div className="relative group w-full h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div 
        className={`relative overflow-hidden w-full h-full ${isAdminMode && !disabled ? 'cursor-pointer border-2 border-dashed border-gray-300 hover:border-purple-600' : ''} transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={handleImageClick}
      >
        {displaySrc ? (
          <img 
            src={displaySrc} 
            alt={alt}
            className={className}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400">
            <ImageIcon size={48} className="mb-2" />
            <span className="text-sm">{placeholder}</span>
          </div>
        )}

        {!disabled && !previewUrl && isAdminMode && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <Upload 
              size={24} 
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity" 
            />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {previewUrl && !isUploading && (
        <div className="absolute top-2 right-2 flex gap-1 z-20">
          <button
            onClick={handleSave}
            className="p-2 bg-green-600 text-white hover:bg-green-700 rounded shadow-lg transition-colors"
            title="저장"
          >
            <Check size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 bg-red-600 text-white hover:bg-red-700 rounded shadow-lg transition-colors"
            title="취소"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default EditableImage