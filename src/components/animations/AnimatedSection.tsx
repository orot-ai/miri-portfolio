import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { AnimationType } from '@/types';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animationType?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
}

const animationVariants = {
  hidden: {
    fadeInUp: { opacity: 0, y: 50 },
    fadeInLeft: { opacity: 0, x: -60 },
    fadeInRight: { opacity: 0, x: 60 },
    slideInLeft: { opacity: 0, x: -100 },
    slideInRight: { opacity: 0, x: 100 },
    scaleIn: { opacity: 0, scale: 0.8 },
    rotateIn: { opacity: 0, rotate: -10, scale: 0.9 },
    bounceIn: { opacity: 0, scale: 0.7 },
  },
  visible: {
    fadeInUp: { opacity: 1, y: 0 },
    fadeInLeft: { opacity: 1, x: 0 },
    fadeInRight: { opacity: 1, x: 0 },
    slideInLeft: { opacity: 1, x: 0 },
    slideInRight: { opacity: 1, x: 0 },
    scaleIn: { opacity: 1, scale: 1 },
    rotateIn: { opacity: 1, rotate: 0, scale: 1 },
    bounceIn: { opacity: 1, scale: 1 },
  },
};

const transitionConfigs = {
  fadeInUp: { duration: 0.8, ease: 'easeOut' },
  fadeInLeft: { duration: 0.8, ease: 'easeOut' },
  fadeInRight: { duration: 0.8, ease: 'easeOut' },
  slideInLeft: { duration: 0.8, ease: 'easeOut' },
  slideInRight: { duration: 0.8, ease: 'easeOut' },
  scaleIn: { duration: 0.8, ease: 'easeOut' },
  rotateIn: { duration: 0.8, ease: 'easeOut' },
  bounceIn: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] },
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animationType = 'fadeInUp',
  delay = 0,
  duration,
  threshold = 0.2,
}) => {
  const { ref, controls } = useScrollAnimation({ threshold, delay });

  const customTransition = duration 
    ? { ...transitionConfigs[animationType], duration }
    : transitionConfigs[animationType];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: animationVariants.hidden[animationType],
        visible: animationVariants.visible[animationType],
      }}
      transition={customTransition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;