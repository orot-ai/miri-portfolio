import { logger } from './logger'

// 에러 타입 정의
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

// 에러 메시지 매핑
const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NETWORK]: '네트워크 연결을 확인해주세요.',
  [ErrorType.VALIDATION]: '입력한 정보를 다시 확인해주세요.',
  [ErrorType.PERMISSION]: '권한이 없습니다.',
  [ErrorType.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [ErrorType.SERVER]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorType.UNKNOWN]: '알 수 없는 오류가 발생했습니다.'
}

// 에러 분류 함수
export const classifyError = (error: unknown): ErrorType => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorType.NETWORK
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION
    }
    if (message.includes('permission') || message.includes('unauthorized')) {
      return ErrorType.PERMISSION
    }
    if (message.includes('not found') || message.includes('404')) {
      return ErrorType.NOT_FOUND
    }
    if (message.includes('server') || message.includes('500')) {
      return ErrorType.SERVER
    }
  }
  
  return ErrorType.UNKNOWN
}

// 사용자 친화적 에러 메시지 생성
export const getUserFriendlyError = (error: unknown): string => {
  const errorType = classifyError(error)
  const baseMessage = ERROR_MESSAGES[errorType]
  
  if (error instanceof Error && error.message) {
    logger.error(`${errorType}:`, error)
    
    // 개발 환경에서는 상세 메시지 포함
    if (import.meta.env.DEV) {
      return `${baseMessage} (상세: ${error.message})`
    }
  }
  
  return baseMessage
}

// 에러 핸들링 래퍼
export const handleError = (
  error: unknown, 
  context: string,
  showAlert = true
): string => {
  const message = getUserFriendlyError(error)
  
  logger.error(`[${context}] 에러 발생:`, error)
  
  if (showAlert) {
    alert(message)
  }
  
  return message
}

// Promise 에러 핸들링 래퍼
export const withErrorHandling = async <T>(
  promise: Promise<T>,
  context: string,
  defaultValue?: T
): Promise<T | undefined> => {
  try {
    return await promise
  } catch (error) {
    handleError(error, context)
    return defaultValue
  }
}

// React 에러 바운더리용 에러 클래스
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType = ErrorType.UNKNOWN,
    public context?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}