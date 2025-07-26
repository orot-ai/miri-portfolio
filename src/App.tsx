import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import CustomCursor from '@/components/ui/CustomCursor';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAdminStore } from '@/stores/adminStore';

// Lazy load pages
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const AdminProjectsPage = lazy(() => import('@/pages/AdminProjectsPage'));
const AdminProjectDetailPage = lazy(() => import('@/pages/AdminProjectDetailPage'));
const AdminSettingsPage = lazy(() => import('@/pages/AdminSettingsPage'));
const AdminMediaPage = lazy(() => import('@/pages/AdminMediaPage'));

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

const App: React.FC = () => {
  const { isAdminMode } = useAdminStore();
  
  useEffect(() => {
    if (isAdminMode) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
    
    return () => {
      document.body.classList.remove('admin-mode');
    };
  }, [isAdminMode]);
  
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Custom Cursor */}
        <CustomCursor />
        
        {/* Header */}
        <Header />
        
        {/* Routes */}
        <Suspense fallback={<SectionLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/:projectId" element={<ProjectDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><AdminProjectsPage /></ProtectedRoute>} />
            <Route path="/admin/project/:projectId" element={<ProtectedRoute><AdminProjectDetailPage /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
            <Route path="/admin/media" element={<ProtectedRoute><AdminMediaPage /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;