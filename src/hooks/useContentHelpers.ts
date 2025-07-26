import { useCallback } from 'react'
import { PortfolioContent } from '@/lib/supabase'
import { AdminAPI } from '@/lib/adminAPI'

interface UseContentHelpersProps {
  content: PortfolioContent[]
  updateContent: (id: string, content: string) => Promise<boolean>
  section?: string
  refetch?: () => Promise<void>
}

interface UseContentHelpersReturn {
  getContentValue: (field: string) => string
  getContentId: (field: string) => string
  handleContentUpdate: (field: string, newValue: string) => Promise<boolean>
}

export const useContentHelpers = ({ 
  content, 
  updateContent,
  section,
  refetch
}: UseContentHelpersProps): UseContentHelpersReturn => {
  const getContentValue = useCallback((field: string) => {
    return content.find(item => item.field === field)?.content || ''
  }, [content])
  
  const getContentId = useCallback((field: string) => {
    return content.find(item => item.field === field)?.id || ''
  }, [content])
  
  const handleContentUpdate = useCallback(async (field: string, newValue: string) => {
    const id = getContentId(field)
    
    if (id) {
      // 기존 레코드 업데이트
      return await updateContent(id, newValue)
    } else {
      // 새 레코드 생성
      if (section) {
        try {
          await AdminAPI.updateContentByField(section, field, newValue)
          
          if (refetch) {
            await refetch()
          }
          
          return true
        } catch (error) {
          console.error('새 레코드 생성 실패:', error)
          return false
        }
      } else {
        console.error('section이 없어서 새 레코드 생성 불가')
        return false
      }
    }
  }, [getContentId, updateContent, content, section, refetch])

  return {
    getContentValue,
    getContentId,
    handleContentUpdate
  }
}