import { z } from 'zod';

/**
 * ==============================================================================
 * VARAH SYSTEMS — Contact Form Zod Schema (Layer B Validation)
 * ==============================================================================
 * Enforces field length limits, formats, honeypot safety, and data sanitization
 * in strict alignment with templates/form-rules.json.
 */

export const contactFormSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must contain at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),

  email: z
    .string({ required_error: 'Work email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address')
    .max(254, 'Email cannot exceed 254 characters'),

  company: z
    .string({ required_error: 'Company name is required' })
    .trim()
    .min(2, 'Company name must contain at least 2 characters')
    .max(100, 'Company name cannot exceed 100 characters'),

  website: z
    .string()
    .trim()
    .max(200, 'Website URL cannot exceed 200 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),

  overview: z
    .string()
    .trim()
    .max(500, 'Company overview cannot exceed 500 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),

  message: z
    .string({ required_error: 'Process description is required' })
    .trim()
    .min(10, 'Process description must contain at least 10 characters')
    .max(3000, 'Process description cannot exceed 3000 characters'),

  tools: z
    .string()
    .trim()
    .max(300, 'Tools & databases cannot exceed 300 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),

  teamSize: z
    .string()
    .trim()
    .max(50, 'Team size cannot exceed 50 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),

  serviceInterest: z
    .string()
    .trim()
    .max(100, 'Service interest cannot exceed 100 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),

  budgetRange: z
    .string()
    .trim()
    .max(100, 'Budget range cannot exceed 100 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),

  timeline: z
    .string()
    .trim()
    .max(100, 'Timeline cannot exceed 100 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),

  preferredTimes: z
    .string()
    .trim()
    .max(200, 'Preferred times cannot exceed 200 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),

  context: z
    .string()
    .trim()
    .max(1000, 'Additional context cannot exceed 1000 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),

  turnstileToken: z
    .string()
    .trim()
    .max(2048, 'Turnstile token exceeds length limit')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),

  // Tracking Attribution (Consent-Gated)
  analyticsConsented: z.boolean().optional().default(false),

  utmSource: z
    .string()
    .trim()
    .max(100, 'utm_source exceeds length limit')
    .regex(/^[a-zA-Z0-9_\-\.\/ ]*$/, 'Invalid characters in utm_source')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),

  utmMedium: z
    .string()
    .trim()
    .max(100, 'utm_medium exceeds length limit')
    .regex(/^[a-zA-Z0-9_\-\.\/ ]*$/, 'Invalid characters in utm_medium')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),

  utmCampaign: z
    .string()
    .trim()
    .max(100, 'utm_campaign exceeds length limit')
    .regex(/^[a-zA-Z0-9_\-\.\/ ]*$/, 'Invalid characters in utm_campaign')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),

  utmTerm: z
    .string()
    .trim()
    .max(100, 'utm_term exceeds length limit')
    .regex(/^[a-zA-Z0-9_\-\.\/ ]*$/, 'Invalid characters in utm_term')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),

  utmContent: z
    .string()
    .trim()
    .max(100, 'utm_content exceeds length limit')
    .regex(/^[a-zA-Z0-9_\-\.\/ ]*$/, 'Invalid characters in utm_content')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),

  landingPath: z
    .string()
    .trim()
    .max(100, 'landingPath exceeds length limit')
    .regex(/^[a-zA-Z0-9_\-\.\/ ]*$/, 'Invalid characters in landingPath')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),

  referrerUrl: z
    .string()
    .trim()
    .max(200, 'referrerUrl exceeds length limit')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),

  convertedOnPage: z
    .string()
    .trim()
    .max(200)
    .optional()
    .default('/contact.html'),

  // Anti-Spam Honeypot field (must be empty)
  website_hp: z
    .string()
    .max(0, 'Spam detected')
    .optional()
    .or(z.literal(''))
    .transform(() => undefined),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
