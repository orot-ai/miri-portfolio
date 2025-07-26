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
      logger.info(`Fetching projects for category: ${category}`)
      
      // 먼저 order_index를 포함해서 시도
      let { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('category', category)
        .order('order_index', { ascending: true, nullsLast: true })
        .order('created_at', { ascending: false })
      
      // order_index 컬럼이 없으면 fallback 쿼리 실행
      if (error && error.code === '42703') {
        logger.warn('order_index column not found, using fallback query')
        const fallbackResult = await supabase
          .from('projects')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false })
        
        data = fallbackResult.data
        error = fallbackResult.error
      }
      
      if (error) {
        logger.error('Failed to fetch projects by category:', error)
        throw new Error(`프로젝트를 불러오는데 실패했습니다: ${error.message}`)
      }
      
      logger.info(`Successfully fetched ${data?.length || 0} projects for category: ${category}`)
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
    
    try {
      // 먼저 프로젝트가 존재하는지 확인
      const { data: existingProject, error: fetchError } = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      
      if (fetchError) {
        throw new Error(`프로젝트를 찾을 수 없습니다: ${fetchError.message}`)
      }
      
      // 프로젝트 삭제
      const { data, error } = await supabaseAdmin
        .from('projects')
        .delete()
        .eq('id', id)
        .select() // 삭제된 데이터 반환
      
      if (error) {
        logger.error('프로젝트 삭제 실패:', error)
        throw new Error(`프로젝트 삭제 실패: ${error.message}`)
      }
      
      logger.info('프로젝트 삭제 성공:', data)
    } catch (error) {
      throw error
    }
  }

  static async updateProjectsOrder(projects: { id: string; order_index: number }[]): Promise<void> {
    try {
      logger.info('Updating projects order:', projects.length)
      
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
        if (result.error) {
          // order_index 컬럼이 없으면 경고만 로그하고 계속 진행
          if (result.error.code === '42703') {
            logger.warn('order_index column not found, skipping order update')
            return
          }
          throw result.error;
        }
      }
      
      logger.info('Successfully updated projects order')
    } catch (error) {
      logger.error('Error updating projects order:', error)
      throw error
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
    
    // 파일 크기 제한 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('파일 크기가 10MB를 초과합니다. 더 작은 파일을 선택해주세요.')
    }
    
    logger.info('파일 업로드 시작:', { fileName, fileSize: file.size, filePath })
    
    try {
      // 재시도 로직 (최대 3회)
      let uploadError: any = null
      let retryCount = 0
      const maxRetries = 3
      
      while (retryCount < maxRetries) {
        try {
          const { data, error } = await supabaseAdmin.storage
            .from('portfolio-images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true
            })
          
          if (!error) {
            logger.info('파일 업로드 성공:', { fileName, retryCount })
            break
          }
          
          uploadError = error
          retryCount++
          
          if (retryCount < maxRetries) {
            logger.warn(`파일 업로드 실패, 재시도 ${retryCount}/${maxRetries}:`, error)
            // 지수적 백오프: 1초, 2초, 4초 대기
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)))
          }
        } catch (networkError) {
          uploadError = networkError
          retryCount++
          
          if (retryCount < maxRetries) {
            logger.warn(`네트워크 오류 발생, 재시도 ${retryCount}/${maxRetries}:`, networkError)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)))
          }
        }
      }
      
      if (uploadError) {
        logger.error('파일 업로드 최종 실패:', uploadError)
        
        // 구체적인 오류 메시지 제공
        if (uploadError.message?.includes('504')) {
          throw new Error('서버 응답 시간 초과입니다. 잠시 후 다시 시도해주세요.')
        } else if (uploadError.message?.includes('413')) {
          throw new Error('파일이 너무 큽니다. 더 작은 파일을 선택해주세요.')
        } else if (uploadError.message?.includes('401') || uploadError.message?.includes('403')) {
          throw new Error('인증에 실패했습니다. 페이지를 새로고침하고 다시 시도해주세요.')
        } else {
          throw new Error(`파일 업로드에 실패했습니다: ${uploadError.message || '알 수 없는 오류'}`)
        }
      }
      
      // 공개 URL 반환
      const { data } = supabaseAdmin.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)
      
      logger.info('공개 URL 생성 완료:', data.publicUrl)
      return data.publicUrl
      
    } catch (error) {
      logger.error('uploadFile 전체 오류:', error)
      throw error
    }
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