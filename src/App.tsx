import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from '@/components/layout/Header';
import CustomCursor from '@/components/ui/CustomCursor';
import { useAdminStore } from '@/stores/adminStore';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load pages
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'));

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
  
  // Analytics 설정 - Vercel 프로덕션에서 자동 활성화
  const isProduction = import.meta.env.PROD;
  const excludeAdminPages = true; // 관리자 페이지는 항상 제외
  
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
    <ErrorBoundary>
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
            </Routes>
          </Suspense>
          
          {/* Vercel Analytics & Speed Insights */}
          <Analytics 
            beforeSend={(event) => {
              // 관리자 페이지는 추적하지 않음
              if (event.url?.includes('/admin')) {
                return null;
              }
              return event;
            }}
          />
          <SpeedInsights 
            beforeSend={(event) => {
              // 관리자 페이지 성능 데이터 제외
              if (event.url?.includes('/admin')) {
                return null;
              }
              return event;
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;