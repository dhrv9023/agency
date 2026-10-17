/**
 * ==============================================================================
 * VARAH SYSTEMS — RFC 4180 COMPLIANT CSV EXPORT ENGINE
 * Handles safe character escaping, delimiter preservation, and browser downloads
 * ==============================================================================
 */

import type { Lead } from '@/types/admin';

/**
 * Escape a single cell string according to RFC 4180
 */
function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }

  const stringValue = String(value);

  // If contains commas, double quotes, or newlines, wrap in quotes and escape internal quotes
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return `"${stringValue}"`;
}

/**
 * Format an array of Leads into an RFC 4180 compliant CSV string
 */
export function generateLeadsCsv(leads: Lead[]): string {
  const headers = [
    'Lead ID',
    'Full Name',
    'Email Address',
    'Phone',
    'Company',
    'Website',
    'Budget Range',
    'Service Interest',
    'Stage',
    'Priority',
    'Assigned To',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'Converted On Page',
    'Referrer URL',
    'Is Spam',
    'Notes Count',
    'Created At',
    'Last Contacted At',
    'Initial Message',
  ];

  const rows = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.email,
    lead.phone || '',
    lead.company || '',
    lead.website || '',
    lead.budgetRange || '',
    lead.serviceInterest || '',
    lead.stage,
    lead.priority,
    lead.assignedToName || 'Unassigned',
    lead.utmSource || '',
    lead.utmMedium || '',
    lead.utmCampaign || '',
    lead.convertedOnPage || '',
    lead.referrerUrl || '',
    lead.isSpam ? 'YES' : 'NO',
    lead.notesCount,
    lead.createdAt,
    lead.lastContactedAt || '',
    lead.message,
  ]);

  const headerLine = headers.map(escapeCsvCell).join(',');
  const rowLines = rows.map((row) => row.map(escapeCsvCell).join(','));

  return [headerLine, ...rowLines].join('\r\n');
}

/**
 * Trigger client-side file download of CSV content
 */
export function downloadCsvFile(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
