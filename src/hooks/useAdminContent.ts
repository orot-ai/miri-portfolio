import { useState, useEffect } from 'react'
import { AdminAPI } from '@/lib/adminAPI'
import { PortfolioContent } from '@/lib/supabase'

export const useAdminContent = (section?: string) => {
  const [content, setContent] = useState<PortfolioContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setLoading(true)
      const data = section 
        ? await AdminAPI.getContentBySection(section)
        : await AdminAPI.getPortfolioContent()
      setContent(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '콘텐츠를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (id: string, newContent: string) => {
    try {
      await AdminAPI.updateContent(id, newContent)
      setContent(prev => prev.map(item => 
        item.id === id ? { ...item, content: newContent } : item
      ))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '콘텐츠 업데이트에 실패했습니다')
      return false
    }
  }

  const createContent = async (section: string, field: string, content: string, contentType = 'text') => {
    try {
      const newContent = await AdminAPI.createContent(section, field, content, contentType)
      setContent(prev => [...prev, newContent])
      return newContent
    } catch (err) {
      setError(err instanceof Error ? err.message : '콘텐츠 생성에 실패했습니다')
      return null
    }
  }

  useEffect(() => {
    fetchContent()
  }, [section])

  return {
    content,
    loading,
    error,
    updateContent,
    createContent,
    refetch: fetchContent
  }
}