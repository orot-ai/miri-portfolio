import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

const variantClasses = {
  default: 'bg-gray-600 hover:bg-gray-700 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white'
};

const sizeClasses = {
  small: 'p-1.5',
  medium: 'p-2',
  large: 'p-3'
};

const iconSizes = {
  small: 14,
  medium: 16,
  large: 20
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
  size = 'medium',
  disabled = false,
  className = ''
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={label}
      aria-label={label}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <Icon size={iconSizes[size]} />
    </motion.button>
  );
};