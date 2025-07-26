import { lazy, ComponentType, LazyExoticComponent } from 'react';

// 지연 로딩 래퍼 함수
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackDelay: number = 200
): LazyExoticComponent<T> {
  return lazy(() => {
    return Promise.all([
      importFunc(),
      new Promise(resolve => setTimeout(resolve, fallbackDelay))
    ]).then(([moduleExports]) => moduleExports);
  });
}

// 프리로드 함수
export function preloadComponent(
  importFunc: () => Promise<any>
): void {
  importFunc();
}