import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminToolbar } from '@/components/admin/AdminToolbar'
import AdminNavigation from '@/components/admin/AdminNavigation'
import { AdminHeroSection } from '@/components/admin/sections/AdminHeroSection'
import { AdminAboutSection } from '@/components/admin/sections/AdminAboutSection'
import { AdminWorkProcessSection } from '@/components/admin/sections/AdminWorkProcessSection'
import { AdminProjectsSection } from '@/components/admin/sections/AdminProjectsSection'
import { AdminContactSection } from '@/components/admin/sections/AdminContactSection'

const AdminPage: React.FC = () => {
  const navigate = useNavigate()
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, any>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // 임시저장 처리
  const handleTempSave = (section: string, field: string, value: any) => {
    const key = `${section}.${field}`
    setUnsavedChanges(prev => ({
      ...prev,
      [key]: value
    }))
    setHasUnsavedChanges(true)
  }

  // 실제 서버 저장
  const handleSaveAll = async () => {
    try {
      // TODO: 실제 API 호출로 서버에 저장
      // await saveToServer(unsavedChanges)
      
      setUnsavedChanges({})
      setHasUnsavedChanges(false)
      alert('모든 변경사항이 저장되었습니다!')
    } catch (error) {
      alert('저장에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handlePreview = () => {
    window.open('/', '_blank')
  }

  const handleSettings = () => {
    navigate('/admin/settings')
  }

  const handleLogout = () => {
    if (confirm('관리자 페이지에서 나가시겠습니까?')) {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 관리자 네비게이션 */}
      <AdminNavigation />

      {/* 메인 콘텐츠 - 네비게이션 높이만큼 패딩 추가 */}
      <div className="pt-20">
        {/* Hero Section */}
        <AdminHeroSection onTempSave={handleTempSave} />

        {/* About Section */}
        <AdminAboutSection onTempSave={handleTempSave} />

        {/* Work Process Section */}
        <AdminWorkProcessSection onTempSave={handleTempSave} />

        {/* Projects Section */}
        <AdminProjectsSection onTempSave={handleTempSave} />

        {/* Contact Section */}
        <AdminContactSection onTempSave={handleTempSave} />
      </div>
    </div>
  )
}

export default AdminPage