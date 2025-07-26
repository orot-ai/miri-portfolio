import React from 'react'
import { Settings, X } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'

export const AdminModeToggle: React.FC = () => {
  const { isAdminMode, toggleAdminMode } = useAdminStore()

  return (
    <button
      onClick={toggleAdminMode}
      className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
        isAdminMode 
          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
      }`}
      title={isAdminMode ? '관리자 모드 끄기' : '관리자 모드 켜기'}
    >
      {isAdminMode ? (
        <X size={24} />
      ) : (
        <Settings size={24} />
      )}
    </button>
  )
}