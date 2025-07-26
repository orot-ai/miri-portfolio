import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminStore } from '@/stores/adminStore';
import { EditableText } from '@/components/admin/EditableText';
import { useAdminContent } from '@/hooks/useAdminContent';
import { useContentHelpers } from '@/hooks/useContentHelpers';

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAdminMode } = useAdminStore();
  const { content, updateContent } = useAdminContent('hero_section');
  const { getContentValue, handleContentUpdate } = useContentHelpers({ content, updateContent });

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.4
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.7
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.68, -0.55, 0.265, 1.55],
        delay: 1.0
      }
    }
  };

  const floatingVariants = {
    left: {
      hidden: { opacity: 0, x: -100 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.2
        }
      }
    },
    right: {
      hidden: { opacity: 0, x: 100 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.4
        }
      }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -45, scale: 0.8 },
      visible: { 
        opacity: 1, 
        rotate: 0, 
        scale: 1,
        transition: {
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.6
        }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.8
        }
      }
    }
  };

  const scrollIndicatorVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 1.8
      }
    }
  };

  const outlineTextVariants = {
    hidden: {},
    visible: {},
    hover: {
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section className={`relative h-screen flex items-center overflow-hidden bg-white ${className}`}>
      {/* Main Content - 왼쪽 정렬, 기존 HTML과 동일 */}
      <div className="max-w-[1100px] mx-auto px-8 w-full relative z-10">
        <motion.h1 
          className="font-black leading-[0.9] tracking-[-0.05em] mb-8"
          style={{ 
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: 'clamp(60px, 12vw, 160px)',
            fontWeight: 800
          }}
          initial={!isAdminMode ? "hidden" : { opacity: 1, y: 0 }}
          animate={!isAdminMode && isLoaded ? "visible" : { opacity: 1, y: 0 }}
          variants={!isAdminMode ? titleVariants : {}}
        >
          <EditableText
            value={getContentValue('title_line1') || 'CREATIVE'}
            onSave={(value) => handleContentUpdate('title_line1', value)}
            className="inline"
          />
          <br />
          <motion.span
            className="relative inline-block cursor-pointer"
            style={{
              WebkitTextStroke: '2px #0A0A0A',
              WebkitTextFillColor: 'transparent',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'inline-block'
            }}
            onMouseEnter={!isAdminMode ? (e) => {
              e.currentTarget.style.webkitTextFillColor = '#0A0A0A';
              e.currentTarget.style.transform = 'translateX(10px)';
            } : undefined}
            onMouseLeave={!isAdminMode ? (e) => {
              e.currentTarget.style.webkitTextFillColor = 'transparent';
              e.currentTarget.style.transform = 'translateX(0px)';
            } : undefined}
          >
            <EditableText
              value={getContentValue('title_line2') || 'NON-DEVELOPER'}
              onSave={(value) => handleContentUpdate('title_line2', value)}
              className="inline"
            />
          </motion.span>
          <br />
          <EditableText
            value={getContentValue('title_line3') || '& DESIGNER'}
            onSave={(value) => handleContentUpdate('title_line3', value)}
            className="inline"
          />
        </motion.h1>

        <motion.p 
          className="text-gray-600 font-light mb-12"
          style={{ 
            fontFamily: 'Noto Sans KR, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 300
          }}
          initial={!isAdminMode ? "hidden" : { opacity: 1, y: 0 }}
          animate={!isAdminMode && isLoaded ? "visible" : { opacity: 1, y: 0 }}
          variants={!isAdminMode ? subtitleVariants : {}}
        >
          <EditableText
            value={getContentValue('subtitle') || '바이브코딩으로 만드는 디지털 경험'}
            onSave={(value) => handleContentUpdate('subtitle', value)}
            className="inline"
          />
        </motion.p>

        <motion.div
          initial={!isAdminMode ? "hidden" : { opacity: 1, scale: 1 }}
          animate={!isAdminMode && isLoaded ? "visible" : { opacity: 1, scale: 1 }}
          variants={!isAdminMode ? buttonVariants : {}}
        >
          <motion.a
            href={!isAdminMode ? "#projects" : undefined}
            className="cta-button relative inline-flex items-center gap-4 text-white font-medium tracking-wide overflow-hidden"
            style={{
              padding: '1.5rem 3rem',
              background: '#0A0A0A',
              fontFamily: 'Pretendard Variable, sans-serif',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textDecoration: 'none',
              transition: !isAdminMode ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              cursor: !isAdminMode ? 'pointer' : 'default'
            }}
            onClick={isAdminMode ? (e) => e.preventDefault() : undefined}
          >
            {/* Background sliding effect */}
            <div 
              className="absolute top-0 left-0 w-full h-full bg-purple-600 transition-transform duration-300 ease-out"
              style={{
                background: '#7C3AED',
                transform: 'translateX(-100%)',
              }}
            />
            
            {/* Text content */}
            <span className="relative z-10">
              <EditableText
                value={getContentValue('cta_button') || '프로젝트 보기'}
                onSave={(value) => handleContentUpdate('cta_button', value)}
                className="inline"
              />
            </span>
            <span className="cta-arrow relative z-10 transition-transform duration-300">
              →
            </span>
          </motion.a>
        </motion.div>
      </div>

      {/* Floating Elements - 기존 HTML과 동일한 위치와 스타일 */}
      <motion.div
        className="absolute select-none pointer-events-none"
        style={{
          top: '20%',
          right: '10%',
          fontFamily: 'Pretendard Variable, sans-serif',
          fontWeight: 200,
          fontSize: '0.875rem',
          letterSpacing: '0.1em',
          color: '#A3A3A3'
        }}
        initial={!isAdminMode ? "hidden" : {}}
        animate={!isAdminMode && isLoaded ? "visible" : {}}
        variants={!isAdminMode ? floatingVariants.left : {}}
      >
        <EditableText
          value={getContentValue('floating_text1') || '2025'}
          onSave={(value) => handleContentUpdate('floating_text1', value)}
          className="inline"
        />
      </motion.div>
      
      <motion.div
        className="absolute select-none pointer-events-none"
        style={{
          bottom: '30%',
          right: '25%',
          fontFamily: 'Pretendard Variable, sans-serif',
          fontWeight: 200,
          fontSize: '0.875rem',
          letterSpacing: '0.1em',
          color: '#A3A3A3'
        }}
        initial={!isAdminMode ? "hidden" : {}}
        animate={!isAdminMode && isLoaded ? "visible" : {}}
        variants={!isAdminMode ? floatingVariants.right : {}}
      >
        <EditableText
          value={getContentValue('floating_text2') || 'SEOUL'}
          onSave={(value) => handleContentUpdate('floating_text2', value)}
          className="inline"
        />
      </motion.div>
      
      <motion.div
        className="absolute select-none pointer-events-none"
        style={{
          top: '15%',
          left: '15%',
          fontFamily: 'Pretendard Variable, sans-serif',
          fontWeight: 200,
          fontSize: '0.875rem',
          letterSpacing: '0.1em',
          color: '#A3A3A3'
        }}
        initial={!isAdminMode ? "hidden" : {}}
        animate={!isAdminMode && isLoaded ? "visible" : {}}
        variants={!isAdminMode ? floatingVariants.rotate : {}}
      >
        <EditableText
          value={getContentValue('floating_text3') || 'PORTFOLIO'}
          onSave={(value) => handleContentUpdate('floating_text3', value)}
          className="inline"
        />
      </motion.div>

      {/* Scroll Indicator - 기존과 동일한 스타일 */}
      {!isAdminMode && (
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4"
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={scrollIndicatorVariants}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full relative">
            <motion.div
              className="w-1 h-3 bg-gray-400 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
          </div>
          <span className="text-sm text-gray-500 font-medium tracking-widest">SCROLL</span>
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;