import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Heart } from 'lucide-react';
import { Project } from '@/types';
import { useAdminStore } from '@/stores/adminStore';
import { LazyImage } from './LazyImage';

interface ProjectCardProps {
  project: Project;
  className?: string;
  featured?: boolean;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ 
  project, 
  className = '',
  featured = false,
  onClick
}) => {
  const { isAdminMode } = useAdminStore();
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.1 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  const contentVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const tagVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.68, -0.55, 0.265, 1.55]
      }
    }
  };

  return (
    <motion.div
      className={`
        group ${!isAdminMode ? 'cursor-pointer' : ''}
        bg-white shadow-lg border border-gray-100 overflow-hidden
        ${!isAdminMode ? 'transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02]' : ''}
        ${featured ? 'row-span-2' : ''}
        ${className}
      `}
      variants={!isAdminMode ? cardVariants : {}}
      onClick={!isAdminMode ? onClick : undefined}
    >
      {/* Project Image */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {project.image_url ? (
          <LazyImage
            src={project.image_url}
            alt={project.title}
            className="w-full h-full"
            placeholder={project.title}
          />
        ) : (
          <motion.div 
            className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
            variants={imageVariants}
          >
            <Heart className="w-8 h-8 text-gray-300" />
          </motion.div>
        )}
        
        {/* Overlay with links */}
        {!isAdminMode && (
          <motion.div 
            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
          {project.url && (
            <motion.a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink size={20} className="text-black" />
            </motion.a>
          )}
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={20} className="text-black" />
            </motion.a>
          )}
          </motion.div>
        )}
      </div>

      {/* Project Info */}
      <motion.div 
        className="p-4 sm:p-5 md:p-6"
        variants={contentVariants}
      >
        <motion.h3 
          className={`text-base sm:text-lg md:text-xl font-bold text-black mb-1.5 sm:mb-2 line-clamp-2 ${!isAdminMode ? 'cursor-pointer' : ''}`}
          variants={!isAdminMode ? itemVariants : {}}
          whileHover={!isAdminMode ? {
            color: "#7C3AED",
            transition: { duration: 0.2 }
          } : {}}
        >
          {project.title}
        </motion.h3>
        
        <motion.p 
          className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 tracking-wide uppercase"
          variants={itemVariants}
        >
          {project.category}
        </motion.p>
        
        <motion.p 
          className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-3"
          variants={itemVariants}
        >
          {project.description_card || project.description}
        </motion.p>

        {/* Tags */}
        <motion.div 
          className="flex flex-wrap gap-1.5 sm:gap-2"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.3,
              }
            }
          }}
        >
          {(project.tags || project.tech_stack || []).slice(0, 4).map((tag, index) => (
            <motion.span
              key={tag}
              className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 ${!isAdminMode ? 'transition-colors group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 cursor-pointer' : ''}`}
              variants={!isAdminMode ? tagVariants : {}}
              whileHover={!isAdminMode ? {
                scale: 1.05,
                transition: { duration: 0.2 }
              } : {}}
              whileTap={!isAdminMode ? { scale: 0.95 } : {}}
            >
              {tag}
            </motion.span>
          ))}
          {(project.tags || project.tech_stack || []).length > 4 && (
            <motion.span
              className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-gray-500"
              variants={!isAdminMode ? tagVariants : {}}
            >
              +{(project.tags || project.tech_stack || []).length - 4}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;