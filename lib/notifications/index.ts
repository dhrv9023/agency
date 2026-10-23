import { sendEmailNotification } from './email-adapter';
import { sendSlackLeadAlert } from './slack-adapter';

/**
 * ==============================================================================
 * VARAH SYSTEMS — Lead Notification Dispatcher
 * ==============================================================================
 */

export interface LeadNotificationInput {
  leadId: string;
  name: string;
  email: string;
  company: string;
  message: string;
  serviceInterest: string;
  budgetRange: string;
  preferredTimes?: string;
  convertedOnPage?: string;
}

export async function dispatchLeadNotifications(lead: LeadNotificationInput): Promise<{
  emailStatus: string;
  slackStatus: string;
}> {
  // 1. Email notification (Default dry-run mode: metadata only, zero PII)
  const emailPromise = sendEmailNotification({
    toEmail: lead.email,
    recipientName: lead.name,
    subject: 'Project Scoping Inquiry Received — VARAH SYSTEMS',
    body: `Hello ${lead.name},\n\nWe have received your scoping inquiry regarding ${lead.serviceInterest}. We reply within one business day.\n\nVARAH SYSTEMS`,
    templateId: 'lead_acknowledgement',
  });

  // 2. Slack webhook notification (Explicitly recorded as skipped if unconfigured)
  const slackPromise = sendSlackLeadAlert({
    leadId: lead.leadId,
    name: lead.name,
    email: lead.email,
    company: lead.company,
    serviceInterest: lead.serviceInterest,
    budgetRange: lead.budgetRange,
    message: lead.message,
    preferredTimes: lead.preferredTimes,
    convertedOnPage: lead.convertedOnPage,
  });

  const [emailResult, slackResult] = await Promise.all([emailPromise, slackPromise]);

  return {
    emailStatus: emailResult.status,
    slackStatus: slackResult.status,
  };
}
