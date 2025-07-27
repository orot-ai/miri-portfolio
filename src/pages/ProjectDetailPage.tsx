import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Code, Zap, Plus, Trash2, X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '@/types';
import { useAdminStore } from '@/stores/adminStore';
import { useAdminProjects } from '@/hooks/useAdminProjects';
import { EditableText } from '@/components/admin/EditableText';
import { EditableMedia, MediaType } from '@/components/admin/EditableMedia';
import { AdminAPI } from '@/lib/adminAPI';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/utils/logger';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { isAdminMode } = useAdminStore();
  const { projects, updateProject, loading, refetch } = useAdminProjects();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>('image');
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number>(0);
  const [galleryItems, setGalleryItems] = useState<Array<{url: string, type: MediaType, title: string}>>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [swipeThreshold] = useState<number>(50);
  
  // 갤러리 아이템 생성 함수
  const createGalleryItems = (project: Project) => {
    const items: Array<{url: string, type: MediaType, title: string}> = [];
    
    // 메인 미디어
    if (project.detail_media_url) {
      items.push({
        url: project.detail_media_url,
        type: (project.detail_media_type as MediaType) || 'image',
        title: '메인 미디어'
      });
    }
    
    // 스크린샷들
    for (let i = 1; i <= 3; i++) {
      const url = project[`screenshot_${i}_url` as keyof Project] as string;
      const type = (project[`screenshot_${i}_url_type` as keyof Project] as MediaType) || 'image';
      if (url) {
        items.push({
          url,
          type,
          title: `스크린샷 ${i}`
        });
      }
    }
    
    // 썸네일들
    for (let i = 1; i <= 4; i++) {
      const url = project[`thumbnail_${i}_url` as keyof Project] as string;
      const type = (project[`thumbnail_${i}_url_type` as keyof Project] as MediaType) || 'image';
      if (url) {
        items.push({
          url,
          type,
          title: `썸네일 ${i}`
        });
      }
    }
    
    return items;
  };

  // DB에서 프로젝트 찾기
  useEffect(() => {
    const foundProject = projects.find(p => p.id === projectId);
    if (foundProject) {
      // tags를 tech_stack으로, url을 demo_url로 매핑
      const mappedProject = {
        ...foundProject,
        tags: foundProject.tech_stack,
        url: foundProject.demo_url
      };
      setProject(mappedProject);
      
      // 갤러리 아이템 생성
      const items = createGalleryItems(mappedProject);
      setGalleryItems(items);
    }
  }, [projects, projectId]);

  useEffect(() => {
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
  }, []);

  // 갤러리 네비게이션 함수들
  const openGallery = (url: string, type: MediaType) => {
    const index = galleryItems.findIndex(item => item.url === url);
    if (index !== -1) {
      setCurrentGalleryIndex(index);
      setSelectedImageUrl(url);
      setSelectedMediaType(type);
    }
  };

  const nextGalleryItem = () => {
    if (galleryItems.length === 0) return;
    const nextIndex = (currentGalleryIndex + 1) % galleryItems.length;
    changeGalleryItem(nextIndex);
  };

  const prevGalleryItem = () => {
    if (galleryItems.length === 0) return;
    const prevIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    changeGalleryItem(prevIndex);
  };

  const closeGallery = () => {
    setSelectedImageUrl(null);
    setSelectedMediaType('image');
    setCurrentGalleryIndex(0);
    resetZoom();
  };

  // 확대/축소 및 패닝 함수들
  const resetZoom = () => {
    setZoomLevel(1);
    setPanPosition({x: 0, y: 0});
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5));
  };

  const zoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = prev / 1.5;
      if (newZoom <= 1) {
        setPanPosition({x: 0, y: 0});
        return 1;
      }
      return newZoom;
    });
  };

  // 마우스 드래그 패닝
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 마우스 휠 확대/축소
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || galleryItems.length <= 1) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || galleryItems.length <= 1) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // 수평 스와이프가 수직 스와이프보다 큰 경우만 처리
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        prevGalleryItem();
      } else {
        nextGalleryItem();
      }
    }
    
    setTouchStart(null);
  };

  // 갤러리 아이템 변경 시 줌 리셋
  const changeGalleryItem = (index: number) => {
    setCurrentGalleryIndex(index);
    setSelectedImageUrl(galleryItems[index].url);
    setSelectedMediaType(galleryItems[index].type);
    resetZoom();
  };

  // 갤러리 오픈 시 줌 초기화
  const openGalleryWithReset = (url: string, type: MediaType) => {
    resetZoom();
    openGallery(url, type);
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImageUrl) return;
      
      if (e.key === 'ArrowLeft') {
        prevGalleryItem();
      } else if (e.key === 'ArrowRight') {
        nextGalleryItem();
      } else if (e.key === 'Escape') {
        closeGallery();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImageUrl, currentGalleryIndex, galleryItems]);

  const handleTitleUpdate = async (newTitle: string) => {
    if (!project) return false;
    const success = await updateProject(project.id, { title: newTitle });
    if (success) {
      setProject(prev => prev ? { ...prev, title: newTitle } : null);
    }
    return success;
  };
  
  const handleDescriptionUpdate = async (newDescription: string, field: string = 'description') => {
    if (!project) return false;
    const success = await updateProject(project.id, { [field]: newDescription });
    if (success) {
      setProject(prev => prev ? { ...prev, [field]: newDescription } : null);
    }
    return success;
  };
  
  const handleMediaUpdate = async (file: File, mediaType: MediaType, field: string = 'image_url') => {
    if (!project) return '';
    
    try {
      // Supabase Storage에 미디어 업로드
      const mediaUrl = await AdminAPI.uploadFile(file, 'projects');
      
      // 데이터베이스 업데이트 (URL과 타입 모두 저장)
      const updateData: any = { [field]: mediaUrl };
      
      // detail_media_url의 경우 type 필드명이 detail_media_type (url 제거)
      let typeField: string;
      if (field === 'detail_media_url') {
        typeField = 'detail_media_type';
      } else {
        typeField = `${field}_type`;
      }
      updateData[typeField] = mediaType;
      
      logger.info('업데이트 데이터:', { updateData, field, typeField, mediaType });
      
      const success = await updateProject(project.id, updateData);
      
      if (success) {
        setProject(prev => prev ? { ...prev, ...updateData } : null);
        // 최신 데이터를 다시 가져와서 동기화
        await refetch();
        return mediaUrl;
      } else {
        throw new Error('미디어 URL 업데이트 실패');
      }
    } catch (error) {
      logger.error('미디어 업로드 오류:', error);
      alert('미디어 업로드에 실패했습니다. ' + (error as Error).message);
      throw error;
    }
  };
  
  const handleFeatureAdd = async () => {
    if (!project) return;
    const newFeature = prompt('새 기능을 입력하세요:');
    if (!newFeature) return;
    
    const updatedFeatures = [...(project.features || []), newFeature];
    const success = await updateProject(project.id, { features: updatedFeatures });
    if (success) {
      setProject(prev => prev ? { ...prev, features: updatedFeatures } : null);
    }
  };
  
  const handleFeatureRemove = async (index: number) => {
    if (!project) return;
    const updatedFeatures = project.features.filter((_, i) => i !== index);
    const success = await updateProject(project.id, { features: updatedFeatures });
    if (success) {
      setProject(prev => prev ? { ...prev, features: updatedFeatures } : null);
    }
  };
  
  const handleFeatureUpdate = async (index: number, newValue: string) => {
    if (!project) return false;
    const updatedFeatures = [...project.features];
    updatedFeatures[index] = newValue;
    const success = await updateProject(project.id, { features: updatedFeatures });
    if (success) {
      setProject(prev => prev ? { ...prev, features: updatedFeatures } : null);
    }
    return success;
  };
  
  const handleTechStackAdd = async () => {
    if (!project) return;
    const newTech = prompt('새 기술 스택을 입력하세요:');
    if (!newTech) return;
    
    const updatedTechStack = [...(project.tech_stack || []), newTech];
    const success = await updateProject(project.id, { tech_stack: updatedTechStack });
    if (success) {
      setProject(prev => prev ? { ...prev, tech_stack: updatedTechStack, tags: updatedTechStack } : null);
    }
  };
  
  const handleTechStackRemove = async (tech: string) => {
    if (!project) return;
    const updatedTechStack = project.tech_stack.filter(t => t !== tech);
    const success = await updateProject(project.id, { tech_stack: updatedTechStack });
    if (success) {
      setProject(prev => prev ? { ...prev, tech_stack: updatedTechStack, tags: updatedTechStack } : null);
    }
  };
  
  const handleUrlUpdate = async (newUrl: string) => {
    if (!project) return false;
    const success = await updateProject(project.id, { demo_url: newUrl });
    if (success) {
      setProject(prev => prev ? { ...prev, demo_url: newUrl, url: newUrl } : null);
    }
    return success;
  };
  
  const handleGithubUrlUpdate = async (newUrl: string) => {
    if (!project) return false;
    const success = await updateProject(project.id, { github_url: newUrl });
    if (success) {
      setProject(prev => prev ? { ...prev, github_url: newUrl } : null);
    }
    return success;
  };
  
  const handleStatusUpdate = async (newStatus: string) => {
    if (!project) return false;
    const success = await updateProject(project.id, { development_status: newStatus });
    if (success) {
      setProject(prev => prev ? { ...prev, development_status: newStatus } : null);
    }
    return success;
  };

  const handleSectionTitleLine1Update = async (newTitle: string) => {
    if (!project) return false;
    const success = await updateProject(project.id, { section_title_line1: newTitle });
    if (success) {
      setProject(prev => prev ? { ...prev, section_title_line1: newTitle } : null);
    }
    return success;
  };

  const handleSectionTitleLine2Update = async (newTitle: string) => {
    if (!project) return false;
    const success = await updateProject(project.id, { section_title_line2: newTitle });
    if (success) {
      setProject(prev => prev ? { ...prev, section_title_line2: newTitle } : null);
    }
    return success;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">프로젝트를 찾을 수 없습니다</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-black transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const isVibeProject = project.category === 'vibe';

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 영역 */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6">
        <motion.button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-600 hover:text-black transition-colors mb-4 sm:mb-6 md:mb-8 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>프로젝트 목록으로</span>
        </motion.button>

        {/* 프로젝트 헤더 */}
        <div className="mb-2 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* 왼쪽: 텍스트 정보 */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-baseline gap-4 mb-1">
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-black"
                style={{ fontFamily: 'Pretendard Variable, sans-serif' }}
              >
                <EditableText
                  value={project.title}
                  onSave={handleTitleUpdate}
                  className="inline"
                />
              </h1>
              {isAdminMode && (
                <span className="text-sm font-medium text-gray-500">
                  <EditableText
                    value={project.development_status}
                    onSave={handleStatusUpdate}
                    placeholder="상태"
                  />
                </span>
              )}
            </div>
            
            <p 
              className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-3 max-w-2xl"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              <EditableText
                value={project.description_detail_top || project.description || ''}
                onSave={(value) => handleDescriptionUpdate(value, 'description_detail_top')}
                placeholder="프로젝트 설명 (짧게)"
                multiline
                className="whitespace-pre-line"
              />
            </p>

            {/* 기술 스택 */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-0.5 text-xs sm:text-sm font-medium text-gray-600 border border-gray-300 group/tag"
                >
                  {tag}
                  {isAdminMode && (
                    <button
                      onClick={() => handleTechStackRemove(tag)}
                      className="ml-1 text-red-500 opacity-0 group-hover/tag:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isAdminMode && (
                <button
                  onClick={handleTechStackAdd}
                  className="px-3 py-0.5 text-sm font-medium text-purple-600 border border-purple-300 hover:bg-purple-50 transition-colors flex items-center gap-1"
                >
                  <Plus size={12} />
                  기술 추가
                </button>
              )}
            </div>
          </motion.div>
          
          {/* 오른쪽: CTA 버튼 */}
          <motion.div
            className="flex items-start lg:items-end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {project.url && !isAdminMode && (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white text-sm sm:text-base font-medium"
                whileHover={{ y: -2 }}
              >
                <span>사이트 방문하기</span>
                <ExternalLink size={14} className="sm:w-4 sm:h-4" />
              </motion.a>
            )}
            {isAdminMode && (
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Demo URL:</label>
                  <EditableText
                    value={project.demo_url || ''}
                    onSave={handleUrlUpdate}
                    placeholder="https://example.com"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">GitHub URL:</label>
                  <EditableText
                    value={project.github_url || ''}
                    onSave={handleGithubUrlUpdate}
                    placeholder="https://github.com/..."
                    className="text-sm"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 메인 이미지 - 상단에 크게 */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pb-4">
        <motion.div
          className="aspect-video bg-gray-100 overflow-hidden relative group cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <EditableMedia
            src={project.detail_media_url || ''}
            alt={project.title}
            mediaType={(project.detail_media_type as MediaType) || 'image'}
            onSave={(file, mediaType) => handleMediaUpdate(file, mediaType, 'detail_media_url')}
            className="w-full h-full object-cover object-center"
            placeholder="클릭하여 메인 미디어 추가 (이미지/비디오)"
          />
          {!isAdminMode && project.detail_media_url && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
              onClick={() => openGalleryWithReset(project.detail_media_url!, (project.detail_media_type as MediaType) || 'image')}
            >
              <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </motion.div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* 왼쪽: 서브 이미지 영역 */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* 추가 이미지들 */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="aspect-video bg-gray-100 overflow-hidden relative group cursor-pointer">
                  <EditableMedia
                    src={project[`screenshot_${num}_url` as keyof Project] as string || ""}
                    alt={`스크린샷 ${num}`}
                    mediaType={(project[`screenshot_${num}_url_type` as keyof Project] as MediaType) || 'image'}
                    onSave={(file, mediaType) => handleMediaUpdate(file, mediaType, `screenshot_${num}_url`)}
                    className="w-full h-full object-cover object-center"
                    placeholder={`스크린샷 ${num} 추가`}
                  />
                  {!isAdminMode && project[`screenshot_${num}_url` as keyof Project] && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
                      onClick={() => {
                        const url = project[`screenshot_${num}_url` as keyof Project] as string;
                        const type = (project[`screenshot_${num}_url_type` as keyof Project] as MediaType) || 'image';
                        openGalleryWithReset(url, type);
                      }}
                    >
                      <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 작은 썸네일들 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <div key={`thumb-${num}`} className="aspect-square bg-gray-100 overflow-hidden relative group cursor-pointer">
                  <EditableMedia
                    src={project[`thumbnail_${num}_url` as keyof Project] as string || ""}
                    alt={`썸네일 ${num}`}
                    mediaType={(project[`thumbnail_${num}_url_type` as keyof Project] as MediaType) || 'image'}
                    onSave={(file, mediaType) => handleMediaUpdate(file, mediaType, `thumbnail_${num}_url`)}
                    className="w-full h-full object-cover object-center"
                    placeholder={`썸네일 ${num}`}
                  />
                  {!isAdminMode && project[`thumbnail_${num}_url` as keyof Project] && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
                      onClick={() => {
                        const url = project[`thumbnail_${num}_url` as keyof Project] as string;
                        const type = (project[`thumbnail_${num}_url_type` as keyof Project] as MediaType) || 'image';
                        openGalleryWithReset(url, type);
                      }}
                    >
                      <ZoomIn size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* 오른쪽: 설명 영역 */}
          <motion.div
            className="space-y-8 sm:space-y-10 md:space-y-12 mt-6 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {/* 프로젝트 소개 */}
            <div>
              <h2 
                className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6"
                style={{ fontFamily: 'Pretendard Variable, sans-serif' }}
              >
                <EditableText
                  value={project.section_title_line1 || (isVibeProject ? '바이브코딩으로 만든' : '자동화로 해결한')}
                  onSave={handleSectionTitleLine1Update}
                  placeholder={isVibeProject ? '바이브코딩으로 만든' : '자동화로 해결한'}
                  className="text-2xl"
                />
                <br />
                <span className="text-2xl sm:text-3xl">
                  <EditableText
                    value={project.section_title_line2 || (project.category === 'vibe' ? '프로젝트' : '시스템')}
                    onSave={handleSectionTitleLine2Update}
                    placeholder={project.category === 'vibe' ? '프로젝트' : '시스템'}
                    className="text-3xl"
                  />
                </span>
              </h2>
              
              <div className="w-12 sm:w-16 h-0.5 bg-black mb-4 sm:mb-6"></div>
              
              <div 
                className="text-sm sm:text-base text-gray-600 leading-relaxed space-y-3 sm:space-y-4"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                {isAdminMode ? (
                  <EditableText
                    value={project.description_detail_bottom || project.description || ''}
                    onSave={(value) => handleDescriptionUpdate(value, 'description_detail_bottom')}
                    placeholder="상세 설명을 입력하세요 (길게)"
                    multiline
                    className="whitespace-pre-line"
                  />
                ) : (
                  <p className="whitespace-pre-line">{project.description_detail_bottom || project.description}</p>
                )}
              </div>
            </div>

            {/* 주요 기능 */}
            {(project.features && project.features.length > 0) || isAdminMode ? (
              <div>
                <h3 
                  className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6"
                  style={{ fontFamily: 'Pretendard Variable, sans-serif' }}
                >
                  주요 기능
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {project.features?.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="flex items-start gap-2 group"
                    >
                      <span className="text-purple-600 mt-0.5">•</span>
                      <span className="text-gray-600 text-xs sm:text-sm leading-relaxed flex-1">
                        {isAdminMode ? (
                          <EditableText
                            value={feature}
                            onSave={(value) => handleFeatureUpdate(index, value)}
                            className="inline"
                          />
                        ) : (
                          feature
                        )}
                      </span>
                      {isAdminMode && (
                        <button
                          onClick={() => handleFeatureRemove(index)}
                          className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                  {isAdminMode && (
                    <button
                      onClick={handleFeatureAdd}
                      className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-2"
                    >
                      <Plus size={14} />
                      기능 추가
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            {/* 개발 현황 */}
            {isAdminMode && (
              <div className="bg-gray-50 p-4 sm:p-6 md:p-8">
                <h3 
                  className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4"
                  style={{ fontFamily: 'Pretendard Variable, sans-serif' }}
                >
                  개발 현황
                </h3>
                
                <div className="space-y-2 sm:space-y-3" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <span className="font-semibold text-black">기술 스택:</span> {project.tech_stack.join(', ')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <span className="font-semibold text-black">상태:</span> 
                    <EditableText
                      value={project.development_status}
                      onSave={handleStatusUpdate}
                      className="inline ml-2"
                    />
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 갤러리 모달 */}
      <AnimatePresence>
        {selectedImageUrl && galleryItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50"
            onClick={closeGallery}
          >
            {/* 상단 헤더 */}
            <div className="absolute top-4 left-4 right-4 z-40 flex justify-between items-center pointer-events-none">
              <div className="text-white pointer-events-auto">
                <h3 className="text-lg font-semibold">{galleryItems[currentGalleryIndex]?.title}</h3>
                <p className="text-sm text-gray-300">{currentGalleryIndex + 1} / {galleryItems.length}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeGallery();
                }}
                className="p-1.5 sm:p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors pointer-events-auto"
                title="닫기 (ESC)"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* 좌우 네비게이션 버튼 */}
            {galleryItems.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevGalleryItem();
                  }}
                  className="absolute top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 md:p-4 bg-white bg-opacity-80 sm:bg-opacity-100 text-black rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:scale-110 left-2 sm:left-4 md:left-8"
                >
                  <ChevronLeft size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextGalleryItem();
                  }}
                  className="absolute top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 md:p-4 bg-white bg-opacity-80 sm:bg-opacity-100 text-black rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:scale-110 right-2 sm:right-4 md:right-8"
                >
                  <ChevronRight size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
              </>
            )}

            {/* 미디어 컨테이너 - 전체 화면 중앙에서 확대/축소 */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: zoomLevel, 
                  opacity: 1,
                  x: panPosition.x,
                  y: panPosition.y
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                style={{
                  transformOrigin: 'center center'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {selectedMediaType === 'video' ? (
                  <video
                    src={selectedImageUrl}
                    className="rounded-lg shadow-2xl select-none max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] max-h-[70vh]"
                    style={{ 
                      width: 'auto',
                      height: 'auto',
                      pointerEvents: zoomLevel > 1 ? 'none' : 'auto'
                    }}
                    controls={zoomLevel <= 1}
                    autoPlay
                    muted
                    loop
                    playsInline
                    draggable={false}
                  />
                ) : (
                  <img
                    src={selectedImageUrl}
                    alt={galleryItems[currentGalleryIndex]?.title}
                    className="rounded-lg shadow-2xl select-none max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] max-h-[70vh]"
                    style={{ 
                      width: 'auto',
                      height: 'auto'
                    }}
                    draggable={false}
                  />
                )}
              </motion.div>
            </div>
            
            {/* 화면 고정 확대/축소 컨트롤 */}
            <div className="fixed top-4 right-4 z-50 pointer-events-none">
              <div className="flex items-center gap-0.5 sm:gap-1 bg-black bg-opacity-70 rounded-lg p-1.5 sm:p-2 backdrop-blur-sm pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    zoomOut();
                  }}
                  className="p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={zoomLevel <= 1}
                  title="축소 (-)"
                >
                  <ZoomOut size={16} className="sm:w-5 sm:h-5" />
                </button>
                <span className="text-white text-xs sm:text-sm min-w-[2.5rem] sm:min-w-[3.5rem] text-center font-medium">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    zoomIn();
                  }}
                  className="p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={zoomLevel >= 5}
                  title="확대 (+)"
                >
                  <ZoomIn size={16} className="sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetZoom();
                  }}
                  className="p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  title="원래 크기 (0)"
                >
                  <RotateCcw size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            
            {/* 화면 하단 고정 썸네일 네비게이션 */}
            {galleryItems.length > 1 && (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                <div className="flex gap-1 sm:gap-2 bg-black bg-opacity-70 p-2 sm:p-3 rounded-lg backdrop-blur-sm pointer-events-auto max-w-[90vw] overflow-x-auto">
                  {galleryItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeGalleryItem(index);
                      }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                        index === currentGalleryIndex 
                          ? 'border-white scale-110 shadow-lg' 
                          : 'border-gray-400 hover:border-white hover:scale-105'
                      }`}
                    >
                      {item.type === 'video' ? (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center relative">
                          <video 
                            src={item.url} 
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={item.url} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetailPage;