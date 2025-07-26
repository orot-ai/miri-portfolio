-- 포트폴리오 데이터베이스 초기 설정 SQL
-- 이 파일을 Supabase SQL Editor에서 실행해주세요

-- 1. portfolio_content 테이블 생성
CREATE TABLE IF NOT EXISTS portfolio_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    field VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    content_type VARCHAR(20) DEFAULT 'text',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section, field)
);

-- 2. projects 테이블 생성
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT,
    tech_stack TEXT[],
    category VARCHAR(50),
    features TEXT[],
    development_status VARCHAR(20) DEFAULT 'completed',
    github_url TEXT,
    demo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. site_settings 테이블 생성
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. media_files 테이블 생성
CREATE TABLE IF NOT EXISTS media_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 업데이트 트리거를 위한 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 생성
CREATE TRIGGER update_portfolio_content_updated_at BEFORE UPDATE ON portfolio_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. portfolio_content 초기 데이터 삽입
INSERT INTO portfolio_content (section, field, content, content_type) VALUES
('hero', 'title', '안녕하세요, 미리입니다', 'text'),
('hero', 'subtitle', '창의적인 아이디어를 현실로 만드는 개발자', 'text'),
('hero', 'description', '사용자 중심의 웹 애플리케이션과 혁신적인 디지털 솔루션을 개발합니다. 새로운 기술을 배우고 적용하는 것을 즐기며, 항상 더 나은 사용자 경험을 추구합니다.', 'text'),
('about', 'title', 'About Me', 'text'),
('about', 'content', '저는 웹 개발과 AI 기술에 열정을 가진 개발자입니다. React, Node.js, Python 등 다양한 기술 스택을 활용하여 사용자에게 가치를 제공하는 애플리케이션을 만들고 있습니다. 특히 AI를 활용한 콘텐츠 생성과 자동화 시스템 개발에 관심이 많습니다.', 'text'),
('skills', 'title', 'Skills', 'text'),
('contact', 'title', 'Contact', 'text'),
('contact', 'email', 'miri@example.com', 'text'),
('contact', 'github', 'https://github.com/miri', 'url'),
('contact', 'linkedin', 'https://linkedin.com/in/miri', 'url');

-- 6. projects 초기 데이터 삽입
INSERT INTO projects (title, description, tech_stack, category, features, development_status, github_url, demo_url) VALUES
('BlogSaaS v3.1', 'AI 기반 블로그 콘텐츠 자동 생성 플랫폼', 
 ARRAY['React', 'TypeScript', 'FastAPI', 'Python', 'Supabase', 'Google Gemini AI', 'Tailwind CSS'], 
 'Web Application', 
 ARRAY['AI 콘텐츠 생성', '구글 OAuth 인증', '구독 기반 서비스', '실시간 콘텐츠 편집', '브랜드 커스터마이징'],
 'completed',
 'https://github.com/miri/blogsaas',
 'https://sulsul-ai.vercel.app/'),

('UNIATR 홈페이지', '기업 홈페이지 및 제한적 CMS 시스템',
 ARRAY['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Vercel'],
 'Corporate Website',
 ARRAY['반응형 디자인', '성능 최적화', 'SEO 최적화', '관리자 페이지'],
 'completed',
 'https://github.com/miri/uniatr-website',
 'https://uniatr.com'),

('일본어 학습 앱', '한국어 사용자를 위한 일본어 학습 웹 애플리케이션',
 ARRAY['React', 'JavaScript', 'CSS3', 'Local Storage'],
 'Educational App',
 ARRAY['학습 진도 추적', '퀴즈 시스템', '발음 가이드', '레벨별 학습'],
 'in-progress',
 'https://github.com/miri/japanese-learning-app',
 'https://japanese-learn.netlify.app'),

('부동산 데이터 수집기', '한국 부동산 정보 자동 수집 및 분석 시스템',
 ARRAY['Python', 'Pandas', 'Requests', 'BeautifulSoup', 'Excel'],
 'Data Analysis',
 ARRAY['청약 정보 수집', '금리 정보 분석', '데이터 시각화', '자동 리포트 생성'],
 'completed',
 'https://github.com/miri/real-estate-scraper',
 NULL),

('노션 차트 시스템', '노션 데이터 기반 차트 시각화 도구',
 ARRAY['HTML', 'CSS', 'JavaScript', 'Chart.js', 'Notion API'],
 'Data Visualization',
 ARRAY['실시간 데이터 연동', '다양한 차트 타입', '반응형 대시보드', '데이터 필터링'],
 'completed',
 'https://github.com/miri/notion-chart-system',
 'https://miri.github.io/notion-chart-system');

-- 7. site_settings 초기 데이터 삽입
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('site_title', '미리 포트폴리오', '사이트 제목'),
('site_description', '창의적인 아이디어를 현실로 만드는 개발자 미리의 포트폴리오입니다.', '사이트 설명'),
('theme_color', '#3B82F6', '사이트 테마 컬러'),
('contact_email', 'miri@example.com', '연락처 이메일'),
('github_profile', 'https://github.com/miri', 'GitHub 프로필 URL'),
('linkedin_profile', 'https://linkedin.com/in/miri', 'LinkedIn 프로필 URL'),
('show_projects', 'true', '프로젝트 섹션 표시 여부'),
('projects_per_page', '6', '페이지당 프로젝트 표시 개수'),
('enable_dark_mode', 'true', '다크 모드 지원 여부'),
('google_analytics_id', '', 'Google Analytics 추적 ID');

-- 8. RLS (Row Level Security) 정책 설정 (선택사항)
-- 공개 포트폴리오이므로 읽기 권한을 모든 사용자에게 부여
ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- 읽기 권한 정책 (모든 사용자)
CREATE POLICY "Allow read access for all users" ON portfolio_content FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON media_files FOR SELECT USING (true);

-- 쓰기 권한은 인증된 사용자만 (향후 관리자 기능을 위해)
-- CREATE POLICY "Allow insert for authenticated users" ON portfolio_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Allow update for authenticated users" ON portfolio_content FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow delete for authenticated users" ON portfolio_content FOR DELETE USING (auth.role() = 'authenticated');