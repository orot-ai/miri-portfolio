// 홈페이지의 정확한 콘텐츠를 데이터베이스에 삽입하는 스크립트
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bzlgifevnkpzkuvrywom.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bGdpZmV2bmtwemt1dnJ5d29tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQzNTU2NiwiZXhwIjoyMDY5MDExNTY2fQ.c1NL2RyNxa6nzySyP2U7YiB3yBOR-iZ-S7oDnPrpB38'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 홈페이지의 정확한 콘텐츠 데이터
const contentData = [
  // Hero Section
  { section: 'hero', field: 'title_line1', content: 'CREATIVE' },
  { section: 'hero', field: 'title_line2', content: 'DEVELOPER' },
  { section: 'hero', field: 'title_line3', content: '& DESIGNER' },
  { section: 'hero', field: 'subtitle', content: '바이브코딩으로 만드는 디지털 경험' },
  { section: 'hero', field: 'cta_button', content: '프로젝트 보기' },
  { section: 'hero', field: 'floating_year', content: '2025' },
  { section: 'hero', field: 'floating_location', content: 'SEOUL' },
  { section: 'hero', field: 'floating_portfolio', content: 'PORTFOLIO' },
  
  // About Section
  { section: 'about', field: 'main_title_line1', content: '생각이 끝나기 전에' },
  { section: 'about', field: 'main_title_line2', content: '프로토타입이' },
  { section: 'about', field: 'main_title_line3', content: '돌아갑니다' },
  { section: 'about', field: 'description_line1', content: '복잡한 일상을 단순하게, 반복되는 업무를 자동화로' },
  { section: 'about', field: 'description_line2', content: '당신의 시간을 더 가치있게 만듭니다.' },
  { section: 'about', field: 'detail_01', content: 'AI 기반 자동화' },
  { section: 'about', field: 'detail_02', content: '바이브코딩 & 교육' },
  { section: 'about', field: 'detail_03', content: '효율성 극대화' },
  
  // Work Process Section
  { section: 'work_process', field: 'title_line1', content: 'MY' },
  { section: 'work_process', field: 'title_line2', content: 'WORK' },
  { section: 'work_process', field: 'step01_title', content: '기획 & 구조 설계' },
  { section: 'work_process', field: 'step01_description', content: '사용자 관점에서 시작해 전체 시스템을 설계합니다' },
  { section: 'work_process', field: 'step02_title', content: '빠른 프로토타입' },
  { section: 'work_process', field: 'step02_description', content: '핵심 기능부터 구현하여 빠르게 검증합니다' },
  { section: 'work_process', field: 'step03_title', content: '자동화 & 최적화' },
  { section: 'work_process', field: 'step03_description', content: '반복 작업을 자동화하고 시스템을 개선합니다' },
  { section: 'work_process', field: 'step04_title', content: '결과물 완성' },
  { section: 'work_process', field: 'step04_description', content: '품질을 타협하지 않고 완성도 있게 마무리합니다' },
  
  // Projects Section  
  { section: 'projects', field: 'section_subtitle', content: 'SELECTED WORKS' },
  { section: 'projects', field: 'section_title', content: 'Projects' },
  { section: 'projects', field: 'vibe_title', content: 'VIBE CODING' },
  { section: 'projects', field: 'vibe_subtitle', content: '생각이 끝나기 전에 프로토타입이 돌아가는 개발' },
  { section: 'projects', field: 'automation_title', content: 'AUTOMATION' },
  { section: 'projects', field: 'automation_subtitle', content: '반복 작업을 자동화하여 시간을 아끼는 시스템' },
  
  // Contact Section
  { section: 'contact', field: 'section_subtitle', content: 'GET IN TOUCH' },
  { section: 'contact', field: 'section_title', content: '함께 만들어보세요' },
  { section: 'contact', field: 'description', content: '새로운 프로젝트, 협업 제안, 또는 단순한 안녕 인사도 좋습니다.\n언제든 연락주세요!' },
  { section: 'contact', field: 'cta_text', content: '프로젝트 문의나 협업 제안이 있으시면 언제든 연락주세요.' },
  { section: 'contact', field: 'cta_button', content: '프로젝트 문의하기' },
  { section: 'contact', field: 'email', content: 'contact@miri.dev' },
  { section: 'contact', field: 'threads', content: '@miri_threads' },
  { section: 'contact', field: 'kakao', content: '1:1 채팅' },
  { section: 'contact', field: 'kakao_link', content: 'https://pf.kakao.com/_example' },
  { section: 'contact', field: 'opentalk', content: '바이브코딩 커뮤니티' },
  { section: 'contact', field: 'opentalk_link', content: 'https://open.kakao.com/o/example' }
]

async function insertContent() {
  console.log('🚀 홈페이지 정확한 콘텐츠를 데이터베이스에 삽입 시작...')
  
  try {
    // UPSERT로 데이터 삽입/업데이트 (기존 데이터가 있으면 업데이트, 없으면 삽입)
    console.log('콘텐츠 데이터 UPSERT 중...')
    const { data, error } = await supabase
      .from('portfolio_content')
      .upsert(contentData, {
        onConflict: 'section,field', // section, field 조합이 중복되면 업데이트
        ignoreDuplicates: false
      })
      .select()
      
    if (error) {
      console.error('❌ 데이터 삽입 실패:', error)
      throw error
    }
    
    console.log('✅ 콘텐츠 삽입 완료!')
    console.log(`📊 총 ${data.length}개 항목 삽입됨`)
    
    // 섹션별 통계
    const sectionStats = {}
    data.forEach(item => {
      sectionStats[item.section] = (sectionStats[item.section] || 0) + 1
    })
    
    console.log('\n📈 섹션별 통계:')
    Object.entries(sectionStats).forEach(([section, count]) => {
      console.log(`  ${section}: ${count}개 항목`)
    })
    
    console.log('\n🎉 데이터베이스에 홈페이지의 정확한 콘텐츠가 성공적으로 삽입되었습니다!')
    console.log('이제 관리자 페이지와 홈페이지의 내용이 완벽히 일치합니다.')
    
  } catch (error) {
    console.error('❌ 스크립트 실행 실패:', error)
    process.exit(1)
  }
}

// 스크립트 실행
insertContent()