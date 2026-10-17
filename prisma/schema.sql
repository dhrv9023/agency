-- ==============================================================================
-- VARAH SYSTEMS — ENTERPRISE DATABASE SCHEMA (RAW POSTGRESQL DDL MIGRATION)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enums
CREATE TYPE user_role AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');
CREATE TYPE lead_stage AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST');
CREATE TYPE lead_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE project_status AS ENUM ('PROPOSED', 'DISCOVERY', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');
CREATE TYPE milestone_status AS ENUM ('PENDING', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED');
CREATE TYPE content_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED');
CREATE TYPE subscriber_status AS ENUM ('SUBSCRIBED', 'UNSUBSCRIBED', 'BOUNCED', 'COMPLAINED');
CREATE TYPE integration_type AS ENUM ('SMTP', 'CALENDLY', 'SLACK_WEBHOOK', 'DISCORD_WEBHOOK', 'HUBSPOT', 'STRIPE', 'CUSTOM_API_KEY');

-- 3. Automatic Updated At Function
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- USERS & AUTH
-- ------------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'VIEWER',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  two_factor_secret TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(64),
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  metadata JSONB,
  diff_before JSONB,
  diff_after JSONB,
  ip_address VARCHAR(64),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

CREATE TABLE site_settings (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'global_config',
  site_name VARCHAR(255) NOT NULL DEFAULT 'VARAH SYSTEMS',
  site_url VARCHAR(255) NOT NULL DEFAULT 'https://varah.ai',
  logo_url TEXT NOT NULL DEFAULT '/assets/logo.svg',
  contact_email VARCHAR(255) NOT NULL DEFAULT 'contact@varah.ai',
  support_email VARCHAR(255),
  phone VARCHAR(64),
  social_links JSONB,
  default_meta_title VARCHAR(255),
  default_meta_desc TEXT,
  default_og_image TEXT,
  robots_txt TEXT,
  sitemap_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type integration_type NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  config JSONB NOT NULL DEFAULT '{}',
  api_key TEXT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_integration_type_name UNIQUE (type, name)
);

CREATE TRIGGER trigger_integrations_updated_at
BEFORE UPDATE ON integrations
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ------------------------------------------------------------------------------
-- LEADS & CRM PIPELINE
-- ------------------------------------------------------------------------------
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  company VARCHAR(255),
  website VARCHAR(255),
  budget_range VARCHAR(100),
  service_interest VARCHAR(100),
  message TEXT NOT NULL,
  stage lead_stage NOT NULL DEFAULT 'NEW',
  priority lead_priority NOT NULL DEFAULT 'MEDIUM',
  is_spam BOOLEAN NOT NULL DEFAULT FALSE,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  converted_on_page VARCHAR(255),
  referrer_url TEXT,
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_assigned ON leads(assigned_to_id);
CREATE INDEX idx_leads_created ON leads(created_at);
CREATE INDEX idx_leads_spam ON leads(is_spam);

CREATE TRIGGER trigger_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_lead_notes_lead ON lead_notes(lead_id);

CREATE TRIGGER trigger_lead_notes_updated_at
BEFORE UPDATE ON lead_notes
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE lead_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  from_stage lead_stage NOT NULL,
  to_stage lead_stage NOT NULL,
  changed_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_status_hist_lead ON lead_status_history(lead_id);

CREATE TABLE lead_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_lead_attach_lead ON lead_attachments(lead_id);

CREATE TABLE lead_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  color_hex VARCHAR(16) NOT NULL DEFAULT '#00f0ff'
);

CREATE TABLE lead_tag_assignments (
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES lead_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (lead_id, tag_id)
);

-- ------------------------------------------------------------------------------
-- CLIENTS & PROJECTS
-- ------------------------------------------------------------------------------
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(64),
  billing_address TEXT,
  notes TEXT,
  converted_from_lead_id UUID UNIQUE REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'DISCOVERY',
  contract_value NUMERIC(12, 2),
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  repository_url TEXT,
  documentation_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);

