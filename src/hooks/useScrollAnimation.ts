import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAnimation, AnimationControls } from 'framer-motion';
import { useAdminStore } from '@/stores/adminStore';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.2, triggerOnce = true, delay = 0 } = options;
  const { isAdminMode } = useAdminStore();
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  useEffect(() => {
    if (isAdminMode) {
      // 편집 모드에서는 항상 visible 상태
      controls.set('visible');
      return;
    }
    
    if (inView) {
      const timer = setTimeout(() => {
        controls.start('visible');
      }, delay);
      
      return () => clearTimeout(timer);
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [inView, controls, delay, triggerOnce, isAdminMode]);

  return { ref, controls, inView };
};

export const useStaggeredAnimation = (itemCount: number, baseDelay = 0, staggerDelay = 100) => {
  const controls = useRef<AnimationControls[]>([]);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Initialize controls for each item
  useEffect(() => {
    controls.current = Array.from({ length: itemCount }, () => useAnimation());
  }, [itemCount]);

  useEffect(() => {
    if (inView) {
      controls.current.forEach((control, index) => {
        setTimeout(() => {
          control.start('visible');
        }, baseDelay + (index * staggerDelay));
      });
    }
  }, [inView, baseDelay, staggerDelay]);

  return { ref, controls: controls.current };
};

export const useSequentialAnimation = () => {
  const controlsMap = useRef<Map<string, AnimationControls>>(new Map());
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const registerControl = (key: string, control: AnimationControls) => {
    controlsMap.current.set(key, control);
  };

  const triggerSequence = async (sequence: Array<{ key: string; delay?: number }>) => {
    for (const item of sequence) {
      if (item.delay) {
        await new Promise(resolve => setTimeout(resolve, item.delay));
      }
      const control = controlsMap.current.get(item.key);
      if (control) {
        await control.start('visible');
      }
    }
  };

  useEffect(() => {
    if (inView) {
      // Override this in component to define custom sequence
    }
  }, [inView]);

  return { ref, registerControl, triggerSequence, inView };
};