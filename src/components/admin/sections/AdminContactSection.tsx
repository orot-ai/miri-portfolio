import React from 'react'
import { Mail, MessageSquare, MessageCircle, Users } from 'lucide-react'
import { EditableText } from '@/components/admin/EditableText'
import { useAdminContent } from '@/hooks/useAdminContent'

interface AdminContactSectionProps {
  onTempSave: (section: string, field: string, value: any) => void
}

export const AdminContactSection: React.FC<AdminContactSectionProps> = ({ onTempSave }) => {
  const { content, updateContent } = useAdminContent('contact')

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

  const contactLinks = [
    {
      label: '이메일',
      value: getContentValue('email') || 'contact@miri.dev',
      href: `mailto:${getContentValue('email') || 'contact@miri.dev'}`,
      icon: Mail,
      color: 'text-blue-600',
      field: 'email'
    },
    {
      label: '쓰레드',
      value: getContentValue('threads') || '@miri_threads',
      href: `https://threads.net/${getContentValue('threads') || '@miri_threads'}`,
      icon: MessageSquare,
      color: 'text-gray-300',
      field: 'threads'
    },
    {
      label: '카카오톡',
      value: getContentValue('kakao') || '1:1 채팅',
      href: getContentValue('kakao_link') || 'https://pf.kakao.com/_example',
      icon: MessageCircle,
      color: 'text-yellow-500',
      field: 'kakao'
    },
    {
      label: '오픈톡방',
      value: getContentValue('opentalk') || '바이브코딩 커뮤니티',
      href: getContentValue('opentalk_link') || 'https://open.kakao.com/o/example',
      icon: Users,
      color: 'text-green-500',
      field: 'opentalk'
    },
  ]

  return (
    <section id="contact" className="py-24 bg-black text-white relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <p className="text-sm font-medium tracking-widest text-gray-400 uppercase mb-6">
            <EditableText
              value={getContentValue('section_subtitle') || 'GET IN TOUCH'}
              onSave={(value) => handleContentUpdate('section_subtitle', value)}
              onTempSave={(value) => onTempSave('contact', 'section_subtitle', value)}
              className="text-gray-400"
            />
          </p>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8">
            <EditableText
              value={getContentValue('section_title') || '함께 만들어보세요'}
              onSave={(value) => handleContentUpdate('section_title', value)}
              onTempSave={(value) => onTempSave('contact', 'section_title', value)}
              className="text-white"
            />
          </h2>
          
          <p className="text-xl text-gray-300 mb-16 leading-relaxed">
            <EditableText
              value={getContentValue('description') || '새로운 프로젝트, 협업 제안, 또는 단순한 안녕 인사도 좋습니다.\n언제든 연락주세요!'}
              onSave={(value) => handleContentUpdate('description', value)}
              onTempSave={(value) => onTempSave('contact', 'description', value)}
              className="text-gray-300"
              multiline
            />
          </p>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {contactLinks.map((contact) => {
              const Icon = contact.icon
              return (
                <div
                  key={contact.label}
                  className="group bg-gray-900 rounded-2xl p-8 border border-gray-800 cursor-default"
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-gray-800 ${contact.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-white">
                        {contact.label}
                      </h4>
                      <p className="text-gray-400">
                        <EditableText
                          value={contact.value}
                          onSave={(value) => handleContentUpdate(contact.field, value)}
                          onTempSave={(value) => onTempSave('contact', contact.field, value)}
                          className="text-gray-400"
                        />
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <span className="text-sm text-gray-500">
                      클릭하여 연결
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 pt-16 border-t border-gray-800">
            <p className="text-lg text-gray-400 mb-8">
              <EditableText
                value={getContentValue('cta_text') || '프로젝트 문의나 협업 제안이 있으시면 언제든 연락주세요.'}
                onSave={(value) => handleContentUpdate('cta_text', value)}
                onTempSave={(value) => onTempSave('contact', 'cta_text', value)}
                className="text-gray-400"
              />
            </p>
            
            <div
              className="inline-flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-lg font-medium cursor-default"
              onClick={(e) => e.preventDefault()}
            >
              <Mail size={20} />
              <EditableText
                value={getContentValue('cta_button') || '프로젝트 문의하기'}
                onSave={(value) => handleContentUpdate('cta_button', value)}
                onTempSave={(value) => onTempSave('contact', 'cta_button', value)}
                className="text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration - 편집 불가 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full opacity-5 blur-3xl" />
      </div>
    </section>
  )
}

export default AdminContactSection