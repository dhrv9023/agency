'use server';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SERVER ACTIONS: CMS & CONTENT ENGINE
 * Case studies, technical blueprints, markdown publication workflow, and SEO
 * ==============================================================================
 */

import { getSession } from '@/lib/auth/session';
import { assertPermission } from '@/lib/rbac/permissions';
import type { CMSPost, CMSCaseStudy, ContentStatus } from '@/types/admin';

// Seed Posts
let postsStore: CMSPost[] = [
  {
    id: 'post_001',
    slug: 'engineering-autonomous-agent-topologies',
    title: 'Engineering Autonomous Agent Topologies: Memory Systems & Guardrails',
    excerpt: 'A technical breakdown of how we architect deterministic agent workflows that prevent infinite loops and guarantee enterprise SLA reliability.',
    content: `# Engineering Autonomous Agent Topologies: Memory Systems & Guardrails

Enterprise operations require **deterministic guarantees**. In this release, we outline the exact architecture behind VARAH SYSTEMS' multi-agent orchestrator.

## 1. The Multi-Agent Triad
In production, a single monolithic prompt fails when context exceeds 8k tokens or requires multi-tool branching. We decompose workflows into three specialized agents:
- **Triage & Classification Agent**: Categorizes intent and verifies authorization tokens.
- **Tool Execution Specialist**: Interfaces with APIs, ERP databases, and webhooks with strict JSON schema validation.
- **Audit & Validation Verifier**: Inspects output against corporate policy and mathematical correctness before committing side-effects.

\`\`\`python
class AgentCoordinator:
    def __init__(self, memory_cluster, guardrail_engine):
        self.memory = memory_cluster
        self.guardrails = guardrail_engine

    async def execute_step(self, intent_payload):
        # 1. State Verification
        assert self.guardrails.verify(intent_payload)
        # 2. Tool Execution
        result = await self.tools.dispatch(intent_payload)
        # 3. Commit to Temporal Ledger
        return self.memory.append(result)
\`\`\`

## 2. Memory Clustering via Vector Embeddings
Transient context is stored in localized Redis queues, while historical case history is projected into pgvector indices with HNSW nearest-neighbor indexing.

## Summary
By separating execution from verification, our enterprise deployments achieve 99.8% deterministic accuracy on complex business workflows.`,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    authorId: 'usr_owner_001',
    authorName: 'Dhruv & Bhavya',
    authorAvatar: null,
    tags: ['Architecture', 'Agents', 'Python', 'Enterprise'],
    readingTimeMin: 7,
    status: 'PUBLISHED',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    metaTitle: 'Engineering Autonomous Agent Topologies | VARAH SYSTEMS',
    metaDesc: 'A technical deep-dive into multi-agent systems architecture, deterministic tool-calling, and enterprise safety guardrails.',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post_002',
    slug: 'the-zero-leak-etl-architecture',
    title: 'The Zero-Leak ETL Architecture: Reconciling ERP Documents with Vision LLMs',
    excerpt: 'Extracting tabular data from non-standard bills of lading and supplier manifests without manual human intervention.',
    content: `# The Zero-Leak ETL Architecture

Manual data entry from vendor invoices costs average supply chain companies $18.40 per document in labor and correction cycles.

## 1. High-Density Vision Pipelines
We utilize fine-tuned multi-modal vision encoders combined with layout-aware OCR to isolate bounding boxes before passing numeric values to structured JSON validators.

## 2. Automated Discrepancy Reconciliation
When line items disagree with SAP purchase orders by > $0.05, the reconciliation agent flags the mismatch and generates an automated supplier clarification draft.`,
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    authorId: 'usr_owner_001',
    authorName: 'Dhruv & Bhavya',
    authorAvatar: null,
    tags: ['ETL', 'Document AI', 'ERP', 'Logistics'],
    readingTimeMin: 9,
    status: 'PUBLISHED',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    metaTitle: 'Zero-Leak Document ETL Architecture | VARAH SYSTEMS',
    metaDesc: 'How to automate ERP document extraction and reconciliation using layout-aware vision LLMs.',
    ogImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post_003',
    slug: 'deterministic-tool-calling-in-production',
    title: 'Deterministic Tool-Calling in Production: Avoiding Hallucination Spirals',
    excerpt: 'Techniques for constraining LLM outputs to rigid schemas and ensuring atomic rollbacks when external APIs timeout.',
    content: `# Deterministic Tool-Calling in Production

Draft content in progress. Covers JSON Schema strict mode, pydantic validation, and compensation transactions during distributed tool invocation.`,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    authorId: 'usr_owner_001',
    authorName: 'Dhruv & Bhavya',
    authorAvatar: null,
    tags: ['Tools', 'Reliability', 'Engineering'],
    readingTimeMin: 5,
    status: 'DRAFT',
    publishedAt: null,
    metaTitle: 'Deterministic Tool-Calling in Production',
    metaDesc: 'Architectural strategies for robust tool execution in enterprise AI systems.',
    ogImage: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Seed Case Studies
let caseStudiesStore: CMSCaseStudy[] = [
  {
    id: 'cs_001',
    slug: 'acme-supply-chain-logistics',
    title: 'Autonomous SAP Invoice & Manifest Extraction Engine',
    clientName: 'Acme Supply Chain Logistics',
    industry: 'Freight & Supply Chain Logistics',
    challenge: 'Processing over 1,200 non-standard vendor manifests weekly across international offices created a 4-day processing backlog and frequent human entry errors in SAP ECC.',
    solution: 'Designed and deployed a dual-agent vision extraction pipeline that normalizes invoice line items, executes 3-way matching against SAP purchase orders, and flags price variances.',
    results: [
      { metric: 'Manual Processing Hours', value: '45h / week', change: '-87%' },
      { metric: 'Reconciliation Accuracy', value: '99.4%', change: '+14%' },
      { metric: 'Cycle Time to Approval', value: '3.2 minutes', change: '-92%' },
    ],
    techStack: ['Python', 'FastAPI', 'OpenAI Vision', 'SAP BAPI', 'pgvector', 'Docker'],
    heroImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [],
    featured: true,
    order: 1,
    status: 'PUBLISHED',
    metaTitle: 'Acme Supply Chain AI Automation Case Study | VARAH SYSTEMS',
    metaDesc: 'How Acme Supply Chain automated 1,200 invoices weekly with 99.4% accuracy using VARAH SYSTEMS.',
    ogImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cs_002',
    slug: 'apex-health-systems',
    title: 'HIPAA-Compliant Patient Intake & Triaging Assistant',
    clientName: 'Apex Health Systems',
    industry: 'Healthcare & Clinical Practice',
    challenge: 'High call volume overloaded clinic receptionists, causing 18-minute telephone hold times and patient drop-off before appointment scheduling.',
    solution: 'Engineered an end-to-end voice and web triaging agent integrated with Epic EHR, answering 24/7 patient questions and filing structured intake records.',
    results: [
      { metric: 'Average Hold Time', value: '14 seconds', change: '-98%' },
      { metric: 'New Patient Bookings', value: '+34%', change: '+34%' },
      { metric: 'Data Entry Consistency', value: '100%', change: 'Zero Errors' },
    ],
    techStack: ['Whisper V3', 'Llama 3.3', 'Epic FHIR API', 'Redis', 'Twilio Voice'],
    heroImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [],
    featured: true,
    order: 2,
    status: 'PUBLISHED',
    metaTitle: 'Apex Health Patient Intake Case Study | VARAH SYSTEMS',
    metaDesc: 'Deploying HIPAA-compliant autonomous assistants for Epic EHR patient scheduling.',
    ogImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export interface GetPostsParams {
  query?: string;
  status?: ContentStatus | 'ALL';
  tag?: string;
}

/**
 * Fetch filtered blog and technical release posts
 */
export async function getCMSPostsAction(params: GetPostsParams = {}): Promise<CMSPost[]> {
  const session = assertPermission(await getSession(), 'cms', 'view');

  const { query = '', status = 'ALL', tag = '' } = params;

  let filtered = [...postsStore];

  if (status !== 'ALL') {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        p.slug.toLowerCase().includes(q)
    );
  }

  if (tag) {
    filtered = filtered.filter((p) => p.tags.includes(tag));
  }

  return filtered;
}

/**
 * Fetch a single post by ID
 */
export async function getCMSPostByIdAction(id: string): Promise<CMSPost | null> {
  const session = assertPermission(await getSession(), 'cms', 'view');
  return postsStore.find((p) => p.id === id) || null;
}

export interface SavePostInput {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string | null;
  tags?: string[];
  status?: ContentStatus;
  metaTitle?: string;
  metaDesc?: string;
  ogImage?: string | null;
}

/**
 * Create or update a CMS technical publication
 */
export async function saveCMSPostAction(input: SavePostInput): Promise<CMSPost> {
  const session = assertPermission(await getSession(), 'cms', input.id ? 'edit' : 'create');

  const slug =
    input.slug ||
    input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const wordCount = input.content.split(/\s+/).filter(Boolean).length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  if (input.id) {
    const index = postsStore.findIndex((p) => p.id === input.id);
    if (index === -1) throw new Error('Post not found.');

    postsStore[index] = {
      ...postsStore[index],
      title: input.title,
      slug,
      excerpt: input.excerpt || null,
      content: input.content,
      coverImage: input.coverImage !== undefined ? input.coverImage : postsStore[index].coverImage,
      tags: input.tags || postsStore[index].tags,
      readingTimeMin,
      status: input.status || postsStore[index].status,
      publishedAt:
        input.status === 'PUBLISHED' && !postsStore[index].publishedAt
          ? new Date().toISOString()
          : postsStore[index].publishedAt,
      metaTitle: input.metaTitle || postsStore[index].metaTitle,
      metaDesc: input.metaDesc || postsStore[index].metaDesc,
      ogImage: input.ogImage !== undefined ? input.ogImage : postsStore[index].ogImage,
      updatedAt: new Date().toISOString(),
    };

    return postsStore[index];
  }

  // Create New Post
  const newPost: CMSPost = {
    id: `post_${Date.now().toString(36)}`,
    title: input.title,
    slug,
    excerpt: input.excerpt || null,
    content: input.content,
    coverImage: input.coverImage || null,
    authorId: session.user.id,
    authorName: session.user.name,
    authorAvatar: session.user.avatarUrl,
    tags: input.tags || ['Architecture'],
    readingTimeMin,
    status: input.status || 'DRAFT',
    publishedAt: input.status === 'PUBLISHED' ? new Date().toISOString() : null,
    metaTitle: input.metaTitle || input.title,
    metaDesc: input.metaDesc || input.excerpt || '',
    ogImage: input.ogImage || input.coverImage || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  postsStore.unshift(newPost);
  return newPost;
}

/**
 * Permanently delete a CMS post
 */
export async function deleteCMSPostAction(id: string): Promise<{ success: boolean }> {
  const session = assertPermission(await getSession(), 'cms', 'delete');
  postsStore = postsStore.filter((p) => p.id !== id);
  return { success: true };
}

/**
 * Fetch all case studies
 */
export async function getCMSCaseStudiesAction(): Promise<CMSCaseStudy[]> {
  const session = assertPermission(await getSession(), 'cms', 'view');
  return [...caseStudiesStore];
}

/**
 * Fetch single case study by ID
 */
export async function getCMSCaseStudyByIdAction(id: string): Promise<CMSCaseStudy | null> {
  const session = assertPermission(await getSession(), 'cms', 'view');
  return caseStudiesStore.find((cs) => cs.id === id) || null;
}

/**
 * Create or update a case study record
 */
export async function saveCMSCaseStudyAction(
  data: Partial<CMSCaseStudy> & { title: string; clientName: string }
): Promise<CMSCaseStudy> {
  const session = assertPermission(await getSession(), 'cms', data.id ? 'edit' : 'create');

  const slug =
    data.slug ||
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  if (data.id) {
    const index = caseStudiesStore.findIndex((cs) => cs.id === data.id);
    if (index === -1) throw new Error('Case study not found.');

    caseStudiesStore[index] = {
      ...caseStudiesStore[index],
      ...data,
      slug,
      updatedAt: new Date().toISOString(),
    };
    return caseStudiesStore[index];
  }

  const newCS: CMSCaseStudy = {
    id: `cs_${Date.now().toString(36)}`,
    slug,
    title: data.title,
    clientName: data.clientName,
    industry: data.industry || 'Technology',
    challenge: data.challenge || '',
    solution: data.solution || '',
    results: data.results || [],
    techStack: data.techStack || ['AI Agents', 'Python'],
    heroImageUrl: data.heroImageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: data.galleryUrls || [],
    featured: data.featured ?? true,
    order: data.order || caseStudiesStore.length + 1,
    status: data.status || 'PUBLISHED',
    metaTitle: data.metaTitle || data.title,
    metaDesc: data.metaDesc || data.challenge || null,
    ogImage: data.ogImage || data.heroImageUrl || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  caseStudiesStore.unshift(newCS);
  return newCS;
}

/**
 * Delete a case study
 */
export async function deleteCMSCaseStudyAction(id: string): Promise<{ success: boolean }> {
  const session = assertPermission(await getSession(), 'cms', 'delete');
  caseStudiesStore = caseStudiesStore.filter((cs) => cs.id !== id);
  return { success: true };
}
