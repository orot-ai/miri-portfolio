import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { commonVariants, createSweepGradientStyle, sweepHoverEffect, sectionStyles, THEME_COLORS } from '@/utils/animations';
import { useAdminStore } from '@/stores/adminStore';
import { EditableText } from '@/components/admin/EditableText';
import { useAdminContent } from '@/hooks/useAdminContent';
import { useContentHelpers } from '@/hooks/useContentHelpers';

interface ProjectsSectionProps {
  className?: string;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ className = '' }) => {
  const { isAdminMode } = useAdminStore();
  const { content, updateContent, refetch } = useAdminContent('projects_section');
  const { getContentValue, handleContentUpdate } = useContentHelpers({ 
    content, 
    updateContent, 
    section: 'projects_section',
    refetch 
  });
  const { ref: headerRef, controls: headerControls } = useScrollAnimation({ threshold: 0.2 });
  const navigate = useNavigate();

  // 헤더용 커스텀 스케일 애니메이션 (기존 디자인 유지)
  const titleVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.68, -0.55, 0.265, 1.55]
      }
    }
  };

  return (
    <section id="projects" className={`section-padding bg-gray-50 overflow-hidden ${className}`}>
      {/* Section Header - 여전히 중앙 정렬 */}
      <div className={sectionStyles.container}>
        <motion.div
          ref={headerRef}
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={!isAdminMode ? "hidden" : { opacity: 1 }}
          animate={!isAdminMode ? headerControls : { opacity: 1 }}
          variants={!isAdminMode ? commonVariants.staggerContainer : {}}
        >
          <motion.p 
            className="text-xs sm:text-sm font-medium tracking-widest text-gray-500 uppercase mb-3 sm:mb-4"
            variants={!isAdminMode ? commonVariants.fadeInUp : {}}
          >
            <EditableText
              value={getContentValue('section_subtitle') || 'SELECTED WORKS'}
              onSave={(value) => handleContentUpdate('section_subtitle', value)}
              className="inline"
            />
          </motion.p>
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black"
            variants={!isAdminMode ? titleVariants : {}}
          >
            <EditableText
              value={getContentValue('section_title') || 'Projects'}
              onSave={(value) => handleContentUpdate('section_title', value)}
              className="inline"
            />
          </motion.h2>
        </motion.div>
      </div>

      {/* 프로젝트 카드들 - 전체 너비 사용 */}
      <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16 overflow-hidden sm:overflow-visible">
        {/* 바이브코딩 프로젝트 - 왼쪽 정렬 */}
        <motion.div
          className="w-full"
          initial={!isAdminMode ? { opacity: 0, x: -100 } : { opacity: 1, x: 0 }}
          whileInView={!isAdminMode ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
          transition={!isAdminMode ? { duration: 0.8, ease: 'easeOut' } : {}}
          viewport={!isAdminMode ? { once: true } : {}}
        >
          <div className="flex justify-start">
            <motion.div 
              className="w-full sm:w-[90%] md:w-[85%] max-w-[1400px] h-[160px] sm:h-[200px] md:h-[240px] lg:h-[280px] cursor-pointer sm:-ml-[5%] relative overflow-hidden"
              style={createSweepGradientStyle()}
              whileHover={!isAdminMode ? { 
                x: window.innerWidth > 640 ? 40 : 0, 
                scale: window.innerWidth > 640 ? 1.02 : 1,
                ...sweepHoverEffect.whileHover
              } : {}}
              onClick={() => navigate('/projects?tab=vibe')}
            >
              {/* 콘텐츠 영역 - 카드 안에 배치 */}
              <div className="h-full px-6 sm:px-12 md:px-16 lg:pl-24 lg:pr-16 py-8 sm:py-12 md:py-16 flex flex-col justify-center text-left sm:text-right">
                <motion.h3 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-white mb-3 sm:mb-4 md:mb-6 lg:mb-8"
                  whileHover={!isAdminMode ? { 
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  } : {}}
                >
                  <EditableText
                    value={getContentValue('vibe_title') || 'VIBE CODING'}
                    onSave={(value) => handleContentUpdate('vibe_title', value)}
                    className="inline"
                  />
                </motion.h3>
                <motion.p 
                  className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-400 line-clamp-2 sm:line-clamp-none"
                  whileHover={!isAdminMode ? { 
                    color: THEME_COLORS.gray[300],
                    y: -5,
                    transition: { duration: 0.2 }
                  } : {}}
                >
                  <EditableText
                    value={getContentValue('vibe_subtitle') || '생각이 끝나기 전에 프로토타입이 돌아가는 바이브코딩'}
                    onSave={(value) => handleContentUpdate('vibe_subtitle', value)}
                    className="inline"
                  />
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 자동화 프로젝트 - 오른쪽 정렬 */}
        <motion.div
          className="w-full"
          initial={!isAdminMode ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
          whileInView={!isAdminMode ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
          transition={!isAdminMode ? { duration: 0.8, ease: 'easeOut' } : {}}
          viewport={!isAdminMode ? { once: true } : {}}
        >
          <div className="flex justify-end">
            <motion.div 
              className="w-full sm:w-[90%] md:w-[85%] max-w-[1400px] h-[160px] sm:h-[200px] md:h-[240px] lg:h-[280px] cursor-pointer sm:-mr-[5%] relative overflow-hidden"
              style={createSweepGradientStyle()}
              whileHover={!isAdminMode ? { 
                x: window.innerWidth > 640 ? -40 : 0, 
                scale: window.innerWidth > 640 ? 1.02 : 1,
                ...sweepHoverEffect.whileHover
              } : {}}
              onClick={() => navigate('/projects?tab=automation')}
            >
              {/* 콘텐츠 영역 - 카드 안에 배치 */}
              <div className="h-full px-6 sm:px-12 md:px-16 py-8 sm:py-12 md:py-16 flex flex-col justify-center text-left">
                <motion.h3 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-white mb-3 sm:mb-4 md:mb-6 lg:mb-8"
                  whileHover={!isAdminMode ? { 
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  } : {}}
                >
                  <EditableText
                    value={getContentValue('automation_title') || 'AUTOMATION'}
                    onSave={(value) => handleContentUpdate('automation_title', value)}
                    className="inline"
                  />
                </motion.h3>
                <motion.p 
                  className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-400 line-clamp-2 sm:line-clamp-none"
                  whileHover={!isAdminMode ? { 
                    color: THEME_COLORS.gray[300],
                    y: -5,
                    transition: { duration: 0.2 }
                  } : {}}
                >
                  <EditableText
                    value={getContentValue('automation_subtitle') || '반복 작업을 자동화하여 시간을 아끼는 시스템'}
                    onSave={(value) => handleContentUpdate('automation_subtitle', value)}
                    className="inline"
                  />
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 프로젝트 더 보기 버튼 */}
      <div className={sectionStyles.container}>
        <motion.div
          className="text-center mt-8 sm:mt-10 md:mt-12"
          initial={!isAdminMode ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          whileInView={!isAdminMode ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={!isAdminMode ? { duration: 0.6, delay: 0.4 } : {}}
          viewport={!isAdminMode ? { once: true } : {}}
        >
          <motion.button
            onClick={() => navigate('/projects')}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors relative overflow-hidden"
            style={createSweepGradientStyle()}
            whileHover={!isAdminMode ? { 
              scale: 1.05,
              ...sweepHoverEffect.whileHover
            } : {}}
            whileTap={!isAdminMode ? { scale: 0.95 } : {}}
          >
            프로젝트 보러가기
          </motion.button>
        </motion.div>
      </div>

      {/* Background Decoration - Hide on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <motion.div
          className="absolute top-20 right-10 w-2 h-2 bg-gray-300 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-10 w-3 h-3 bg-gray-200 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: 1,
          }}
        />
      </div>
    </section>
  );
};

export default ProjectsSection;