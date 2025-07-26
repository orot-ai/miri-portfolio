import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Folder, Settings, Image, FileText, LogOut } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
}

const AdminNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: '홈 편집',
      icon: <Home size={20} />,
      path: '/admin'
    },
    {
      id: 'projects',
      label: '프로젝트 관리',
      icon: <Folder size={20} />,
      path: '/admin/projects'
    },
    {
      id: 'media',
      label: '미디어 라이브러리',
      icon: <Image size={20} />,
      path: '/admin/media'
    },
    {
      id: 'settings',
      label: '사이트 설정',
      icon: <Settings size={20} />,
      path: '/admin/settings'
    }
  ]
  
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/admin/projects' && location.pathname.startsWith('/admin/project/'))
  }
  
  const handleLogout = () => {
    if (confirm('관리자 페이지에서 나가시겠습니까?')) {
      window.location.href = '/'
    }
  }
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-[1400px] mx-auto px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900">포트폴리오 관리자</h1>
            
            <nav className="flex items-center gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all
                    ${isActive(item.path) 
                      ? 'text-black bg-gray-100' 
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>나가기</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminNavigation