import { supabase, supabaseAdmin, PortfolioContent, SiteSettings, MediaFile } from './supabase'
import { Project } from '@/types'
import { logger } from '@/utils/logger'

export class AdminAPI {
  // 포트폴리오 콘텐츠 관련 메서드
  static async getPortfolioContent(): Promise<PortfolioContent[]> {
    const { data, error } = await supabase
      .from('portfolio_content')
      .select('*')
      .order('section', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  static async getContentBySection(section: string): Promise<PortfolioContent[]> {
    const { data, error } = await supabase
      .from('portfolio_content')
      .select('*')
      .eq('section', section)
      .order('field', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  static async updateContent(id: string, content: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('portfolio_content')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
  }

  static async createContent(section: string, field: string, content: string, contentType = 'text'): Promise<PortfolioContent> {
    const { data, error } = await supabaseAdmin
      .from('portfolio_content')
      .insert({
        section,
        field,
        content,
        content_type: contentType
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // 프로젝트 관련 메서드
  static async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getProjectsByCategory(category: 'vibe' | 'automation'): Promise<Project[]> {
    try {
      // order_index 우선 정렬, null인 경우 뒤로 정렬하고 created_at으로 2차 정렬
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('category', category)
        .order('order_index', { ascending: true, nullsLast: true })
        .order('created_at', { ascending: false })
      
      if (error) {
        logger.error('Failed to fetch projects by category:', error)
        throw new Error(`프로젝트를 불러오는데 실패했습니다: ${error.message}`)
      }
      
      return data || []
    } catch (error) {
      logger.error('Error in getProjectsByCategory:', error)
      throw error
    }
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
  }

  static async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(projectData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteProject(id: string): Promise<void> {
    logger.info('프로젝트 삭제 시도:', id)
    
    const { data, error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
      .select() // 삭제된 데이터 반환
    
    if (error) {
      logger.error('프로젝트 삭제 실패:', error)
      throw error
    }
    
    logger.info('프로젝트 삭제 성공:', data)
  }

  static async updateProjectsOrder(projects: { id: string; order_index: number }[]): Promise<void> {
    // 각 프로젝트의 order_index를 개별적으로 업데이트
    const updatePromises = projects.map(({ id, order_index }) =>
      supabaseAdmin
        .from('projects')
        .update({ order_index, updated_at: new Date().toISOString() })
        .eq('id', id)
    );

    const results = await Promise.all(updatePromises);
    
    // 에러가 있는지 확인
    for (const result of results) {
      if (result.error) throw result.error;
    }
  }

  // 사이트 설정 관련 메서드
  static async getSiteSettings(): Promise<SiteSettings[]> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('setting_key', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  static async updateSetting(key: string, value: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      })
    
    if (error) throw error
  }

  // 미디어 파일 관련 메서드
  static async uploadFile(file: File, path: string): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `${path}/${fileName}`
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from('portfolio-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })
    
    if (uploadError) throw uploadError
    
    // 공개 URL 반환
    const { data } = supabaseAdmin.storage
      .from('portfolio-images')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }

  static async getMediaFiles(): Promise<any[]> {
    // 스토리지에서 직접 파일 목록 조회
    const { data, error } = await supabaseAdmin.storage
      .from('portfolio-images')
      .list('', {
        limit: 100,
        offset: 0
      })
    
    if (error) throw error
    return data || []
  }

  static async deleteFile(filePath: string): Promise<void> {
    // 스토리지에서 파일 삭제
    const { error: storageError } = await supabaseAdmin.storage
      .from('portfolio-images')
      .remove([filePath])
    
    if (storageError) throw storageError
  }
}