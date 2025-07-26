import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { StaggeredContainer, StaggeredItem } from '@/components/animations/StaggeredContainer';
import { processSteps } from '@/data';
import { commonVariants, hoverEffects, sectionStyles, THEME_COLORS } from '@/utils/animations';
import { useAdminStore } from '@/stores/adminStore';
import { EditableText } from '@/components/admin/EditableText';
import { useAdminContent } from '@/hooks/useAdminContent';
import { useContentHelpers } from '@/hooks/useContentHelpers';

interface WorkProcessSectionProps {
  className?: string;
}

export const WorkProcessSection: React.FC<WorkProcessSectionProps> = ({ className = '' }) => {
  const { isAdminMode } = useAdminStore();
  const { content, updateContent, refetch } = useAdminContent('work_section');
  const { getContentValue, handleContentUpdate } = useContentHelpers({ 
    content, 
    updateContent, 
    section: 'work_section',
    refetch 
  });
  const { ref: titleRef, controls: titleControls } = useScrollAnimation({ 
    threshold: 0.3,
    delay: 100
  });

  // 마커 전용 특수 애니메이션 (회전 효과 포함)
  const markerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0, 
      rotate: 180 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.68, -0.55, 0.265, 1.55]
      }
    }
  };

  return (
    <section id="work" className={`section-padding bg-white relative ${className}`}>
      <div className={sectionStyles.container}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Big Typography */}
          <div className="flex items-center justify-center lg:justify-start h-full">
            <motion.h2
              ref={titleRef}
              className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-left leading-none tracking-tighter cursor-default"
              initial={!isAdminMode ? "hidden" : { opacity: 1 }}
              animate={!isAdminMode ? titleControls : { opacity: 1 }}
              variants={!isAdminMode ? commonVariants.titleStagger : {}}
              whileHover={!isAdminMode ? {
                scale: 1.05,
                color: THEME_COLORS.primary,
                transition: { duration: 0.3 }
              } : {}}
            >
              <motion.div variants={!isAdminMode ? commonVariants.titleLine : {}}>
                <EditableText
                  value={getContentValue('title_line1') || 'MY'}
                  onSave={(value) => handleContentUpdate('title_line1', value)}
                  className="inline"
                />
              </motion.div>
              <motion.div variants={!isAdminMode ? commonVariants.titleLine : {}}>
                <EditableText
                  value={getContentValue('title_line2') || 'WORK'}
                  onSave={(value) => handleContentUpdate('title_line2', value)}
                  className="inline"
                />
              </motion.div>
            </motion.h2>
          </div>

          {/* Process Steps */}
          <div className="space-y-0">
            <StaggeredContainer 
              staggerDelay={0.2}
              threshold={0.3}
            >
              {processSteps.map((step, index) => (
                <StaggeredItem 
                  key={step.number}
                  className="grid grid-cols-[1fr_80px] gap-8 py-10 border-b border-gray-200 last:border-b-0 items-start text-right group cursor-pointer"
                  animationType={!isAdminMode ? "fadeInUp" : undefined}
                  whileHover={!isAdminMode ? {
                    backgroundColor: "rgba(124, 58, 237, 0.02)",
                    transition: { duration: 0.3 }
                  } : {}}
                >
                  {/* Step Content */}
                  <motion.div 
                    className="space-y-3 text-right"
                    initial={!isAdminMode ? { opacity: 0, x: 50 } : { opacity: 1, x: 0 }}
                    whileInView={!isAdminMode ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                    transition={!isAdminMode ? { duration: 0.6, delay: index * 0.1 } : {}}
                    viewport={!isAdminMode ? { once: true } : {}}
                  >
                    <motion.h4 
                      className="text-xl font-bold text-black text-right"
                      initial={!isAdminMode ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                      whileInView={!isAdminMode ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                      transition={!isAdminMode ? { duration: 0.6, delay: 0.2 + index * 0.1 } : {}}
                      viewport={!isAdminMode ? { once: true } : {}}
                      {...(!isAdminMode ? hoverEffects.colorPurple : {})}
                    >
                      <EditableText
                        value={getContentValue(`step_${index}_title`) || step.title}
                        onSave={(value) => handleContentUpdate(`step_${index}_title`, value)}
                        className="inline"
                      />
                    </motion.h4>
                    <motion.p 
                      className="text-gray-600 leading-relaxed text-right group-hover:text-gray-800 transition-colors"
                      initial={!isAdminMode ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                      whileInView={!isAdminMode ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                      transition={!isAdminMode ? { duration: 0.6, delay: 0.4 + index * 0.1 } : {}}
                      viewport={!isAdminMode ? { once: true } : {}}
                    >
                      <EditableText
                        value={getContentValue(`step_${index}_description`) || step.description}
                        onSave={(value) => handleContentUpdate(`step_${index}_description`, value)}
                        className="inline"
                      />
                    </motion.p>
                  </motion.div>

                  {/* Step Marker */}
                  <motion.div
                    className="flex items-center justify-center w-16 h-16 bg-black text-white font-bold text-lg rounded-lg ml-auto"
                    initial={!isAdminMode ? { opacity: 0, scale: 0, rotate: 180 } : { opacity: 1, scale: 1, rotate: 0 }}
                    whileInView={!isAdminMode ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 1, scale: 1, rotate: 0 }}
                    transition={!isAdminMode ? { 
                      duration: 0.8, 
                      delay: 0.6 + index * 0.1,
                      type: "spring",
                      bounce: 0.4
                    } : {}}
                    viewport={!isAdminMode ? { once: true } : {}}
                    {...(!isAdminMode ? hoverEffects.markerHover : {})}
                  >
                    <motion.span
                      initial={!isAdminMode ? { opacity: 0 } : { opacity: 1 }}
                      whileInView={!isAdminMode ? { opacity: 1 } : { opacity: 1 }}
                      transition={!isAdminMode ? { duration: 0.3, delay: 1 + index * 0.1 } : {}}
                      viewport={!isAdminMode ? { once: true } : {}}
                    >
                      <EditableText
                        value={getContentValue(`step_${index}_number`) || step.number}
                        onSave={(value) => handleContentUpdate(`step_${index}_number`, value)}
                        className="inline"
                      />
                    </motion.span>
                  </motion.div>
                </StaggeredItem>
              ))}
            </StaggeredContainer>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      {!isAdminMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 right-0 w-32 h-32 border border-gray-200 rounded-full"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-0 w-24 h-24 border border-gray-200 rounded-full"
            animate={{
              rotate: [360, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 8,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        </div>
      )}
    </section>
  );
};

export default WorkProcessSection;