import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminStore } from '@/stores/adminStore';
import { useAdminProjects } from '@/hooks/useAdminProjects';
import { useAdminContent } from '@/hooks/useAdminContent';
import { useProjectOrder } from '@/hooks/useProjectOrder';
import { ProjectsPageHeader } from '@/components/projects/ProjectsPageHeader';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { Project } from '@/types';
import { sectionStyles } from '@/utils/animations';
import { supabase } from '@/lib/supabase';

type TabType = 'vibe' | 'automation';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tab = searchParams.get('tab');
    return tab === 'automation' ? 'automation' : 'vibe';
  });
  
  // URL 파라미터 변경 감지하여 탭 상태 동기화
  useEffect(() => {
    const tab = searchParams.get('tab');
    const newTab = tab === 'automation' ? 'automation' : 'vibe';
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [searchParams, activeTab]);
  
  // 데이터 훅들
  const { 
    projects: vibeProjects, 
    createProject: createVibeProject, 
    deleteProject: deleteVibeProject, 
    updateProject: updateVibeProject, 
    updateProjectsOrder: updateVibeOrder, 
    loading: vibeLoading, 
    error: vibeError 
  } = useAdminProjects('vibe');
  
  const { 
    projects: automationProjects, 
    createProject: createAutomationProject, 
    deleteProject: deleteAutomationProject, 
    updateProject: updateAutomationProject, 
    updateProjectsOrder: updateAutomationOrder, 
    loading: autoLoading, 
    error: autoError 
  } = useAdminProjects('automation');
  
  const { content, updateContent } = useAdminContent('projects_page');
  
  // 현재 탭에 따른 데이터와 함수들
  const currentProjects = activeTab === 'vibe' ? vibeProjects : automationProjects;
  const currentLoading = activeTab === 'vibe' ? vibeLoading : autoLoading;
  const currentError = activeTab === 'vibe' ? vibeError : autoError;
  const createProject = activeTab === 'vibe' ? createVibeProject : createAutomationProject;
  const deleteProject = activeTab === 'vibe' ? deleteVibeProject : deleteAutomationProject;
  const updateProject = activeTab === 'vibe' ? updateVibeProject : updateAutomationProject;
  const updateProjectsOrder = activeTab === 'vibe' ? updateVibeOrder : updateAutomationOrder;
  
  
  // 프로젝트 순서 관리 (리팩토링된 훅 사용)
  const { orderedProjects, handleDragEnd, isReordering } = useProjectOrder({
    projects: currentProjects,
    updateProjectsOrder
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 헬퍼 함수들
  const getContentValue = (field: string) => {
    return content.find(item => item.field === field)?.content || ''
  }
  
  const getContentId = (field: string) => {
    return content.find(item => item.field === field)?.id || ''
  }
  
  const handleContentUpdate = async (field: string, newValue: string) => {
    const id = getContentId(field)
    if (id) {
      return await updateContent(id, newValue)
    }
    return false
  }
  
  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}`);
  };

  const handleTabChange = (newTab: TabType) => {
    if (newTab === activeTab) return;
    setActiveTab(newTab);
    navigate(`/projects?tab=${newTab}`, { replace: true });
  };
  
  const handleAddProject = async () => {
    const newProject = await createProject({
      title: '새 프로젝트',
      description: '프로젝트 설명을 입력하세요',
      category: activeTab,
      tech_stack: [],
      features: [],
      development_status: 'draft'
    })
    
    if (newProject) {
      navigate(`/project/${newProject.id}`)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
    } catch (error) {
      throw error;
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 영역 */}
      <ProjectsPageHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        getContentValue={getContentValue}
        handleContentUpdate={handleContentUpdate}
      />

      {/* 프로젝트 목록 */}
      <div className={`${sectionStyles.container} pb-32`}>
        <ProjectsGrid
          projects={orderedProjects}
          loading={currentLoading}
          error={currentError}
          onProjectClick={handleProjectClick}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          onUpdateProject={updateProject}
          onDragEnd={handleDragEnd}
          isReordering={isReordering}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;