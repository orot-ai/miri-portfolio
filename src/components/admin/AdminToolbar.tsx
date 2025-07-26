import React from 'react'
import { Save, Eye, Settings, LogOut } from 'lucide-react'

interface AdminToolbarProps {
  onSaveAll?: () => void
  onPreview?: () => void
  onSettings?: () => void
  onLogout?: () => void
  hasUnsavedChanges?: boolean
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({
  onSaveAll,
  onPreview,
  onSettings,
  onLogout,
  hasUnsavedChanges = false
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-[1100px] mx-auto px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">포트폴리오 관리자</h1>
          {hasUnsavedChanges && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
              저장되지 않은 변경사항
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onSaveAll && (
            <button
              onClick={onSaveAll}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                hasUnsavedChanges 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!hasUnsavedChanges}
            >
              <Save size={16} />
              모두 저장
            </button>
          )}

          {onPreview && (
            <button
              onClick={onPreview}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              <Eye size={16} />
              미리보기
            </button>
          )}

          {onSettings && (
            <button
              onClick={onSettings}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              <Settings size={16} />
              설정
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <LogOut size={16} />
              나가기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminToolbar