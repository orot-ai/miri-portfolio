import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useAdminStore } from '@/stores/adminStore';

interface StaggeredContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.1,
  threshold = 0.2,
}) => {
  const { isAdminMode } = useAdminStore();
  const { ref, controls } = useScrollAnimation({ threshold });

  const customContainerVariants = {
    ...containerVariants,
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={!isAdminMode ? "hidden" : { opacity: 1 }}
      animate={!isAdminMode ? controls : { opacity: 1 }}
      variants={!isAdminMode ? customContainerVariants : {}}
    >
      {children}
    </motion.div>
  );
};

interface StaggeredItemProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
}

const itemVariants = {
  hidden: {
    fadeInUp: { opacity: 0, y: 30 },
    fadeInLeft: { opacity: 0, x: -30 },
    fadeInRight: { opacity: 0, x: 30 },
    scaleIn: { opacity: 0, scale: 0.9 },
  },
  visible: {
    fadeInUp: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    fadeInLeft: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    fadeInRight: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    scaleIn: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
  },
};

export const StaggeredItem: React.FC<StaggeredItemProps & { whileHover?: any }> = ({
  children,
  className = '',
  animationType = 'fadeInUp',
  whileHover,
  ...props
}) => {
  const { isAdminMode } = useAdminStore();
  
  return (
    <motion.div
      className={className}
      variants={!isAdminMode ? {
        hidden: itemVariants.hidden[animationType],
        visible: itemVariants.visible[animationType],
      } : {}}
      whileHover={!isAdminMode ? whileHover : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default StaggeredContainer;