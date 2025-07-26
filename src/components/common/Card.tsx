import React, { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface CardProps extends MotionProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const paddingMap = {
  none: '',
  small: 'p-4',
  medium: 'p-6',
  large: 'p-8'
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  clickable = false,
  onClick,
  padding = 'medium',
  ...motionProps
}) => {
  const baseClasses = `bg-white border border-gray-200 shadow-lg overflow-hidden ${paddingMap[padding]} ${className}`;
  const hoverClasses = hoverable ? 'hover:shadow-xl transition-all duration-300' : '';
  const clickableClasses = clickable ? 'cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses}`}
      onClick={onClick}
      whileHover={hoverable ? { y: -8 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};