import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigationItems } from '@/data';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStore } from '@/stores/adminStore';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();
  const { isAdminMode, toggleAdminMode } = useAdminStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.1
      }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.2
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: -20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };

  const mobileMenuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: 'easeOut'
      }
    })
  };

  const handleNavClick = (href: string, isRoute?: boolean) => {
    setIsMobileMenuOpen(false);
    
    // 라우트 링크인 경우 페이지 이동
    if (isRoute) {
      navigate(href);
      return;
    }
    
    // 현재 페이지가 홈이 아니면 홈으로 이동 후 스크롤
    if (location.pathname !== '/') {
      navigate('/');
      // 페이지 이동 후 스크롤을 위해 지연
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      // 이미 홈페이지에 있으면 바로 스크롤
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <>
      <motion.header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${isScrolled 
            ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm' 
            : 'bg-transparent'
          }
          ${className}
        `}
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="flex items-center justify-between py-6">
            {/* Logo */}
            <motion.button
              onClick={() => navigate('/')}
              className="text-2xl font-bold tracking-tight text-black hover:opacity-70 transition-opacity"
              variants={logoVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              MIRI
            </motion.button>

            {/* Desktop Navigation */}
            <motion.nav 
              className="hidden md:flex items-center gap-6"
              variants={menuVariants}
            >
              <ul className="flex items-center gap-8">
                {navigationItems.map((item, index) => (
                  <motion.li key={item.href}>
                    <motion.a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href, item.isRoute);
                      }}
                      className="text-sm font-medium tracking-wide text-gray-600 hover:text-black transition-colors cursor-pointer"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
              
              {/* Admin Controls */}
              {isAuthenticated && (
                <div className="flex items-center gap-4 ml-8 pl-8 border-l border-gray-200">
                  <motion.button
                    onClick={toggleAdminMode}
                    className={`p-2 rounded-lg transition-colors ${
                      isAdminMode
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-600 hover:text-black'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={isAdminMode ? '편집 모드 끄기' : '편집 모드 켜기'}
                  >
                    <Settings size={20} />
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="p-2 text-gray-600 hover:text-black transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="로그아웃"
                  >
                    <LogOut size={20} />
                  </motion.button>
                </div>
              )}
            </motion.nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variants={menuVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              className="absolute top-20 right-4 left-4 bg-white rounded-lg shadow-xl border border-gray-200/50 p-6"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <nav>
                <ul className="space-y-4">
                  {navigationItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      custom={index}
                      variants={mobileMenuItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.href, item.isRoute);
                        }}
                        className="block py-3 px-4 text-lg font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all cursor-pointer"
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                  
                  {/* Mobile Admin Controls */}
                  {isAuthenticated && (
                    <>
                      <motion.li
                        custom={navigationItems.length}
                        variants={mobileMenuItemVariants}
                        initial="hidden"
                        animate="visible"
                        className="border-t border-gray-100 pt-4 mt-4"
                      >
                        <button
                          onClick={() => {
                            toggleAdminMode();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 py-3 px-4 text-lg font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all"
                        >
                          <Settings size={20} />
                          {isAdminMode ? '편집 모드 끄기' : '편집 모드 켜기'}
                        </button>
                      </motion.li>
                      <motion.li
                        custom={navigationItems.length + 1}
                        variants={mobileMenuItemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <button
                          onClick={() => {
                            logout();
                            navigate('/');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 py-3 px-4 text-lg font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all"
                        >
                          <LogOut size={20} />
                          로그아웃
                        </button>
                      </motion.li>
                    </>
                  )}
                </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;