CREATE TRIGGER trigger_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE project_team_members (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_in_project VARCHAR(100) NOT NULL DEFAULT 'Lead Engineer',
  PRIMARY KEY (project_id, user_id)
);

CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  status milestone_status NOT NULL DEFAULT 'PENDING',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_milestones_proj ON project_milestones(project_id, order_index);

CREATE TRIGGER trigger_milestones_updated_at
BEFORE UPDATE ON project_milestones
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INT,
  mime_type VARCHAR(100),
  category VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_project_files_proj ON project_files(project_id);

-- ------------------------------------------------------------------------------
-- CMS CONTENT
-- ------------------------------------------------------------------------------
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  short_desc TEXT NOT NULL,
  long_desc TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  connected_stack JSONB DEFAULT '[]',
  pricing_tier VARCHAR(100),
  order_index INT NOT NULL DEFAULT 0,
  status content_status NOT NULL DEFAULT 'PUBLISHED',
  meta_title VARCHAR(255),
  meta_desc TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  results JSONB NOT NULL DEFAULT '[]',
  tech_stack JSONB NOT NULL DEFAULT '[]',
  hero_image_url TEXT NOT NULL,
  gallery_urls JSONB DEFAULT '[]',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INT NOT NULL DEFAULT 0,
  status content_status NOT NULL DEFAULT 'PUBLISHED',
  meta_title VARCHAR(255),
  meta_desc TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_case_studies_updated_at
BEFORE UPDATE ON case_studies
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  tags JSONB NOT NULL DEFAULT '[]',
  reading_time_min INT NOT NULL DEFAULT 3,
  status content_status NOT NULL DEFAULT 'DRAFT',
  published_at TIMESTAMPTZ,
  meta_title VARCHAR(255),
  meta_desc TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status, published_at);

CREATE TRIGGER trigger_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  company_logo TEXT,
  avatar_url TEXT,
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_testimonials_updated_at
BEFORE UPDATE ON testimonials
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  photo_url TEXT NOT NULL,
  socials JSONB DEFAULT '{}',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_team_members_updated_at
BEFORE UPDATE ON team_members
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'General',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_faqs_updated_at
BEFORE UPDATE ON faqs
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TABLE homepage_sections (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  content_data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_homepage_sections_updated_at
BEFORE UPDATE ON homepage_sections
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ------------------------------------------------------------------------------
-- MEDIA LIBRARY
-- ------------------------------------------------------------------------------
CREATE TABLE media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  width INT,
  height INT,
  alt_text TEXT,
  folder_id UUID REFERENCES media_folders(id) ON DELETE SET NULL,
  usage_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_media_mime ON media_items(mime_type);
CREATE INDEX idx_media_folder ON media_items(folder_id);

CREATE TRIGGER trigger_media_items_updated_at
BEFORE UPDATE ON media_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ------------------------------------------------------------------------------
-- ANALYTICS & TELEMETRY
-- ------------------------------------------------------------------------------
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  pathname VARCHAR(255) NOT NULL,
  cta_target VARCHAR(100),
  referrer TEXT,
  device_type VARCHAR(50),
  browser VARCHAR(100),
  os VARCHAR(100),
  country VARCHAR(50),
  ip_hash VARCHAR(64),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_analytics_event_created ON analytics_events(event_type, created_at);
CREATE INDEX idx_analytics_path ON analytics_events(pathname);

CREATE TABLE daily_traffic_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  total_pageviews INT NOT NULL DEFAULT 0,
  unique_visitors INT NOT NULL DEFAULT 0,
  lead_submissions INT NOT NULL DEFAULT 0,
  top_sources JSONB DEFAULT '[]',
  device_breakdown JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_daily_metrics_date ON daily_traffic_metrics(date);

-- ------------------------------------------------------------------------------
-- NEWSLETTER & SUBSCRIBERS
-- ------------------------------------------------------------------------------
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(100) NOT NULL DEFAULT 'footer',
  status subscriber_status NOT NULL DEFAULT 'SUBSCRIBED',
  segment_tags JSONB DEFAULT '[]',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);
