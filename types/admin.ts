/**
 * ==============================================================================
 * VARAH SYSTEMS — ENTERPRISE ADMIN PLATFORM TYPE DEFINITIONS
 * Strict TypeScript Types (Zero `any`)
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. RBAC & AUTHENTICATION
// ------------------------------------------------------------------------------

export type UserRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: string;
}

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'export'
  | 'manage_team'
  | 'manage_settings'
  | 'view_audit_logs';

export type PermissionResource =
  | 'leads'
  | 'clients'
  | 'projects'
  | 'cms'
  | 'media'
  | 'analytics'
  | 'newsletter'
  | 'settings'
  | 'team'
  | 'audit';

// ------------------------------------------------------------------------------
// 2. LEADS & CRM PIPELINE
// ------------------------------------------------------------------------------

export type LeadStage =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL_SENT'
  | 'WON'
  | 'LOST';

export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface LeadTag {
  id: string;
  name: string;
  colorHex: string;
}

export interface LeadAttachment {
  id: string;
  leadId: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadStatusHistory {
  id: string;
  leadId: string;
  fromStage: LeadStage;
  toStage: LeadStage;
  changedById: string | null;
  changedByName: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website: string | null;
  budgetRange: string | null;
  serviceInterest: string | null;
  message: string;
  stage: LeadStage;
  priority: LeadPriority;
  isSpam: boolean;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  convertedOnPage: string | null;
  referrerUrl: string | null;
  assignedToId: string | null;
  assignedToName: string | null;
  assignedToAvatar: string | null;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tags: LeadTag[];
  notesCount: number;
  attachmentsCount: number;
}

export interface KanbanColumn {
  id: LeadStage;
  title: string;
  colorHex: string;
  leadIds: string[];
}

export interface KanbanState {
  columns: Record<LeadStage, KanbanColumn>;
  leadsById: Record<string, Lead>;
}

// ------------------------------------------------------------------------------
// 3. CLIENTS & PROJECTS
// ------------------------------------------------------------------------------

export type ProjectStatus =
  | 'PROPOSED'
  | 'DISCOVERY'
  | 'ACTIVE'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED';

export type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  billingAddress: string | null;
  notes: string | null;
  convertedFromLeadId: string | null;
  projectsCount: number;
  activeProjectsCount: number;
  totalContractValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  order: number;
  status: MilestoneStatus;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  title: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  category: string | null;
  createdAt: string;
}

export interface ProjectTeamMember {
  userId: string;
  name: string;
  avatarUrl: string | null;
  roleInProject: string;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  title: string;
  code: string;
  description: string | null;
  status: ProjectStatus;
  contractValue: number | null;
  startDate: string | null;
  targetEndDate: string | null;
  actualEndDate: string | null;
  repositoryUrl: string | null;
  documentationUrl: string | null;
  teamMembers: ProjectTeamMember[];
  milestones: ProjectMilestone[];
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// 4. CMS (CONTENT MANAGEMENT)
// ------------------------------------------------------------------------------

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED';

export interface CMSService {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  icon: string;
  features: string[];
  connectedStack: string[];
  pricingTier: string | null;
  order: number;
  status: ContentStatus;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudyResult {
  metric: string;
  value: string;
  change?: string;
}

export interface CMSCaseStudy {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  industry: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  techStack: string[];
  heroImageUrl: string;
  galleryUrls: string[];
  featured: boolean;
  order: number;
  status: ContentStatus;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CMSPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string; // Markdown / rich text AST JSON string
  coverImage: string | null;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  tags: string[];
  readingTimeMin: number;
  status: ContentStatus;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CMSTestimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  companyName: string;
  companyLogo: string | null;
  avatarUrl: string | null;
  rating: number;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CMSTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CMSFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CMSHomepageSection {
  id: string; // "hero" | "stats_strip" | "what_we_build" | "logos_strip"
  name: string;
  contentData: Record<string, unknown>;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// 5. MEDIA LIBRARY
// ------------------------------------------------------------------------------

export interface MediaFolder {
  id: string;
  name: string;
  slug: string;
  fileCount: number;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  fileSize: number;
  mimeType: string;
  width: number | null;
  height: number | null;
  altText: string | null;
  folderId: string | null;
  folderName: string | null;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// 6. ANALYTICS & DASHBOARD KPIS
// ------------------------------------------------------------------------------

export interface KPICardData {
  title: string;
  currentValue: number | string;
  previousValue: number | string;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
  isPositive: boolean;
  formattedValue: string;
}

export interface DashboardMetrics {
  kpis: {
    newLeads30d: KPICardData;
    conversionRate: KPICardData;
    activeProjects: KPICardData;
    pipelineRevenue: KPICardData;
    totalTraffic: KPICardData;
    avgResponseMinutes: KPICardData;
  };
  leadsOverTime: Array<{
    date: string;
    leads: number;
    qualified: number;
  }>;
  leadSourceBreakdown: Array<{
    source: string;
    count: number;
    percentage: number;
    colorHex: string;
  }>;
  funnelStages: Array<{
    stage: LeadStage;
    label: string;
    count: number;
    conversionRate: number;
  }>;
  needsAttentionLeads: Lead[];
  recentActivity: Array<{
    id: string;
    type: 'LEAD' | 'PROJECT' | 'CONTENT' | 'SYSTEM';
    action: string;
    title: string;
    timestamp: string;
    user: {
      name: string;
      avatarUrl: string | null;
    };
  }>;
}

// ------------------------------------------------------------------------------
// 7. NEWSLETTER & SUBSCRIBERS
// ------------------------------------------------------------------------------

export type SubscriberStatus = 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'BOUNCED' | 'COMPLAINED';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string;
  status: SubscriberStatus;
  segmentTags: string[];
  subscribedAt: string;
  unsubscribedAt: string | null;
}

export interface NewsletterBroadcast {
  id: string;
  subject: string;
  previewText: string;
  body: string;
  targetTags: string[];
  status: 'DRAFT' | 'SENT' | 'SCHEDULED';
  sentAt: string | null;
  scheduledFor: string | null;
  recipientCount: number;
  openRate: number;
  clickRate: number;
  createdAt: string;
}

// ------------------------------------------------------------------------------
// 8. SETTINGS, INTEGRATIONS & AUDIT
// ------------------------------------------------------------------------------

export type IntegrationType =
  | 'SMTP'
  | 'CALENDLY'
  | 'SLACK_WEBHOOK'
  | 'DISCORD_WEBHOOK'
  | 'HUBSPOT'
  | 'STRIPE'
  | 'CUSTOM_API_KEY';

export interface IntegrationRecord {
  id: string;
  type: IntegrationType;
  name: string;
  description: string | null;
  isEnabled: boolean;
  configMasked: Record<string, string>;
  apiKeyMasked: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettingsData {
  siteName: string;
  siteUrl: string;
  logoUrl: string;
  contactEmail: string;
  supportEmail: string | null;
  phone: string | null;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  defaultMetaTitle: string | null;
  defaultMetaDesc: string | null;
  defaultOgImage: string | null;
  robotsTxt: string | null;
  sitemapEnabled: boolean;
  updatedAt: string;
}

export interface AuditLogRecord {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  diffBefore: Record<string, unknown> | null;
  diffAfter: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

// ------------------------------------------------------------------------------
// 9. QUERY, FILTER & PAGINATION ENVELOPES
// ------------------------------------------------------------------------------

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams<T = string> {
  sortBy: T;
  sortOrder: 'asc' | 'desc';
}

export interface DateRangeFilter {
  from: string; // ISO string
  to: string;   // ISO string
}

export interface LeadFilterParams extends PaginationParams, SortParams<keyof Lead> {
  search?: string;
  stages?: LeadStage[];
  priorities?: LeadPriority[];
  assignedToId?: string;
  dateRange?: DateRangeFilter;
  isSpam?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type ActionResponse<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; validationErrors?: Record<string, string[]> };
