/**
 * 환경변수 기반 로그 시스템
 * - 프로덕션: 에러만 출력
 * - 개발: 모든 로그 출력  
 * - 디버그 로그: VITE_ENABLE_DEBUG_LOGS=true일 때만 출력
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private enableDebugLogs = import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true';
  private enableInfoLogs = this.isDevelopment || import.meta.env.VITE_ENABLE_INFO_LOGS === 'true';

  private log(level: LogLevel, message: string, ...args: any[]) {
    // 프로덕션에서는 에러만 출력
    if (!this.isDevelopment && level !== 'error') return;
    
    // 디버그 로그는 명시적으로 활성화된 경우만
    if (level === 'debug' && !this.enableDebugLogs) return;
    
    // 정보성 로그 제어
    if (level === 'info' && !this.enableInfoLogs) return;
    
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }
}

export const logger = new Logger();