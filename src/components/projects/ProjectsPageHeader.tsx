import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { EditableText } from '@/components/admin/EditableText'
import { useAdminStore } from '@/stores/adminStore'
import { commonVariants, createSweepGradientStyle, sweepHoverEffect, sectionStyles, THEME_COLORS } from '@/utils/animations'

type TabType = 'vibe' | 'automation'

interface ProjectsPageHeaderProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  getContentValue: (field: string) => string
  handleContentUpdate: (field: string, value: string) => Promise<boolean>
}

const tabVariants = {
  inactive: { 
    backgroundColor: 'transparent',
    color: THEME_COLORS.gray[500]
  },
  active: { 
    backgroundColor: THEME_COLORS.black,
    color: THEME_COLORS.white
  }
}

export const ProjectsPageHeader: React.FC<ProjectsPageHeaderProps> = ({
  activeTab,
  onTabChange,
  getContentValue,
  handleContentUpdate
}) => {
  const navigate = useNavigate()
  const { isAdminMode } = useAdminStore()

  return (
    <div className={`${sectionStyles.container} pt-20 sm:pt-24 pb-4 sm:pb-6 px-4 sm:px-8`}>
      <motion.button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-600 hover:text-black transition-colors mb-6 sm:mb-8 group cursor-pointer"
        initial={!isAdminMode ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
        animate={!isAdminMode ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
        transition={!isAdminMode ? { duration: 0.6 } : {}}
      >
        <ArrowLeft size={18} className={!isAdminMode ? "group-hover:-translate-x-1 transition-transform" : ""} />
        <span style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>홈으로 돌아가기</span>
      </motion.button>

      <motion.div
        initial={!isAdminMode ? "hidden" : { opacity: 1 }}
        animate={!isAdminMode ? "visible" : { opacity: 1 }}
        variants={!isAdminMode ? commonVariants.fadeInUp : {}}
        className="text-center"
      >
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-black mb-3 sm:mb-4 cursor-default"
          style={{ fontFamily: 'Pretendard Variable, sans-serif' }}
          whileHover={!isAdminMode ? {
            scale: 1.02,
            color: THEME_COLORS.primary,
            transition: { duration: 0.3 }
          } : {}}
        >
          <EditableText
            value={getContentValue('page_title') || 'All Projects'}
            onSave={(value) => handleContentUpdate('page_title', value)}
            className="inline"
          />
        </motion.h1>
        
        <p 
          className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
        >
          <EditableText
            value={getContentValue('page_subtitle') || '바이브코딩과 자동화로 만들어낸 프로젝트들'}
            onSave={(value) => handleContentUpdate('page_subtitle', value)}
            className="inline"
          />
        </p>

        {/* 탭 네비게이션 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <motion.button
            onClick={() => onTabChange('vibe')}
            className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium relative overflow-hidden w-full sm:w-auto sm:min-w-[180px] md:min-w-[220px] transition-colors cursor-pointer ${
              activeTab === 'vibe' 
                ? 'shadow-md border border-gray-200' 
                : ''
            }`}
            variants={tabVariants}
            animate={activeTab === 'vibe' ? 'active' : 'inactive'}
            style={activeTab !== 'vibe' && !isAdminMode ? createSweepGradientStyle('transparent') : {}}
            whileHover={!isAdminMode ? (activeTab === 'vibe' ? 
              { scale: 1.02 } : 
              { 
                ...sweepHoverEffect.whileHover,
                color: THEME_COLORS.white
              }
            ) : {}}
            whileTap={!isAdminMode ? { scale: 0.98 } : {}}
          >
            바이브코딩 프로젝트
          </motion.button>
          
          <motion.button
            onClick={() => onTabChange('automation')}
            className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium relative overflow-hidden w-full sm:w-auto sm:min-w-[180px] md:min-w-[220px] transition-colors cursor-pointer ${
              activeTab === 'automation' 
                ? 'shadow-md border border-gray-200' 
                : ''
            }`}
            variants={tabVariants}
            animate={activeTab === 'automation' ? 'active' : 'inactive'}
            style={activeTab !== 'automation' && !isAdminMode ? createSweepGradientStyle('transparent') : {}}
            whileHover={!isAdminMode ? (activeTab === 'automation' ? 
              { scale: 1.02 } : 
              { 
                ...sweepHoverEffect.whileHover,
                color: THEME_COLORS.white
              }
            ) : {}}
            whileTap={!isAdminMode ? { scale: 0.98 } : {}}
          >
            자동화 프로젝트
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}