import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  showArrow?: boolean;
  disabled?: boolean;
}

const variants = {
  primary: 'bg-black text-white hover:bg-gray-800',
  outline: 'border-2 border-black text-black hover:bg-black hover:text-white',
  ghost: 'text-black hover:bg-gray-100',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  showArrow = false,
  disabled = false,
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-3 
    font-medium tracking-wide
    transition-all duration-300 ease-out
    hover:transform hover:-translate-y-1
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
  `;

  const combinedClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  const content = (
    <>
      {children}
      {showArrow && (
        <motion.div
          className="flex items-center"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight size={16} />
        </motion.div>
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={combinedClasses}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        aria-disabled={disabled}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {content}
    </motion.button>
  );
};

export default Button;