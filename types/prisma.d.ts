/**
 * ==============================================================================
 * VARAH SYSTEMS — PRISMA CLIENT TYPE DECLARATIONS
 * Ambient type declarations providing type safety for Prisma ORM seeds and scripts
 * without requiring a pre-generated native client binary.
 * ==============================================================================
 */

declare module '@prisma/client' {
  export type UserRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
  export type LeadStage = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'WON' | 'LOST';
  export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  export type ProjectStatus = 'PROPOSED' | 'DISCOVERY' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  export type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
  export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED';
  export type SubscriberStatus = 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'BOUNCED' | 'COMPLAINED';
  export type IntegrationType = 'SMTP' | 'CALENDLY' | 'SLACK_WEBHOOK' | 'DISCORD_WEBHOOK' | 'HUBSPOT' | 'STRIPE' | 'CUSTOM_API_KEY';

  export interface PrismaModelDelegate<T, CreateInput, UpdateInput, WhereUniqueInput> {
    findUnique(args: { where: WhereUniqueInput }): Promise<T | null>;
    findFirst(args?: { where?: Partial<T> }): Promise<T | null>;
    findMany(args?: { where?: Partial<T>; take?: number; skip?: number }): Promise<T[]>;
    create(args: { data: CreateInput }): Promise<T>;
    createMany(args: { data: CreateInput[] }): Promise<{ count: number }>;
    update(args: { where: WhereUniqueInput; data: UpdateInput }): Promise<T>;
    upsert(args: { where: WhereUniqueInput; create: CreateInput; update: UpdateInput }): Promise<T>;
    delete(args: { where: WhereUniqueInput }): Promise<T>;
    deleteMany(args?: { where?: Partial<T> }): Promise<{ count: number }>;
    count(args?: { where?: Partial<T> }): Promise<number>;
  }

  export class PrismaClient {
    constructor(options?: { datasourceUrl?: string; log?: Array<'query' | 'info' | 'warn' | 'error'> });
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;

    user: PrismaModelDelegate<
      { id: string; email: string; name: string; role: UserRole; isActive: boolean; createdAt: Date; updatedAt: Date },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string; email?: string }
    >;

    siteSetting: PrismaModelDelegate<
      { id: string; siteName: string; siteUrl: string; updatedAt: Date },
      Record<string, unknown>,
      Record<string, unknown>,
      { id: string }
    >;

    integration: PrismaModelDelegate<
      { id: string; type: IntegrationType; name: string; isEnabled: boolean },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string }
    >;

    leadTag: PrismaModelDelegate<
      { id: string; name: string; colorHex: string },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string; name?: string }
    >;

    lead: PrismaModelDelegate<
      { id: string; name: string; email: string; stage: LeadStage; priority: LeadPriority },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string; email?: string }
    >;

    leadNote: PrismaModelDelegate<
      { id: string; leadId: string; authorId: string; content: string },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string }
    >;

    leadStatusHistory: PrismaModelDelegate<
      { id: string; leadId: string; fromStage: LeadStage; toStage: LeadStage },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string }
    >;

    client: PrismaModelDelegate<
      { id: string; name: string; company: string; email: string },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string; email?: string }
    >;

    project: PrismaModelDelegate<
      { id: string; clientId: string; title: string; code: string; status: ProjectStatus },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string; code?: string }
    >;

    projectMilestone: PrismaModelDelegate<
      { id: string; projectId: string; title: string; status: MilestoneStatus },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string }
    >;

    service: PrismaModelDelegate<
      { id: string; slug: string; title: string; status: ContentStatus },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string; slug?: string }
    >;

    caseStudy: PrismaModelDelegate<
      { id: string; slug: string; title: string; clientName: string; status: ContentStatus },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string; slug?: string }
    >;

    post: PrismaModelDelegate<
      { id: string; slug: string; title: string; authorId: string; status: ContentStatus },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string; slug?: string }
    >;

    testimonial: PrismaModelDelegate<
      { id: string; authorName: string; companyName: string; quote: string },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string }
    >;

    teamMember: PrismaModelDelegate<
      { id: string; name: string; role: string },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string }
    >;

    faq: PrismaModelDelegate<
      { id: string; question: string; answer: string; category: string },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string }
    >;

    mediaFolder: PrismaModelDelegate<
      { id: string; name: string; slug: string },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string; slug?: string }
    >;

    mediaItem: PrismaModelDelegate<
      { id: string; filename: string; url: string; mimeType: string },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string }
    >;

    dailyTrafficMetric: PrismaModelDelegate<
      { id: string; date: Date; totalPageviews: number; uniqueVisitors: number },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string; date?: Date }
    >;

    newsletterSubscriber: PrismaModelDelegate<
      { id: string; email: string; status: SubscriberStatus },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string; email?: string }
    >;

    auditLog: PrismaModelDelegate<
      { id: string; action: string; entityType: string; createdAt: Date },
      Record<string, unknown>,
      Record<string, unknown>,
      { id?: string }
    >;
  }
}
