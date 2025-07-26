import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { logger } from '@/utils/logger'

interface EditableTextProps {
  value: string
  onSave: (newValue: string) => Promise<boolean>
  onTempSave?: (newValue: string) => void  // 임시저장용 콜백
  className?: string
  placeholder?: string
  multiline?: boolean
  disabled?: boolean
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  onTempSave,
  className = '',
  placeholder = '텍스트를 입력하세요',
  multiline = false,
  disabled = false
}) => {
  const { isAdminMode } = useAdminStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (multiline) {
        const textarea = inputRef.current as HTMLTextAreaElement
        textarea.setSelectionRange(textarea.value.length, textarea.value.length)
      } else {
        const input = inputRef.current as HTMLInputElement
        input.setSelectionRange(input.value.length, input.value.length)
      }
    }
  }, [isEditing, multiline])

  // 범위 바깥 클릭 감지 - 저장
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditing && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleSave()
      }
    }

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isEditing, editValue])

  const handleEdit = useCallback((e?: React.MouseEvent) => {
    console.log('🔥 EditableText 클릭됨!', { disabled, isAdminMode, value })
    logger.debug('EditableText 클릭됨', { disabled, isAdminMode, value })
    
    // 이벤트 전파 중단
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (disabled || !isAdminMode) {
      console.log('❌ 편집 불가능:', { disabled, isAdminMode })
      logger.debug('편집 불가능:', { disabled, isAdminMode })
      return
    }
    
    console.log('✅ 편집 모드 활성화!')
    logger.debug('편집 모드 활성화')
    setIsEditing(true)
    setEditValue(value)
  }, [disabled, isAdminMode, value])

  const handleTempSave = () => {
    if (editValue.trim() === value.trim()) {
      setIsEditing(false)
      return
    }

    // 임시저장: 로컬 상태만 업데이트, 서버 저장 안함
    if (onTempSave) {
      onTempSave(editValue.trim())
    }
    setIsEditing(false)
  }

  const handleSave = useCallback(async () => {
    logger.debug('handleSave 호출됨', { editValue, originalValue: value })
    if (editValue.trim() === value.trim()) {
      logger.debug('값이 동일하여 저장 안함')
      setIsEditing(false)
      return
    }

    logger.info('저장 시작:', editValue.trim())
    setIsLoading(true)
    try {
      const success = await onSave(editValue.trim())
      logger.info('저장 결과:', success)
      setIsLoading(false)

      if (success) {
        setIsEditing(false)
      } else {
        setEditValue(value) // 실패시 원래 값으로 되돌림
      }
    } catch (error) {
      logger.error('저장 중 에러:', error)
      setIsLoading(false)
      setEditValue(value)
    }
  }, [editValue, value, onSave])

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()  // Enter로 저장
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault()
      handleSave()  // Ctrl+Enter로 저장
    }
  }

  if (isEditing) {
    return (
      <div ref={containerRef} className="relative group">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`w-full p-3 border-2 border-purple-600 rounded focus:outline-none resize-y bg-transparent min-h-[120px] ${className}`}
            placeholder={placeholder}
            disabled={isLoading}
            rows={6}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`w-full p-2 border-2 border-purple-600 rounded focus:outline-none bg-transparent ${className}`}
            placeholder={placeholder}
            disabled={isLoading}
          />
        )}
        
        <div className="absolute -right-16 top-0 flex gap-1">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
            title="저장 (Enter)"
          >
            <Check size={16} />
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
            title="취소 (Esc)"
          >
            <X size={16} />
          </button>
        </div>
        
        {multiline && (
          <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
            Ctrl + Enter로 임시저장
          </div>
        )}
      </div>
    )
  }

  return (
    <span 
      className={`group relative inline-block ${isAdminMode && !disabled ? 'cursor-pointer hover:bg-gray-50 hover:bg-opacity-20' : ''} rounded transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      onClick={(e) => {
        if (isAdminMode && !disabled) {
          e.preventDefault();
          e.stopPropagation();
          handleEdit(e);
        }
      }}
      style={{
        zIndex: isAdminMode ? 9999 : 'auto',
        position: 'relative'
      }}
    >
      {value || <span className="text-gray-400 italic">{placeholder}</span>}
      
      {!disabled && isAdminMode && (
        <Edit2 
          size={14} 
          className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" 
        />
      )}
    </span>
  )
}

export default EditableText