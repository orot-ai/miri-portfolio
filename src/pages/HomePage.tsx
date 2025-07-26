import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import all sections
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import WorkProcessSection from '@/components/sections/WorkProcessSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';

// Loading component
const SectionLoader: React.FC = () => (
  <motion.div
    className="flex items-center justify-center py-20"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: 'linear',
        repeat: Infinity,
      }}
    />
  </motion.div>
);

const HomePage: React.FC = () => {
  return (
    <main className="relative">
      <AnimatePresence mode="wait">
        <Suspense fallback={<SectionLoader />}>
          {/* Hero Section */}
          <HeroSection />
          
          {/* About Section */}
          <AboutSection />
          
          {/* Work Process Section */}
          <WorkProcessSection />
          
          {/* Projects Section */}
          <ProjectsSection />
          
          {/* Contact Section */}
          <ContactSection />
        </Suspense>
      </AnimatePresence>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/30"
          animate={{
            opacity: [0.0, 0.3, 0.0],
          }}
          transition={{
            duration: 10,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
        
        {/* Animated background particles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-200 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </main>
  );
};

export default HomePage;