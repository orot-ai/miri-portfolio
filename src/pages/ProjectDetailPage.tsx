import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Code, Zap, Plus, Trash2, X, ZoomIn } from 'lucide-react';
import { Project } from '@/types';
import { useAdminStore } from '@/stores/adminStore';
import { useAdminProjects } from '@/hooks/useAdminProjects';
import { EditableText } from '@/components/admin/EditableText';
import { EditableImage } from '@/components/admin/EditableImage';
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
  
  // DB에서 프로젝트 찾기
  useEffect(() => {
    const foundProject = projects.find(p => p.id === projectId);
    if (foundProject) {
      // tags를 tech_stack으로, url을 demo_url로 매핑
      setProject({
        ...foundProject,
        tags: foundProject.tech_stack,
        url: foundProject.demo_url
      });
    }
  }, [projects, projectId]);

  useEffect(() => {
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
  }, []);

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
  
  const handleImageUpdate = async (file: File, field: string = 'image_url') => {
    if (!project) return '';
    
    try {
      // Supabase Storage에 이미지 업로드
      const imageUrl = await AdminAPI.uploadFile(file, 'projects');
      
      // 데이터베이스 업데이트
      const success = await updateProject(project.id, { [field]: imageUrl });
      
      if (success) {
        setProject(prev => prev ? { ...prev, [field]: imageUrl } : null);
        // 최신 데이터를 다시 가져와서 동기화
        await refetch();
        return imageUrl;
      } else {
        throw new Error('이미지 URL 업데이트 실패');
      }
    } catch (error) {
      logger.error('이미지 업로드 오류:', error);
      alert('이미지 업로드에 실패했습니다. ' + (error as Error).message);
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
      <div className="max-w-[1100px] mx-auto px-8 pt-24 pb-6">
        <motion.button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-3 text-gray-600 hover:text-black transition-colors mb-8 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>프로젝트 목록으로</span>
        </motion.button>

        {/* 프로젝트 헤더 */}
        <div className="mb-2 flex gap-8">
          {/* 왼쪽: 텍스트 정보 */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-baseline gap-4 mb-1">
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-black"
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
              className="text-xl text-gray-600 leading-relaxed mb-3 max-w-2xl"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              <EditableText
                value={project.description_detail_top || project.description || ''}
                onSave={(value) => handleDescriptionUpdate(value, 'description_detail_top')}
                placeholder="프로젝트 설명 (짧게)"
                multiline
              />
            </p>

            {/* 기술 스택 */}
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-0.5 text-sm font-medium text-gray-600 border border-gray-300 group/tag"
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
            className="flex items-end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {project.url && !isAdminMode && (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium"
                whileHover={{ y: -2 }}
              >
                <span>사이트 방문하기</span>
                <ExternalLink size={16} />
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
      <div className="max-w-[1100px] mx-auto px-8 pb-4">
        <motion.div
          className="aspect-video bg-gray-100 overflow-hidden relative group cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <EditableImage
            src={project.image_url || ''}
            alt={project.title}
            onSave={handleImageUpdate}
            className="w-full h-full object-cover object-center"
            placeholder="클릭하여 메인 이미지 추가"
          />
          {!isAdminMode && project.image_url && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
              onClick={() => setSelectedImageUrl(project.image_url)}
            >
              <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </motion.div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-[1100px] mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 서브 이미지 영역 */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* 추가 이미지들 */}
            <div className="space-y-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="aspect-video bg-gray-100 overflow-hidden relative group cursor-pointer">
                  <EditableImage
                    src={project[`screenshot_${num}_url` as keyof Project] as string || ""}
                    alt={`스크린샷 ${num}`}
                    onSave={(file) => handleImageUpdate(file, `screenshot_${num}_url`)}
                    className="w-full h-full object-cover object-center"
                    placeholder={`스크린샷 ${num} 추가`}
                  />
                  {!isAdminMode && project[`screenshot_${num}_url` as keyof Project] && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
                      onClick={() => setSelectedImageUrl(project[`screenshot_${num}_url` as keyof Project] as string)}
                    >
                      <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 작은 썸네일들 */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <div key={`thumb-${num}`} className="aspect-square bg-gray-100 overflow-hidden relative group cursor-pointer">
                  <EditableImage
                    src={project[`thumbnail_${num}_url` as keyof Project] as string || ""}
                    alt={`썸네일 ${num}`}
                    onSave={(file) => handleImageUpdate(file, `thumbnail_${num}_url`)}
                    className="w-full h-full object-cover object-center"
                    placeholder={`썸네일 ${num}`}
                  />
                  {!isAdminMode && project[`thumbnail_${num}_url` as keyof Project] && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
                      onClick={() => setSelectedImageUrl(project[`thumbnail_${num}_url` as keyof Project] as string)}
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
            className="space-y-12"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {/* 프로젝트 소개 */}
            <div>
              <h2 
                className="text-2xl font-bold text-black mb-6"
                style={{ fontFamily: 'Pretendard Variable, sans-serif' }}
              >
                {isVibeProject ? '바이브코딩으로 만든' : '자동화로 해결한'}
                <br />
                <span className="text-3xl">{project.category === 'vibe' ? '프로젝트' : '시스템'}</span>
              </h2>
              
              <div className="w-16 h-0.5 bg-black mb-6"></div>
              
              <div 
                className="text-gray-600 leading-relaxed space-y-4"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                {isAdminMode ? (
                  <EditableText
                    value={project.description_detail_bottom || project.description || ''}
                    onSave={(value) => handleDescriptionUpdate(value, 'description_detail_bottom')}
                    placeholder="상세 설명을 입력하세요 (길게)"
                    multiline
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
                  className="text-xl font-bold text-black mb-6"
                  style={{ fontFamily: 'Pretendard Variable, sans-serif' }}
                >
                  주요 기능
                </h3>
                
                <div className="space-y-4">
                  {project.features?.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="flex items-start gap-2 group"
                    >
                      <span className="text-purple-600">•</span>
                      <span className="text-gray-600 text-sm leading-relaxed flex-1">
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
              <div className="bg-gray-50 p-8">
                <h3 
                  className="text-lg font-bold text-black mb-4"
                  style={{ fontFamily: 'Pretendard Variable, sans-serif' }}
                >
                  개발 현황
                </h3>
                
                <div className="space-y-3" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                  <p className="text-gray-600">
                    <span className="font-semibold text-black">기술 스택:</span> {project.tech_stack.join(', ')}
                  </p>
                  <p className="text-gray-600">
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

      {/* 이미지 확대 모달 */}
      <AnimatePresence>
        {selectedImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-8"
            onClick={() => setSelectedImageUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={() => setSelectedImageUrl(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <X size={24} />
              </button>
              
              {/* 확대된 이미지 */}
              <img
                src={selectedImageUrl}
                alt="확대된 이미지"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{ maxHeight: 'calc(100vh - 4rem)' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetailPage;