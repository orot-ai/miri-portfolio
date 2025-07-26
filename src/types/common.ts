// 공통 기본 타입
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T
  error?: string
  status: number
}

// 페이지네이션 타입
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 정렬 타입
export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

// 필터 타입
export interface FilterOption {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in'
  value: any
}

// 컴포넌트 공통 Props
export interface CommonComponentProps {
  className?: string
  style?: React.CSSProperties
}

// 애니메이션 Props
export interface AnimationProps {
  initial?: any
  animate?: any
  exit?: any
  transition?: any
  variants?: any
}

// 이벤트 핸들러 타입
export type AsyncHandler<T = void> = () => Promise<T>
export type Handler<T = void> = () => T
export type ValueHandler<T, R = void> = (value: T) => R
export type AsyncValueHandler<T, R = void> = (value: T) => Promise<R>

// 상태 타입
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface DataState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// 폼 관련 타입
export interface FormField<T = string> {
  value: T
  error?: string
  touched?: boolean
}

export interface FormState<T extends Record<string, any>> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

// 유틸리티 타입
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined