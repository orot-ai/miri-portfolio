import React from 'react'
import { EditableText } from '@/components/admin/EditableText'
import { useAdminContent } from '@/hooks/useAdminContent'

// 기본값 (DB에 데이터가 없을 때만 사용)
const detailItemsDefault = [
  { number: '01', label: 'SPECIALTY', fallback: 'AI 기반 자동화' },
  { number: '02', label: 'EXPERIENCE', fallback: '바이브코딩 & 교육' },
  { number: '03', label: 'MISSION', fallback: '효율성 극대화' }
]

interface AdminAboutSectionProps {
  onTempSave: (section: string, field: string, value: any) => void
}

export const AdminAboutSection: React.FC<AdminAboutSectionProps> = ({ onTempSave }) => {
  const { content, updateContent } = useAdminContent('about')

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
    <section id="about" className="py-32 bg-gray-50 relative">
      <div className="max-w-[1100px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-32 items-start">
          {/* Left Details */}
          <div className="lg:col-span-1 pt-8">
            <div className="space-y-12">
              {detailItemsDefault.map((item) => (
                <div 
                  key={item.number}
                  className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-mono text-sm text-gray-400 font-semibold">
                      {item.number}
                    </span>
                    <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                      {item.label}
                    </span>
                  </div>
                  <EditableText
                    value={getContentValue(`detail_${item.number}`) || item.fallback}
                    onSave={(value) => handleContentUpdate(`detail_${item.number}`, value)}
                    onTempSave={(value) => onTempSave('about', `detail_${item.number}`, value)}
                    className="text-xl font-semibold text-black leading-tight"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3 text-right">
            <h2 
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight text-black mb-12 text-right"
              style={{ fontFamily: 'Pretendard Variable, sans-serif' }}
            >
              <EditableText
                value={getContentValue('main_title_line1') || '생각이 끝나기 전에'}
                onSave={(value) => handleContentUpdate('main_title_line1', value)}
                onTempSave={(value) => onTempSave('about', 'main_title_line1', value)}
                className="block"
              />
              <br />
              <span className="relative inline-block text-black">
                <EditableText
                  value={getContentValue('main_title_line2') || '프로토타입이'}
                  onSave={(value) => handleContentUpdate('main_title_line2', value)}
                  onTempSave={(value) => onTempSave('about', 'main_title_line2', value)}
                />
                <br />
                <EditableText
                  value={getContentValue('main_title_line3') || '돌아갑니다'}
                  onSave={(value) => handleContentUpdate('main_title_line3', value)}
                  onTempSave={(value) => onTempSave('about', 'main_title_line3', value)}
                />
              </span>
            </h2>

            <div className="w-16 h-0.5 bg-black mb-12 ml-auto" />

            <div className="space-y-6">
              <p className="text-xl leading-relaxed text-gray-600 text-right" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                <EditableText
                  value={getContentValue('description_line1') || '복잡한 일상을 단순하게, 반복되는 업무를 자동화로'}
                  onSave={(value) => handleContentUpdate('description_line1', value)}
                  onTempSave={(value) => onTempSave('about', 'description_line1', value)}
                />
                <br />
                <span className="text-black font-semibold">
                  <EditableText
                    value={getContentValue('description_line2') || '당신의 시간을 더 가치있게 만듭니다.'}
                    onSave={(value) => handleContentUpdate('description_line2', value)}
                    onTempSave={(value) => onTempSave('about', 'description_line2', value)}
                  />
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background dot - 편집 불가 */}
      <div className="absolute top-[-15px] left-[-25px] w-1 h-1 bg-black rounded-full opacity-30" />
    </section>
  )
}

export default AdminAboutSection