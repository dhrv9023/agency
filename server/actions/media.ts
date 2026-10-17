'use server';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SERVER ACTIONS: MEDIA LIBRARY
 * Asset CDN storage, folder organization, usage attribution, and upload management
 * ==============================================================================
 */

import { getSession } from '@/lib/auth/session';
import { assertPermission } from '@/lib/rbac/permissions';
import type { MediaFolder, MediaItem } from '@/types/admin';

// Seed Folders
let foldersStore: MediaFolder[] = [
  { id: 'fld_all', name: 'All Media', slug: 'all', fileCount: 8, createdAt: new Date().toISOString() },
  { id: 'fld_case_studies', name: 'Case Studies', slug: 'case-studies', fileCount: 3, createdAt: new Date().toISOString() },
  { id: 'fld_blueprints', name: 'Architecture Blueprints', slug: 'blueprints', fileCount: 2, createdAt: new Date().toISOString() },
  { id: 'fld_brand', name: 'Brand & Emblems', slug: 'brand', fileCount: 2, createdAt: new Date().toISOString() },
  { id: 'fld_uploads', name: 'General Uploads', slug: 'uploads', fileCount: 1, createdAt: new Date().toISOString() },
];

// Seed Media Assets
let mediaStore: MediaItem[] = [
  {
    id: 'med_001',
    filename: 'varah-autonomous-pipeline.svg',
    originalName: 'varah-autonomous-pipeline.svg',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    fileSize: 148520, // ~148 KB
    mimeType: 'image/svg+xml',
    width: 1920,
    height: 1080,
    altText: 'VARAH SYSTEMS Autonomous Multi-Agent Pipeline Architecture',
    folderId: 'fld_blueprints',
    folderName: 'Architecture Blueprints',
    usageCount: 4, // Used on homepage & solutions
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'med_002',
    filename: 'acme-supply-chain-case-study.webp',
    originalName: 'acme-supply-chain-case-study.webp',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    fileSize: 324100, // ~324 KB
    mimeType: 'image/webp',
    width: 1600,
    height: 900,
    altText: 'Acme Supply Chain Autonomous ERP Document Extraction Case Study',
    folderId: 'fld_case_studies',
    folderName: 'Case Studies',
    usageCount: 2,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'med_003',
    filename: 'apex-health-patient-intake.webp',
    originalName: 'apex-health-patient-intake.webp',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    fileSize: 289400,
    mimeType: 'image/webp',
    width: 1600,
    height: 900,
    altText: 'Apex Health Systems HIPAA-Compliant Voice and Web Intake Agent',
    folderId: 'fld_case_studies',
    folderName: 'Case Studies',
    usageCount: 1,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'med_004',
    filename: 'horizon-capital-cims-parser.webp',
    originalName: 'horizon-capital-cims-parser.webp',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    fileSize: 245100,
    mimeType: 'image/webp',
    width: 1600,
    height: 900,
    altText: 'Horizon Capital PE Investment Memo Extraction Workflow',
    folderId: 'fld_case_studies',
    folderName: 'Case Studies',
    usageCount: 1,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'med_005',
    filename: 'neural-topology-vector-diagram.svg',
    originalName: 'neural-topology-vector-diagram.svg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    fileSize: 112000,
    mimeType: 'image/svg+xml',
    width: 1200,
    height: 800,
    altText: 'High-Dimensional Vector Embedding & Retrieval Topology Diagram',
    folderId: 'fld_blueprints',
    folderName: 'Architecture Blueprints',
    usageCount: 3,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'med_006',
    filename: 'varah-monochrome-emblem.svg',
    originalName: 'varah-monochrome-emblem.svg',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    fileSize: 42000,
    mimeType: 'image/svg+xml',
    width: 512,
    height: 512,
    altText: 'VARAH SYSTEMS Official Vector Brand Emblem',
    folderId: 'fld_brand',
    folderName: 'Brand & Emblems',
    usageCount: 12,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'med_007',
    filename: 'varah-cyan-glow-badge.png',
    originalName: 'varah-cyan-glow-badge.png',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    fileSize: 85400,
    mimeType: 'image/png',
    width: 512,
    height: 512,
    altText: 'VARAH SYSTEMS Cyan Glow Hologram Badge',
    folderId: 'fld_brand',
    folderName: 'Brand & Emblems',
    usageCount: 6,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'med_008',
    filename: 'enterprise-security-spec.pdf',
    originalName: 'enterprise-security-spec.pdf',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    fileSize: 1420500, // 1.42 MB
    mimeType: 'application/pdf',
    width: null,
    height: null,
    altText: 'Enterprise Security & SOC2 Compliance Whitepaper',
    folderId: 'fld_uploads',
    folderName: 'General Uploads',
    usageCount: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export interface GetMediaParams {
  folderId?: string;
  query?: string;
  mimeGroup?: 'image' | 'svg' | 'document' | 'all';
}

export interface GetMediaResult {
  items: MediaItem[];
  folders: MediaFolder[];
  totalSize: number;
}

/**
 * Fetch organized media library assets with folder filtering
 */
export async function getMediaItemsAction(params: GetMediaParams = {}): Promise<GetMediaResult> {
  const session = assertPermission(await getSession(), 'media', 'view');

  const { folderId = 'fld_all', query = '', mimeGroup = 'all' } = params;

  let filtered = [...mediaStore];

  if (folderId && folderId !== 'fld_all') {
    filtered = filtered.filter((item) => item.folderId === folderId);
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.filename.toLowerCase().includes(q) ||
        (item.altText && item.altText.toLowerCase().includes(q))
    );
  }

  if (mimeGroup !== 'all') {
    if (mimeGroup === 'image') filtered = filtered.filter((i) => i.mimeType.startsWith('image/') && !i.mimeType.includes('svg'));
    if (mimeGroup === 'svg') filtered = filtered.filter((i) => i.mimeType.includes('svg'));
    if (mimeGroup === 'document') filtered = filtered.filter((i) => i.mimeType.includes('pdf') || i.mimeType.includes('document'));
  }

  const totalSize = mediaStore.reduce((acc, curr) => acc + curr.fileSize, 0);

  return {
    items: filtered,
    folders: foldersStore,
    totalSize,
  };
}

export interface UploadMediaInput {
  filename: string;
  fileSize: number;
  mimeType: string;
  url?: string;
  width?: number | null;
  height?: number | null;
  altText?: string;
  folderId?: string;
}

/**
 * Register a newly uploaded media asset with CDN metadata
 */
export async function uploadMediaAction(input: UploadMediaInput): Promise<MediaItem> {
  const session = assertPermission(await getSession(), 'media', 'create');

  const folder = foldersStore.find((f) => f.id === input.folderId) || foldersStore[1];

  const newItem: MediaItem = {
    id: `med_${Date.now().toString(36)}`,
    filename: input.filename.trim(),
    originalName: input.filename.trim(),
    url: input.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    fileSize: input.fileSize || 185000,
    mimeType: input.mimeType || 'image/webp',
    width: input.width || 1200,
    height: input.height || 800,
    altText: input.altText || input.filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    folderId: folder.id,
    folderName: folder.name,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mediaStore.unshift(newItem);

  // Update folder count
  const fIndex = foldersStore.findIndex((f) => f.id === folder.id);
  if (fIndex !== -1) {
    foldersStore[fIndex] = {
      ...foldersStore[fIndex],
      fileCount: foldersStore[fIndex].fileCount + 1,
    };
  }

  return newItem;
}

/**
 * Update asset metadata (altText, filename, folder)
 */
export async function updateMediaAction(
  id: string,
  updates: { altText?: string; filename?: string; folderId?: string }
): Promise<MediaItem> {
  const session = assertPermission(await getSession(), 'media', 'edit');

  const itemIndex = mediaStore.findIndex((m) => m.id === id);
  if (itemIndex === -1) throw new Error('Asset not found.');

  const folder = updates.folderId
    ? foldersStore.find((f) => f.id === updates.folderId)
    : undefined;

  mediaStore[itemIndex] = {
    ...mediaStore[itemIndex],
    ...updates,
    folderName: folder ? folder.name : mediaStore[itemIndex].folderName,
    updatedAt: new Date().toISOString(),
  };

  return mediaStore[itemIndex];
}

/**
 * Delete a media asset (checks usage count safety)
 */
export async function deleteMediaAction(
  id: string,
  force: boolean = false
): Promise<{ success: boolean }> {
  const session = assertPermission(await getSession(), 'media', 'delete');

  const item = mediaStore.find((m) => m.id === id);
  if (!item) throw new Error('Asset not found.');

  if (item.usageCount > 0 && !force) {
    throw new Error(
      `SAFETY LOCK: Asset is actively referenced in ${item.usageCount} published location(s). Pass force=true to override.`
    );
  }

  mediaStore = mediaStore.filter((m) => m.id !== id);
  return { success: true };
}
