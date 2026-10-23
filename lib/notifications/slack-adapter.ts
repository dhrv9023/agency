/**
 * ==============================================================================
 * VARAH SYSTEMS — Slack / Discord Webhook Notification Adapter
 * ==============================================================================
 * Standards:
 *   - If SLACK_WEBHOOK_URL is unset, status is recorded as "skipped: not configured"
 *     on the lead record and visible in admin view, never a silent failure or no-op.
 *   - Formats structured blocks with lead metadata (Name, Company, Service, Budget).
 */

export interface SlackLeadPayload {
  leadId: string;
  name: string;
  email: string;
  company: string;
  serviceInterest: string;
  budgetRange: string;
  message: string;
  preferredTimes?: string;
  convertedOnPage?: string;
}

export interface SlackDispatchResult {
  status: 'sent' | 'skipped: not configured' | 'failed';
  error?: string;
  dispatchedAt: string;
}

export async function sendSlackLeadAlert(payload: SlackLeadPayload): Promise<SlackDispatchResult> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL || process.env.SLACK_LEAD_WEBHOOK_URL;
  const dispatchedAt = new Date().toISOString();

  // Explicit unconfigured state recorded on lead
  if (!webhookUrl || webhookUrl.trim() === '') {
    return {
      status: 'skipped: not configured',
      dispatchedAt,
    };
  }

  const truncatedBottleneck = payload.message.length > 250
    ? `${payload.message.slice(0, 247)}...`
    : payload.message;

  const slackBody = {
    text: `New Lead: ${payload.name} (${payload.company}) - ${payload.serviceInterest}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '⚡ New Inbound Lead Submission',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Client:*\n${payload.name}` },
          { type: 'mrkdwn', text: `*Company:*\n${payload.company}` },
          { type: 'mrkdwn', text: `*Email:*\n${payload.email}` },
          { type: 'mrkdwn', text: `*Budget:*\n${payload.budgetRange}` },
          { type: 'mrkdwn', text: `*Service:*\n${payload.serviceInterest}` },
          { type: 'mrkdwn', text: `*Preferred Times:*\n${payload.preferredTimes || 'Not specified'}` },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Bottleneck Description:*\n>${truncatedBottleneck}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Lead ID: \`${payload.leadId}\` | Page: \`${payload.convertedOnPage || '/contact.html'}\` | Time: <!date^${Math.floor(Date.now() / 1000)}^{date_num} {time_secs}|${dispatchedAt}>`,
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackBody),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Slack API error');
      console.error(`[SLACK_DISPATCH_FAIL] Status ${res.status}: ${errText}`);
      return {
        status: 'failed',
        error: `Slack response status ${res.status}`,
        dispatchedAt,
      };
    }

    return {
      status: 'sent',
      dispatchedAt,
    };
  } catch (err) {
    console.error('[SLACK_NETWORK_ERROR]', (err as Error).message);
    return {
      status: 'failed',
      error: (err as Error).message,
      dispatchedAt,
    };
  }
}
