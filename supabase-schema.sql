-- 포트폴리오 콘텐츠 테이블 (홈페이지의 모든 텍스트 콘텐츠)
CREATE TABLE portfolio_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(50) NOT NULL, -- 'hero', 'about', 'projects', 'contact' 등
  field VARCHAR(50) NOT NULL,   -- 'title', 'description', 'subtitle' 등
  content TEXT NOT NULL,
  content_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'json'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 프로젝트 테이블
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  tech_stack TEXT[], -- PostgreSQL 배열 타입
  category VARCHAR(20) DEFAULT 'vibe', -- 'vibe' 또는 'automation'
  features TEXT[],
  development_status VARCHAR(50),
  github_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사이트 설정 테이블
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 미디어 파일 테이블
CREATE TABLE media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 업데이트 트리거 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 적용
CREATE TRIGGER update_portfolio_content_updated_at 
  BEFORE UPDATE ON portfolio_content 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at 
  BEFORE UPDATE ON site_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 초기 데이터 삽입
INSERT INTO portfolio_content (section, field, content) VALUES
('hero', 'title', '안녕하세요, MIRI입니다'),
('hero', 'subtitle', '바이브코딩으로 만드는 웹 개발자'),
('hero', 'description', '생각이 끝나기 전에 프로토타입이 돌아갑니다'),
('about', 'title', '바이브코딩이란?'),
('about', 'description', '빠른 프로토타이핑과 반복적 개선을 통한 개발 방법론입니다.'),
('contact', 'email', 'contact@miri.dev'),
('contact', 'github', 'https://github.com/miri'),
('work_process', 'step1', '문제 정의'),
('work_process', 'step2', '아이디어 구상'),
('work_process', 'step3', '프로토타입 개발'),
('work_process', 'step4', '사용자 피드백');

INSERT INTO projects (title, description, category, tech_stack, features, development_status) VALUES
('바이브코딩 포트폴리오', '미니멀하고 현대적인 포트폴리오 웹사이트', 'vibe', 
 ARRAY['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'], 
 ARRAY['반응형 디자인', '쓸어나가기 애니메이션', '미니멀 UI'], 
 '개발 완료'),
('자동화 도구 모음', '개발 업무를 자동화하는 도구들', 'automation', 
 ARRAY['Python', 'Node.js', 'GitHub Actions'], 
 ARRAY['CI/CD 자동화', '코드 품질 검사', '배포 자동화'], 
 '개발 중');

INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('site_title', 'MIRI Portfolio', '사이트 제목'),
('primary_color', '#7C3AED', '메인 컬러'),
('contact_email', 'contact@miri.dev', '연락처 이메일'),
('github_url', 'https://github.com/miri', 'GitHub 프로필 URL');