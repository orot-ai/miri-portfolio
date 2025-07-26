import React, { useState, useRef } from 'react'
import { Upload, X, Check, Image as ImageIcon, Video, Heart, Play } from 'lucide-react'
import { AdminAPI } from '@/lib/adminAPI'
import { useAdminStore } from '@/stores/adminStore'
import { logger } from '@/utils/logger'

export type MediaType = 'image' | 'video'

interface EditableMediaProps {
  src?: string
  alt: string
  mediaType?: MediaType
  onSave: (file: File, mediaType: MediaType) => Promise<string>
  className?: string
  placeholder?: string
  disabled?: boolean
  allowVideo?: boolean  // 동영상 업로드 허용 여부
}

export const EditableMedia: React.FC<EditableMediaProps> = ({
  src,
  alt,
  mediaType = 'image',
  onSave,
  className = 'w-full h-full object-cover object-center',
  placeholder = '미디어를 업로드하세요',
  disabled = false,
  allowVideo = true
}) => {
  const { isAdminMode } = useAdminStore()
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>(mediaType)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMediaClick = () => {
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
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (!isImage && !isVideo) {
      alert('이미지 또는 동영상 파일만 업로드 가능합니다.')
      return
    }

    if (isVideo && !allowVideo) {
      alert('이 위치에서는 동영상 업로드가 지원되지 않습니다.')
      return
    }

    // 파일 크기 검증
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // 동영상 50MB, 이미지 10MB
    if (file.size > maxSize) {
      const maxSizeText = isVideo ? '50MB' : '10MB'
      alert(`파일 크기는 ${maxSizeText} 이하여야 합니다.`)
      return
    }

    setSelectedFile(file)
    setSelectedMediaType(isVideo ? 'video' : 'image')
    
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
      const uploadedUrl = await onSave(selectedFile, selectedMediaType)
      
      if (uploadedUrl) {
        setPreviewUrl(null)
        setSelectedFile(null)
      }
    } catch (error) {
      logger.error('Media upload failed:', error)
      alert('미디어 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    setSelectedFile(null)
    setSelectedMediaType(mediaType)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const displaySrc = previewUrl || src
  const currentMediaType = previewUrl ? selectedMediaType : mediaType

  const renderMedia = () => {
    if (!displaySrc) {
      return (
        <div className="flex items-center justify-center h-full w-full">
          <Heart className="w-8 h-8 text-gray-300" />
        </div>
      )
    }

    if (currentMediaType === 'video') {
      return (
        <div className="relative w-full h-full">
          <video 
            src={displaySrc} 
            className={className}
            controls={!isAdminMode}
            muted
            loop
            playsInline
          />
          {isAdminMode && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-8 h-8 text-white bg-black bg-opacity-50 rounded-full p-2" />
            </div>
          )}
        </div>
      )
    }

    return (
      <img 
        src={displaySrc} 
        alt={alt}
        className={className}
      />
    )
  }

  const acceptedFormats = allowVideo ? 'image/*,video/*' : 'image/*'

  return (
    <div className="relative group w-full h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div 
        className={`relative overflow-hidden w-full h-full ${isAdminMode && !disabled ? 'cursor-pointer border-2 border-dashed border-gray-300 hover:border-purple-600' : ''} transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={handleMediaClick}
      >
        {renderMedia()}

        {!disabled && !previewUrl && isAdminMode && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Upload 
                size={24} 
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity" 
              />
              {allowVideo && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon size={16} className="text-white" />
                  <Video size={16} className="text-white" />
                </div>
              )}
            </div>
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

      {previewUrl && selectedMediaType && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
          {selectedMediaType === 'video' ? '동영상' : '이미지'}
        </div>
      )}
    </div>
  )
}

export default EditableMedia