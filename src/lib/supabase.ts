import { createClient } from '@supabase/supabase-js'
import { Project } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL과 ANON KEY가 환경변수에 설정되어 있지 않습니다.')
}

if (!supabaseServiceKey) {
  throw new Error('Supabase SERVICE KEY가 환경변수에 설정되어 있지 않습니다.')
}

// 일반 사용자용 클라이언트 (읽기 전용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 관리자용 클라이언트 (전체 권한, RLS 우회)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 데이터베이스 타입 정의
export interface PortfolioContent {
  id: string
  section: string
  field: string
  content: string
  content_type: 'text' | 'image' | 'json'
  created_at: string
  updated_at: string
}


export interface SiteSettings {
  id: string
  setting_key: string
  setting_value: string
  description?: string
  created_at: string
  updated_at: string
}

export interface MediaFile {
  id: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  created_at: string
}