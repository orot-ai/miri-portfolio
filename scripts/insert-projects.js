// 프로젝트 데이터를 데이터베이스에 삽입하는 스크립트
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bzlgifevnkpzkuvrywom.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bGdpZmV2bmtwemt1dnJ5d29tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQzNTU2NiwiZXhwIjoyMDY5MDExNTY2fQ.c1NL2RyNxa6nzySyP2U7YiB3yBOR-iZ-S7oDnPrpB38'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 프로젝트 데이터
const projectsData = [
  // 바이브코딩 프로젝트
  {
    title: 'SULSUL AI',
    category: 'vibe',
    description: 'AI 기반 블로그 콘텐츠 자동 생성 플랫폼',
    demo_url: 'https://sulsul-ai.com/',
    development_status: 'production',
    features: [
      'AI 기반 콘텐츠 자동 생성',
      '브랜드별 톤앤매너 커스터마이징',
      'SEO 최적화 자동 적용',
      '다양한 포맷 (블로그, 뉴스레터, SNS)',
      '실시간 콘텐츠 편집 및 수정',
      '팀 협업 기능'
    ],
    tech_stack: [
      'Frontend: React 19 + TypeScript + Vite',
      'Backend: FastAPI + Python 3.11',
      'Database: Supabase (PostgreSQL)',
      'AI: Google Gemini API',
      'Infrastructure: Vercel + Render',
      'Auth: Supabase Auth'
    ]
  },
  {
    title: 'UNIATR 홈페이지',
    category: 'vibe',
    description: '기업 웹사이트 풀스택 개발',
    tech_stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS'],
    features: ['기업 소개 페이지', '제품/서비스 소개', '반응형 디자인'],
    development_status: 'production'
  },
  {
    title: '일본어 학습 앱',
    category: 'vibe',
    description: '인터랙티브 언어 학습 플랫폼',
    tech_stack: ['React', 'PWA', 'Local Storage'],
    features: ['히라가나/가타가나 학습', '퀴즈 기능', '학습 진도 추적'],
    development_status: 'production'
  },
  
  // 자동화 프로젝트
  {
    title: '노션 차트 시스템',
    category: 'automation',
    description: '웹 기반 노션 차트 시각화 도구',
    tech_stack: ['JavaScript', 'Chart.js', 'Notion API'],
    features: ['노션 데이터 시각화', '다양한 차트 타입 지원', '실시간 업데이트'],
    development_status: 'production'
  },
  {
    title: '콘텐츠 자동 발행 시스템',
    category: 'automation',
    description: '노션 데이터베이스와 Make를 연동하여 블로그 포스트를 자동으로 여러 플랫폼에 발행',
    tech_stack: ['Notion API', 'Make', 'Automation'],
    features: ['다중 플랫폼 발행', '자동 포맷팅', '예약 발행'],
    development_status: 'production'
  },
  {
    title: '경쟁사 분석 자동화',
    category: 'automation',
    description: '매일 경쟁사 웹사이트 크롤링하여 노션 DB에 저장하고 주간 리포트 자동 생성',
    tech_stack: ['Make', 'Notion API', 'Web Scraping'],
    features: ['자동 크롤링', '데이터 분석', '주간 리포트 생성'],
    development_status: 'production'
  }
]

async function insertProjects() {
  console.log('🚀 프로젝트 데이터를 데이터베이스에 삽입 시작...')
  
  try {
    // 기존 프로젝트 데이터 확인
    const { data: existingProjects, error: fetchError } = await supabase
      .from('projects')
      .select('*')
    
    if (fetchError) {
      console.error('기존 데이터 조회 실패:', fetchError)
    } else {
      console.log(`기존 프로젝트 수: ${existingProjects?.length || 0}개`)
    }
    
    // 기존 데이터 삭제 (새로 시작)
    console.log('기존 프로젝트 데이터 삭제 중...')
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // 모든 프로젝트 삭제
    
    if (deleteError) {
      console.log('기존 데이터 삭제 실패 (무시):', deleteError.message)
    }
    
    // 새 데이터 삽입
    console.log('새로운 프로젝트 데이터 삽입 중...')
    const { data, error } = await supabase
      .from('projects')
      .insert(projectsData)
      .select()
      
    if (error) {
      console.error('❌ 데이터 삽입 실패:', error)
      throw error
    }
    
    console.log('✅ 프로젝트 삽입 완료!')
    console.log(`📊 총 ${data.length}개 프로젝트 처리됨`)
    
    // 카테고리별 통계
    const categoryStats = {}
    data.forEach(item => {
      categoryStats[item.category] = (categoryStats[item.category] || 0) + 1
    })
    
    console.log('\n📈 카테고리별 통계:')
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}개 프로젝트`)
    })
    
    console.log('\n🎉 프로젝트 데이터가 성공적으로 삽입되었습니다!')
    
    // Projects 페이지 타이틀/서브타이틀 콘텐츠 추가
    const pageContent = [
      { section: 'projects_page', field: 'page_title', content: 'All Projects' },
      { section: 'projects_page', field: 'page_subtitle', content: '바이브코딩과 자동화로 만들어낸 프로젝트들' }
    ]
    
    console.log('\n📝 Projects 페이지 콘텐츠 추가 중...')
    const { error: contentError } = await supabase
      .from('portfolio_content')
      .upsert(pageContent, {
        onConflict: 'section,field',
        ignoreDuplicates: false
      })
      
    if (contentError) {
      console.error('❌ 페이지 콘텐츠 삽입 실패:', contentError)
    } else {
      console.log('✅ Projects 페이지 콘텐츠 추가 완료!')
    }
    
  } catch (error) {
    console.error('❌ 스크립트 실행 실패:', error)
    process.exit(1)
  }
}

// 스크립트 실행
insertProjects()