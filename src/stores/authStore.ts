import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  adminPassword: string;
  login: (password: string) => boolean;
  logout: () => void;
}

// 실제 운영 환경에서는 서버측 인증을 사용하세요
const ADMIN_PASSWORD = 'admin123'; // 임시 비밀번호

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminPassword: ADMIN_PASSWORD,
      
      login: (password: string) => {
        const isValid = password === get().adminPassword;
        if (isValid) {
          set({ isAuthenticated: true });
        }
        return isValid;
      },
      
      logout: () => {
        set({ isAuthenticated: false });
        // 관리자 모드도 함께 해제
        const adminStore = useAdminStore.getState();
        adminStore.setAdminMode(false);
      },
    }),
    {
      name: 'admin-auth',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);

// adminStore import는 순환 참조 방지를 위해 함수 내부에서 동적 import
import { useAdminStore } from './adminStore';