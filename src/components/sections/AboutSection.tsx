import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { StaggeredContainer, StaggeredItem } from '@/components/animations/StaggeredContainer';
import { detailItems } from '@/data';
import { useAdminStore } from '@/stores/adminStore';
import { EditableText } from '@/components/admin/EditableText';
import { useAdminContent } from '@/hooks/useAdminContent';

interface AboutSectionProps {
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ className = '' }) => {
  const { isAdminMode } = useAdminStore();
  const { content, updateContent } = useAdminContent('about_section');
  const { ref: titleRef, controls: titleControls } = useScrollAnimation({ threshold: 0.3 });
  const { ref: dividerRef, controls: dividerControls } = useScrollAnimation({ 
    threshold: 0.3, 
    delay: 400 
  });
  const { ref: descRef, controls: descControls } = useScrollAnimation({ 
    threshold: 0.3, 
    delay: 600 
  });
  
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

  const titleVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  const dividerVariants = {
    hidden: { opacity: 0, scaleX: 0 },
    visible: { 
      opacity: 1, 
      scaleX: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut'
      }
    }
  };


  return (
    <section id="about" className={`py-32 bg-gray-50 relative ${className}`}>
      <div className="max-w-[1100px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-32 items-start">
          {/* Left Details */}
          <div className="lg:col-span-1 pt-8">
            <StaggeredContainer 
              className="space-y-12"
              staggerDelay={0.15}
              threshold={0.3}
            >
              {detailItems.map((item, index) => (
                <StaggeredItem 
                  key={item.number}
                  animationType="fadeInLeft"
                >
                  <motion.div 
                    className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0"
                    whileHover={!isAdminMode ? { x: -8 } : {}}
                    transition={!isAdminMode ? { duration: 0.3 } : {}}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span className="font-mono text-sm text-gray-400 font-semibold">
                        <EditableText
                          value={getContentValue(`detail_${index}_number`) || item.number}
                          onSave={(value) => handleContentUpdate(`detail_${index}_number`, value)}
                          className="inline"
                        />
                      </span>
                      <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                        <EditableText
                          value={getContentValue(`detail_${index}_label`) || item.label}
                          onSave={(value) => handleContentUpdate(`detail_${index}_label`, value)}
                          className="inline"
                        />
                      </span>
                    </div>
                    <span className="text-xl font-semibold text-black leading-tight">
                      <EditableText
                        value={getContentValue(`detail_${index}_value`) || item.value}
                        onSave={(value) => handleContentUpdate(`detail_${index}_value`, value)}
                        className="inline"
                      />
                    </span>
                  </motion.div>
                </StaggeredItem>
              ))}
            </StaggeredContainer>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3 text-right">
            <motion.h2 
              ref={titleRef}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight text-black mb-12 text-right"
              style={{ fontFamily: 'Pretendard Variable, sans-serif' }}
              initial={!isAdminMode ? "hidden" : {}}
              animate={!isAdminMode ? titleControls : {}}
              variants={!isAdminMode ? titleVariants : {}}
            >
              <EditableText
                value={getContentValue('title_line1') || '생각이 끝나기 전에'}
                onSave={(value) => handleContentUpdate('title_line1', value)}
                className="inline"
              />
              <br />
              <motion.span
                className="relative inline-block cursor-pointer text-black"
                whileHover={!isAdminMode ? {
                  x: -5,
                  color: "#7C3AED",
                  transition: { duration: 0.3 }
                } : {}}
              >
                <EditableText
                  value={getContentValue('title_line2') || '프로토타입이'}
                  onSave={(value) => handleContentUpdate('title_line2', value)}
                  className="inline"
                />
                <br />
                <EditableText
                  value={getContentValue('title_line3') || '돌아갑니다'}
                  onSave={(value) => handleContentUpdate('title_line3', value)}
                  className="inline"
                />
              </motion.span>
            </motion.h2>

            <motion.div
              ref={dividerRef}
              className="w-16 h-0.5 bg-black mb-12 origin-right ml-auto"
              initial={!isAdminMode ? "hidden" : { opacity: 1, scaleX: 1 }}
              animate={!isAdminMode ? dividerControls : { opacity: 1, scaleX: 1 }}
              variants={!isAdminMode ? dividerVariants : {}}
            />

            <motion.div
              ref={descRef}
              className="space-y-6"
              initial={!isAdminMode ? "hidden" : { opacity: 1, y: 0 }}
              animate={!isAdminMode ? descControls : { opacity: 1, y: 0 }}
              variants={!isAdminMode ? descriptionVariants : {}}
            >
              <p className="text-xl leading-relaxed text-gray-600 text-right" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                <EditableText
                  value={getContentValue('description_line1') || '복잡한 일상을 단순하게, 반복되는 업무를 자동화로'}
                  onSave={(value) => handleContentUpdate('description_line1', value)}
                  className="inline"
                />
                <br />
                <span className="text-black font-semibold">
                  <EditableText
                    value={getContentValue('description_line2') || '당신의 시간을 더 가치있게 만듭니다.'}
                    onSave={(value) => handleContentUpdate('description_line2', value)}
                    className="inline"
                  />
                </span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background dot animation */}
      {!isAdminMode && (
        <div className="absolute top-[-15px] left-[-25px] w-1 h-1 bg-black rounded-full opacity-30">
          <motion.div
            className="w-1 h-1 bg-black rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
        </div>
      )}
    </section>
  );
};

export default AboutSection;