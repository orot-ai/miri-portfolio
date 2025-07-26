import React from 'react'
import { EditableText } from '@/components/admin/EditableText'
import { useAdminContent } from '@/hooks/useAdminContent'
import { useAdminProjects } from '@/hooks/useAdminProjects'

interface AdminProjectsSectionProps {
  onTempSave: (section: string, field: string, value: any) => void
}

export const AdminProjectsSection: React.FC<AdminProjectsSectionProps> = ({ onTempSave }) => {
  const { content, updateContent } = useAdminContent('projects')
  const { projects } = useAdminProjects()

  const getContentValue = (field: string) => {
    return content.find(item => item.field === field)?.content || ''
  }

  const getContentId = (field: string) => {
    return content.find(item => item.field === field)?.id || ''
  }

  const handleContentUpdate = async (field: string, newValue: string) => {
    const id = getContentId(field)
    if (id) {
      return await updateContent(id, newValue)
    }
    return false
  }

  const vibeProjects = projects.filter(p => p.category === 'vibe')
  const automationProjects = projects.filter(p => p.category === 'automation')

  return (
    <section id="projects" className="py-24 bg-gray-50 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-[1100px] mx-auto px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest text-gray-500 uppercase mb-4">
            <EditableText
              value={getContentValue('section_subtitle') || 'SELECTED WORKS'}
              onSave={(value) => handleContentUpdate('section_subtitle', value)}
              onTempSave={(value) => onTempSave('projects', 'section_subtitle', value)}
            />
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black">
            <EditableText
              value={getContentValue('section_title') || 'Projects'}
              onSave={(value) => handleContentUpdate('section_title', value)}
              onTempSave={(value) => onTempSave('projects', 'section_title', value)}
            />
          </h2>
        </div>
      </div>

      {/* 프로젝트 카드들 */}
      <div className="space-y-8 mb-16 overflow-visible">
        {/* 바이브코딩 프로젝트 */}
        <div className="w-full">
          <div className="flex justify-start">
            <div className="w-[85%] max-w-[1400px] h-[280px] -ml-[5%] relative overflow-hidden bg-black cursor-default" onClick={(e) => e.preventDefault()}>
              <div className="h-full p-16 flex flex-col justify-center text-right">
                <h3 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8">
                  <EditableText
                    value={getContentValue('vibe_title') || 'VIBE CODING'}
                    onSave={(value) => handleContentUpdate('vibe_title', value)}
                    onTempSave={(value) => onTempSave('projects', 'vibe_title', value)}
                    className="text-white"
                  />
                </h3>
                <p className="text-2xl text-gray-400">
                  <EditableText
                    value={getContentValue('vibe_subtitle') || '생각이 끝나기 전에 프로토타입이 돌아가는 바이브코딩'}
                    onSave={(value) => handleContentUpdate('vibe_subtitle', value)}
                    onTempSave={(value) => onTempSave('projects', 'vibe_subtitle', value)}
                    className="text-gray-400"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 자동화 프로젝트 */}
        <div className="w-full">
          <div className="flex justify-end">
            <div className="w-[85%] max-w-[1400px] h-[280px] -mr-[5%] relative overflow-hidden bg-black cursor-default" onClick={(e) => e.preventDefault()}>
              <div className="h-full p-16 flex flex-col justify-center text-left">
                <h3 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8">
                  <EditableText
                    value={getContentValue('automation_title') || 'AUTOMATION'}
                    onSave={(value) => handleContentUpdate('automation_title', value)}
                    onTempSave={(value) => onTempSave('projects', 'automation_title', value)}
                    className="text-white"
                  />
                </h3>
                <p className="text-2xl text-gray-400">
                  <EditableText
                    value={getContentValue('automation_subtitle') || '반복 작업을 자동화하여 시간을 아끼는 시스템'}
                    onSave={(value) => handleContentUpdate('automation_subtitle', value)}
                    onTempSave={(value) => onTempSave('projects', 'automation_subtitle', value)}
                    className="text-gray-400"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 개별 프로젝트 미리보기 (편집 가능) */}
      <div className="max-w-[1100px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 바이브코딩 프로젝트들 */}
          <div>
            <h4 className="text-xl font-bold mb-4">바이브코딩 프로젝트</h4>
            {vibeProjects.slice(0, 2).map(project => (
              <div key={project.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <EditableText
                  value={project.title}
                  onSave={async () => {
                    // 프로젝트 업데이트 로직 필요
                    return true
                  }}
                  className="text-lg font-semibold mb-2"
                />
                <EditableText
                  value={project.description || ''}
                  onSave={async () => {
                    // 프로젝트 업데이트 로직 필요
                    return true
                  }}
                  className="text-gray-600"
                  multiline
                />
              </div>
            ))}
          </div>

          {/* 자동화 프로젝트들 */}
          <div>
            <h4 className="text-xl font-bold mb-4">자동화 프로젝트</h4>
            {automationProjects.slice(0, 2).map(project => (
              <div key={project.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <EditableText
                  value={project.title}
                  onSave={async () => {
                    // 프로젝트 업데이트 로직 필요
                    return true
                  }}
                  className="text-lg font-semibold mb-2"
                />
                <EditableText
                  value={project.description || ''}
                  onSave={async () => {
                    // 프로젝트 업데이트 로직 필요
                    return true
                  }}
                  className="text-gray-600"
                  multiline
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminProjectsSection