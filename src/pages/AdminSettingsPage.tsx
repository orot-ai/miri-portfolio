import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Globe, Mail, Github, Linkedin, Palette, Monitor, Moon, Sun } from 'lucide-react'
import AdminNavigation from '@/components/admin/AdminNavigation'

interface SiteSetting {
  key: string
  value: string
  label: string
  type: 'text' | 'email' | 'url' | 'color' | 'boolean' | 'number'
  description?: string
}

const AdminSettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'display' | 'social' | 'advanced'>('general')

  // 초기 설정 로드
  useEffect(() => {
    // 실제로는 데이터베이스에서 로드해야 함
    const initialSettings: SiteSetting[] = [
      // 일반 설정
      { key: 'site_title', value: '미리 포트폴리오', label: '사이트 제목', type: 'text' },
      { key: 'site_description', value: '창의적인 아이디어를 현실로 만드는 개발자 미리의 포트폴리오입니다.', label: '사이트 설명', type: 'text' },
      { key: 'contact_email', value: 'miri@example.com', label: '연락처 이메일', type: 'email' },
      
      // 디스플레이 설정
      { key: 'theme_color', value: '#3B82F6', label: '테마 색상', type: 'color' },
      { key: 'enable_dark_mode', value: 'true', label: '다크 모드 지원', type: 'boolean' },
      { key: 'projects_per_page', value: '6', label: '페이지당 프로젝트 수', type: 'number' },
      { key: 'show_projects', value: 'true', label: '프로젝트 섹션 표시', type: 'boolean' },
      
      // 소셜 링크
      { key: 'github_profile', value: 'https://github.com/miri', label: 'GitHub 프로필', type: 'url' },
      { key: 'linkedin_profile', value: 'https://linkedin.com/in/miri', label: 'LinkedIn 프로필', type: 'url' },
      
      // 고급 설정
      { key: 'google_analytics_id', value: '', label: 'Google Analytics ID', type: 'text', description: '예: G-XXXXXXXXXX' },
    ]
    
    setSettings(initialSettings)
  }, [])

  // 설정 값 변경
  const handleSettingChange = (key: string, value: string) => {
    setSettings(settings.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ))
    setHasChanges(true)
  }

  // 저장
  const handleSave = async () => {
    try {
      console.log('저장할 설정:', settings)
      // TODO: 실제 API 호출로 저장
      setHasChanges(false)
      alert('설정이 성공적으로 저장되었습니다!')
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 탭별 설정 필터링
  const getSettingsByTab = () => {
    switch (activeTab) {
      case 'general':
        return settings.filter(s => ['site_title', 'site_description', 'contact_email'].includes(s.key))
      case 'display':
        return settings.filter(s => ['theme_color', 'enable_dark_mode', 'projects_per_page', 'show_projects'].includes(s.key))
      case 'social':
        return settings.filter(s => ['github_profile', 'linkedin_profile'].includes(s.key))
      case 'advanced':
        return settings.filter(s => ['google_analytics_id'].includes(s.key))
      default:
        return []
    }
  }

  const renderSettingInput = (setting: SiteSetting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={setting.value === 'true'}
              onChange={(e) => handleSettingChange(setting.key, e.target.checked ? 'true' : 'false')}
              className="w-5 h-5"
            />
            <span className="text-gray-700">{setting.label}</span>
          </label>
        )
      
      case 'color':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {setting.label}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={setting.value}
                onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                className="w-20 h-10 border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={setting.value}
                onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                placeholder="#000000"
              />
            </div>
          </div>
        )
      
      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {setting.label}
            </label>
            <input
              type="number"
              value={setting.value}
              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
              min="1"
            />
          </div>
        )
      
      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {setting.label}
            </label>
            <input
              type={setting.type}
              value={setting.value}
              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
              placeholder={setting.description}
            />
            {setting.description && (
              <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
            )}
          </div>
        )
    }
  }

  const tabClasses = (isActive: boolean) => `
    px-6 py-3 font-medium transition-all
    ${isActive 
      ? 'text-black border-b-2 border-black' 
      : 'text-gray-500 hover:text-black'
    }
  `

  const tabIcons = {
    general: <Globe size={18} />,
    display: <Palette size={18} />,
    social: <Github size={18} />,
    advanced: <Monitor size={18} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 관리자 네비게이션 */}
      <AdminNavigation />
      
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-[1100px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">사이트 설정</h1>
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

        {/* 탭 네비게이션 */}
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('general')}
              className={tabClasses(activeTab === 'general')}
            >
              <span className="flex items-center gap-2">
                {tabIcons.general}
                일반 설정
              </span>
            </button>
            <button
              onClick={() => setActiveTab('display')}
              className={tabClasses(activeTab === 'display')}
            >
              <span className="flex items-center gap-2">
                {tabIcons.display}
                디스플레이
              </span>
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={tabClasses(activeTab === 'social')}
            >
              <span className="flex items-center gap-2">
                {tabIcons.social}
                소셜 링크
              </span>
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={tabClasses(activeTab === 'advanced')}
            >
              <span className="flex items-center gap-2">
                {tabIcons.advanced}
                고급 설정
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 설정 콘텐츠 */}
      <div className="max-w-[1100px] mx-auto px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white p-8"
        >
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">일반 설정</h2>
              <p className="text-gray-600 mb-6">사이트의 기본 정보를 설정합니다.</p>
              {getSettingsByTab().map(setting => (
                <div key={setting.key}>
                  {renderSettingInput(setting)}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">디스플레이 설정</h2>
              <p className="text-gray-600 mb-6">사이트의 모양과 레이아웃을 설정합니다.</p>
              {getSettingsByTab().map(setting => (
                <div key={setting.key}>
                  {renderSettingInput(setting)}
                </div>
              ))}
              
              {/* 테마 미리보기 */}
              <div className="mt-8 p-6 border border-gray-200 bg-gray-50">
                <h3 className="font-medium mb-4">테마 미리보기</h3>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-white border">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun size={20} />
                      <span className="font-medium">라이트 모드</span>
                    </div>
                    <div 
                      className="h-20 w-full"
                      style={{ backgroundColor: settings.find(s => s.key === 'theme_color')?.value }}
                    />
                  </div>
                  {settings.find(s => s.key === 'enable_dark_mode')?.value === 'true' && (
                    <div className="flex-1 p-4 bg-gray-900 text-white border">
                      <div className="flex items-center gap-2 mb-2">
                        <Moon size={20} />
                        <span className="font-medium">다크 모드</span>
                      </div>
                      <div 
                        className="h-20 w-full opacity-80"
                        style={{ backgroundColor: settings.find(s => s.key === 'theme_color')?.value }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">소셜 링크</h2>
              <p className="text-gray-600 mb-6">소셜 미디어 프로필 링크를 설정합니다.</p>
              {getSettingsByTab().map(setting => (
                <div key={setting.key} className="flex items-center gap-4">
                  <div className="flex-1">
                    {renderSettingInput(setting)}
                  </div>
                  {setting.value && (
                    <a 
                      href={setting.value} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      방문하기 →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">고급 설정</h2>
              <p className="text-gray-600 mb-6">분석 도구와 고급 기능을 설정합니다.</p>
              {getSettingsByTab().map(setting => (
                <div key={setting.key}>
                  {renderSettingInput(setting)}
                </div>
              ))}
              
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>주의:</strong> 고급 설정을 변경하면 사이트 성능에 영향을 줄 수 있습니다.
                  변경 사항을 적용하기 전에 충분히 테스트해주세요.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminSettingsPage