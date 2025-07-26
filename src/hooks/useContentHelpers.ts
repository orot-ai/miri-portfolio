import { useCallback } from 'react'
import { PortfolioContent } from '@/lib/supabase'

interface UseContentHelpersProps {
  content: PortfolioContent[]
  updateContent: (id: string, content: string) => Promise<boolean>
}

interface UseContentHelpersReturn {
  getContentValue: (field: string) => string
  getContentId: (field: string) => string
  handleContentUpdate: (field: string, newValue: string) => Promise<boolean>
}

export const useContentHelpers = ({ 
  content, 
  updateContent 
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
      return await updateContent(id, newValue)
    }
    return false
  }, [getContentId, updateContent])

  return {
    getContentValue,
    getContentId,
    handleContentUpdate
  }
}