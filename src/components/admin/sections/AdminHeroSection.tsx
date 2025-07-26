import React from 'react'
import { EditableText } from '@/components/admin/EditableText'
import { useAdminContent } from '@/hooks/useAdminContent'

interface AdminHeroSectionProps {
  onTempSave: (section: string, field: string, value: any) => void
}

export const AdminHeroSection: React.FC<AdminHeroSectionProps> = ({ onTempSave }) => {
  const { content, updateContent } = useAdminContent('hero')

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
    <section className="relative h-screen flex items-center overflow-hidden bg-white">
      {/* Main Content - 홈페이지와 동일한 레이아웃, 애니메이션 제거 */}
      <div className="max-w-[1100px] mx-auto px-8 w-full relative z-10">
        <h1 
          className="font-black leading-[0.9] tracking-[-0.05em] mb-8"
          style={{ 
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: 'clamp(60px, 12vw, 160px)',
            fontWeight: 800
          }}
        >
          <EditableText
            value={getContentValue('title_line1') || 'CREATIVE'}
            onSave={(value) => handleContentUpdate('title_line1', value)}
            onTempSave={(value) => onTempSave('hero', 'title_line1', value)}
            className="block"
          />
          <br />
          <span
            className="relative inline-block"
            style={{
              WebkitTextStroke: '2px #0A0A0A',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            <EditableText
              value={getContentValue('title_line2') || 'NON-DEVELOPER'}
              onSave={(value) => handleContentUpdate('title_line2', value)}
              onTempSave={(value) => onTempSave('hero', 'title_line2', value)}
            />
          </span>
          <br />
          <EditableText
            value={getContentValue('title_line3') || '& DESIGNER'}
            onSave={(value) => handleContentUpdate('title_line3', value)}
            onTempSave={(value) => onTempSave('hero', 'title_line3', value)}
            className="block"
          />
        </h1>

        <p 
          className="text-gray-600 font-light mb-12"
          style={{ 
            fontFamily: 'Noto Sans KR, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 300
          }}
        >
          <EditableText
            value={getContentValue('subtitle') || '바이브코딩으로 만드는 디지털 경험'}
            onSave={(value) => handleContentUpdate('subtitle', value)}
            onTempSave={(value) => onTempSave('hero', 'subtitle', value)}
          />
        </p>

        <div>
          <div
            className="relative inline-flex items-center gap-4 text-white font-medium tracking-wide cursor-default"
            style={{
              padding: '1.5rem 3rem',
              background: '#0A0A0A',
              fontFamily: 'Pretendard Variable, sans-serif',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textDecoration: 'none'
            }}
            onClick={(e) => e.preventDefault()}
          >
            <EditableText
              value={getContentValue('cta_button') || '프로젝트 보기'}
              onSave={(value) => handleContentUpdate('cta_button', value)}
              onTempSave={(value) => onTempSave('hero', 'cta_button', value)}
              className="text-white"
            />
            <span className="relative z-10">→</span>
          </div>
        </div>
      </div>

      {/* Floating Elements - 편집 가능 */}
      <div
        className="absolute select-none"
        style={{
          top: '20%',
          right: '10%',
          fontFamily: 'Pretendard Variable, sans-serif',
          fontWeight: 200,
          fontSize: '0.875rem',
          letterSpacing: '0.1em',
          color: '#A3A3A3'
        }}
      >
        <EditableText
          value={getContentValue('floating_year') || '2025'}
          onSave={(value) => handleContentUpdate('floating_year', value)}
          onTempSave={(value) => onTempSave('hero', 'floating_year', value)}
        />
      </div>
      
      <div
        className="absolute select-none"
        style={{
          bottom: '30%',
          right: '25%',
          fontFamily: 'Pretendard Variable, sans-serif',
          fontWeight: 200,
          fontSize: '0.875rem',
          letterSpacing: '0.1em',
          color: '#A3A3A3'
        }}
      >
        <EditableText
          value={getContentValue('floating_location') || 'SEOUL'}
          onSave={(value) => handleContentUpdate('floating_location', value)}
          onTempSave={(value) => onTempSave('hero', 'floating_location', value)}
        />
      </div>
      
      <div
        className="absolute select-none"
        style={{
          top: '15%',
          left: '15%',
          fontFamily: 'Pretendard Variable, sans-serif',
          fontWeight: 200,
          fontSize: '0.875rem',
          letterSpacing: '0.1em',
          color: '#A3A3A3'
        }}
      >
        <EditableText
          value={getContentValue('floating_portfolio') || 'PORTFOLIO'}
          onSave={(value) => handleContentUpdate('floating_portfolio', value)}
          onTempSave={(value) => onTempSave('hero', 'floating_portfolio', value)}
        />
      </div>

      {/* Scroll Indicator - 편집 불가 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full relative">
          <div className="w-1 h-3 bg-gray-400 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2" />
        </div>
        <span className="text-sm text-gray-500 font-medium tracking-widest">SCROLL</span>
      </div>
    </section>
  )
}

export default AdminHeroSection