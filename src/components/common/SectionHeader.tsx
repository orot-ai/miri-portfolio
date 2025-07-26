import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { commonVariants } from '@/utils/animations';
import { EditableText } from '@/components/admin/EditableText';
import { useAdminStore } from '@/stores/adminStore';

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
  onSubtitleSave?: (value: string) => Promise<boolean>;
  onTitleSave?: (value: string) => Promise<boolean>;
  onDescriptionSave?: (value: string) => Promise<boolean>;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  subtitle,
  title,
  description,
  centered = true,
  onSubtitleSave,
  onTitleSave,
  onDescriptionSave,
  className = ''
}) => {
  const { isAdminMode } = useAdminStore();
  const { ref, controls } = useScrollAnimation({ threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      className={`${centered ? 'text-center' : ''} ${className}`}
      initial={!isAdminMode ? "hidden" : { opacity: 1 }}
      animate={!isAdminMode ? controls : { opacity: 1 }}
      variants={!isAdminMode ? commonVariants.staggerContainer : {}}
    >
      {subtitle && (
        <motion.p 
          className="text-sm font-medium tracking-widest text-gray-500 uppercase mb-4"
          variants={!isAdminMode ? commonVariants.fadeInUp : {}}
        >
          {onSubtitleSave ? (
            <EditableText
              value={subtitle}
              onSave={onSubtitleSave}
              className="inline"
            />
          ) : (
            subtitle
          )}
        </motion.p>
      )}

      <motion.h2 
        className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6"
        variants={!isAdminMode ? commonVariants.fadeInUp : {}}
      >
        {onTitleSave ? (
          <EditableText
            value={title}
            onSave={onTitleSave}
            className="inline"
          />
        ) : (
          title
        )}
      </motion.h2>

      {description && (
        <motion.p 
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          variants={!isAdminMode ? commonVariants.fadeInUp : {}}
        >
          {onDescriptionSave ? (
            <EditableText
              value={description}
              onSave={onDescriptionSave}
              className="inline"
              multiline
            />
          ) : (
            description
          )}
        </motion.p>
      )}
    </motion.div>
  );
};