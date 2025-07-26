import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MessageCircle, Users } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/Button';
import { useAdminStore } from '@/stores/adminStore';
import { EditableText } from '@/components/admin/EditableText';
import { useAdminContent } from '@/hooks/useAdminContent';

interface ContactSectionProps {
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ className = '' }) => {
  const { isAdminMode } = useAdminStore();
  const { content, updateContent } = useAdminContent('contact');
  const { ref: headerRef, controls: headerControls } = useScrollAnimation({ threshold: 0.3 });
  
  const getContentValue = (field: string) => {
    return content.find(item => item.field === field)?.content || '';
  }
  
  const getContentId = (field: string) => {
    return content.find(item => item.field === field)?.id || '';
  }
  
  const handleContentUpdate = async (field: string, newValue: string) => {
    const id = getContentId(field);
    if (id) {
      return await updateContent(id, newValue);
    }
    return false;
  }

  const headerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const contactLinks = [
    {
      label: getContentValue('email_label') || 'Email',
      value: getContentValue('email'),
      href: `mailto:${getContentValue('email')}`,
      icon: Mail,
      color: 'text-blue-600',
      key: 'email'
    },
    {
      label: getContentValue('threads_label') || 'Threads',
      value: getContentValue('threads_value') || '@miri.ad.saiz',
      href: getContentValue('threads'),
      icon: MessageSquare,
      color: 'text-gray-300',
      key: 'threads'
    },
    {
      label: getContentValue('opentalk_label') || 'OpenTalk',
      value: getContentValue('opentalk'),
      href: getContentValue('opentalk_link'),
      icon: MessageCircle,
      color: 'text-yellow-500',
      key: 'opentalk'
    },
    {
      label: getContentValue('kakao_label') || 'KakaoTalk',
      value: getContentValue('kakao'),
      href: getContentValue('kakao_link'),
      icon: Users,
      color: 'text-green-500',
      key: 'kakao'
    },
  ].filter(contact => contact.value && contact.href); // 데이터가 있는 항목만 표시

  return (
    <section id="contact" className={`section-padding bg-black text-white relative overflow-hidden ${className}`}>
      <div className="max-w-[1100px] mx-auto px-8">
        <motion.div
          ref={headerRef}
          className="text-center max-w-4xl mx-auto"
          initial="hidden"
          animate={headerControls}
          variants={headerVariants}
        >
          {/* Header */}
          <motion.p 
            className="text-sm font-medium tracking-widest text-gray-400 uppercase mb-6"
            variants={!isAdminMode ? itemVariants : {}}
          >
            <EditableText
              value={getContentValue('section_subtitle') || 'GET IN TOUCH'}
              onSave={(value) => handleContentUpdate('section_subtitle', value)}
              className={`inline ${isAdminMode ? 'cursor-pointer hover:bg-gray-800 hover:bg-opacity-50 px-2 py-1 rounded border-2 border-dashed border-transparent hover:border-gray-600' : ''}`}
            />
          </motion.p>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-8"
            variants={!isAdminMode ? itemVariants : {}}
          >
            <EditableText
              value={getContentValue('section_title') || '함께 만들어보세요'}
              onSave={(value) => handleContentUpdate('section_title', value)}
              className={`inline ${isAdminMode ? 'cursor-pointer hover:bg-gray-800 hover:bg-opacity-50 px-2 py-1 rounded border-2 border-dashed border-transparent hover:border-gray-600' : ''}`}
            />
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12"
            variants={!isAdminMode ? itemVariants : {}}
          >
            <EditableText
              value={getContentValue('description') || '새로운 프로젝트, 협업 제안, 또는 단순한 안녕 인사도 좋습니다.\n언제든 연락주세요!'}
              onSave={(value) => handleContentUpdate('description', value)}
              className={`inline whitespace-pre-line ${isAdminMode ? 'cursor-pointer hover:bg-gray-800 hover:bg-opacity-50 px-2 py-1 rounded border-2 border-dashed border-transparent hover:border-gray-600' : ''}`}
              multiline={true}
            />
          </motion.p>

          {/* Contact Methods */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.4,
                }
              }
            }}
          >
            {contactLinks.map((contact) => {
              const IconComponent = contact.icon;
              return (
                <motion.div
                  key={contact.label}
                  className={`group p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 transition-all duration-300 ${!isAdminMode ? 'cursor-pointer' : ''}`}
                  variants={!isAdminMode ? itemVariants : {}}
                  whileHover={!isAdminMode ? { 
                    scale: 1.02,
                    borderColor: "#7C3AED",
                    transition: { duration: 0.2 }
                  } : {}}
                  whileTap={!isAdminMode ? { scale: 0.98 } : {}}
                  onClick={!isAdminMode ? () => window.open(contact.href, contact.href.startsWith('http') ? '_blank' : '_self') : (e) => {
                    console.log('📧 Contact 카드 클릭 - 관리자 모드에서 무시됨');
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors ${contact.color}`}>
                      <IconComponent size={24} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm text-gray-400 font-medium">
                        <EditableText
                          value={contact.label}
                          onSave={(value) => handleContentUpdate(`${contact.key}_label`, value)}
                          className="inline"
                        />
                      </div>
                      <div className="text-white font-semibold">
                        <EditableText
                          value={contact.value}
                          onSave={(value) => handleContentUpdate(contact.key === 'email' ? 'email' : contact.key === 'threads' ? 'threads_value' : contact.key, value)}
                          className="inline"
                        />
                      </div>
                      {isAdminMode && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">링크 URL:</div>
                          <div className="text-xs text-blue-400 break-all">
                            <EditableText
                              value={contact.href}
                              onSave={(value) => handleContentUpdate(contact.key === 'email' ? 'email' : contact.key === 'opentalk' ? 'opentalk_link' : contact.key === 'kakao' ? 'kakao_link' : contact.key, value)}
                              className="inline text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Button - 조건부 렌더링 */}
          {(isAdminMode || getContentValue('cta_button')) && (
            <motion.div variants={!isAdminMode ? itemVariants : {}}>
              <Button
                variant="outline"
                size="lg"
                href={!isAdminMode ? `mailto:${getContentValue('email') || 'miri@orot-ai.com'}` : undefined}
                className="bg-transparent border-white text-white hover:!bg-white hover:!text-black transition-colors duration-300"
                onClick={isAdminMode ? (e: React.MouseEvent) => e.preventDefault() : undefined}
              >
                <EditableText
                  value={getContentValue('cta_button') || ''}
                  onSave={(value) => handleContentUpdate('cta_button', value)}
                  className={`inline ${isAdminMode ? 'cursor-pointer hover:bg-gray-800 hover:bg-opacity-50 px-2 py-1 rounded border-2 border-dashed border-transparent hover:border-gray-600' : ''}`}
                  placeholder="CTA 버튼 텍스트 (비어있으면 버튼 숨김)"
                />
              </Button>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div 
            className="mt-20 pt-12 border-t border-gray-800 text-center"
            variants={!isAdminMode ? itemVariants : {}}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <motion.p 
                className="text-gray-400 text-sm"
                whileHover={!isAdminMode ? { opacity: 0.8 } : {}}
              >
                <EditableText
                  value={getContentValue('footer_text') || '© 2025 MIRI. 바이브코딩으로 만든 포트폴리오'}
                  onSave={(value) => handleContentUpdate('footer_text', value)}
                  className={`inline ${isAdminMode ? 'cursor-pointer hover:bg-gray-800 hover:bg-opacity-50 px-2 py-1 rounded border-2 border-dashed border-transparent hover:border-gray-600' : ''}`}
                />
              </motion.p>
              
              <motion.div 
                className="flex items-center gap-6"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    }
                  }
                }}
              >
                {contactLinks.slice(0, 3).map((contact) => {
                  const IconComponent = contact.icon;
                  return (
                    <motion.a
                      key={contact.label}
                      href={contact.href}
                      target={contact.href.startsWith('http') ? '_blank' : undefined}
                      rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { 
                          opacity: 1, 
                          scale: 1,
                          transition: { duration: 0.4 }
                        }
                      }}
                      whileHover={{ 
                        scale: 1.2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconComponent size={20} />
                    </motion.a>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-900/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-blue-900/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: 2,
          }}
        />
      </div>
    </section>
  );
};

export default ContactSection;