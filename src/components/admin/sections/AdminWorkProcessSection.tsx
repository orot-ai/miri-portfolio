import React from 'react'
import { EditableText } from '@/components/admin/EditableText'
import { useAdminContent } from '@/hooks/useAdminContent'

// 기본값 (DB에 데이터가 없을 때만 사용)
const processStepsDefault = [
  { 
    number: '01', 
    titleFallback: '기획 & 구조 설계', 
    descriptionFallback: '사용자 관점에서 시작해 전체 시스템을 설계합니다' 
  },
  { 
    number: '02', 
    titleFallback: '빠른 프로토타입', 
    descriptionFallback: '핵심 기능부터 구현하여 빠르게 검증합니다' 
  },
  { 
    number: '03', 
    titleFallback: '자동화 & 최적화', 
    descriptionFallback: '반복 작업을 자동화하고 시스템을 개선합니다' 
  },
  { 
    number: '04', 
    titleFallback: '결과물 완성', 
    descriptionFallback: '품질을 타협하지 않고 완성도 있게 마무리합니다' 
  }
]

interface AdminWorkProcessSectionProps {
  onTempSave: (section: string, field: string, value: any) => void
}

export const AdminWorkProcessSection: React.FC<AdminWorkProcessSectionProps> = ({ onTempSave }) => {
  const { content, updateContent } = useAdminContent('work_process')

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

  return (
    <section id="work" className="py-24 bg-white relative">
      <div className="max-w-[1100px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Big Typography */}
          <div className="flex items-center justify-center lg:justify-start h-full">
            <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-left leading-none tracking-tighter">
              <div>
                <EditableText
                  value={getContentValue('title_line1') || 'MY'}
                  onSave={(value) => handleContentUpdate('title_line1', value)}
                  onTempSave={(value) => onTempSave('work_process', 'title_line1', value)}
                />
              </div>
              <div>
                <EditableText
                  value={getContentValue('title_line2') || 'WORK'}
                  onSave={(value) => handleContentUpdate('title_line2', value)}
                  onTempSave={(value) => onTempSave('work_process', 'title_line2', value)}
                />
              </div>
            </h2>
          </div>

          {/* Process Steps */}
          <div className="space-y-0">
            {processStepsDefault.map((step) => (
              <div 
                key={step.number}
                className="grid grid-cols-[1fr_80px] gap-8 py-10 border-b border-gray-200 last:border-b-0 items-start text-right group"
              >
                {/* Step Content */}
                <div className="space-y-3 text-right">
                  <h4 className="text-xl font-bold text-black text-right">
                    <EditableText
                      value={getContentValue(`step${step.number}_title`) || step.titleFallback}
                      onSave={(value) => handleContentUpdate(`step${step.number}_title`, value)}
                      onTempSave={(value) => onTempSave('work_process', `step${step.number}_title`, value)}
                    />
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-right">
                    <EditableText
                      value={getContentValue(`step${step.number}_description`) || step.descriptionFallback}
                      onSave={(value) => handleContentUpdate(`step${step.number}_description`, value)}
                      onTempSave={(value) => onTempSave('work_process', `step${step.number}_description`, value)}
                      multiline
                    />
                  </p>
                </div>

                {/* Step Marker - 편집 불가 */}
                <div className="flex items-center justify-center w-16 h-16 bg-black text-white font-bold text-lg rounded-lg ml-auto">
                  <span>{step.number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Pattern - 편집 불가 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-32 h-32 border border-gray-200 rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-24 h-24 border border-gray-200 rounded-full" />
      </div>
    </section>
  )
}

export default AdminWorkProcessSection