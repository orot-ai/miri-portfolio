import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { sectionStyles } from '@/utils/animations';

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  backgroundColor?: 'white' | 'gray' | 'black';
  children: ReactNode;
  animate?: boolean;
  delay?: number;
}

const bgColorMap = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  black: 'bg-black'
};

export const Section: React.FC<SectionProps> = ({
  id,
  className = '',
  containerClassName = '',
  backgroundColor = 'white',
  children,
  animate = true,
  delay = 0
}) => {
  const { ref, controls } = useScrollAnimation({ threshold: 0.2, delay });

  const sectionContent = (
    <div className={`${sectionStyles.container} ${containerClassName}`}>
      {children}
    </div>
  );

  return (
    <section
      id={id}
      className={`section-padding ${bgColorMap[backgroundColor]} ${className}`}
    >
      {animate ? (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={controls}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {sectionContent}
        </motion.div>
      ) : (
        sectionContent
      )}
    </section>
  );
};