import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  status: 'New Inquiry' | 'Discovery Booked' | 'Under Review' | 'Proposal Sent' | 'Closed Won';
  notes: string;
  date: string;
  slot?: string;
  source: 'Contact Form' | 'Discovery Scheduler' | 'ROI Calculator';
}

interface LeadContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  deleteLead: (id: string) => void;
  clearAllLeads: () => void;
}

const INITIAL_SEED_LEADS: Lead[] = [
  {
    id: 'LEAD-9041',
    name: 'Elena Rostova',
    email: 'elena.r@strata-logistics.eu',
    company: 'Strata Freight Global',
    service: 'Document Intelligence & Customs OCR',
    budget: '$30,000 – $50,000',
    status: 'Discovery Booked',
    notes: 'Needs 3-way matching automated across 14,000 monthly international bills of lading.',
    date: '2026-09-03',
    slot: 'Sep 08, 2026 • 14:00 GMT',
    source: 'Discovery Scheduler'
  },
  {
    id: 'LEAD-9042',
    name: 'Marcus Vance',
    email: 'm.vance@apexhealth.io',
    company: 'Apex Health Systems',
    service: 'AI Voice Telephony & Triage',
    budget: '$50,000+',
    status: 'Under Review',
    notes: 'Wants sub-400ms voice agents handling inbound patient dispatch & appointment cancellations.',
    date: '2026-09-02',
    source: 'Contact Form'
  },
  {
    id: 'LEAD-9043',
    name: 'Sarah Chen',
    email: 'sarah@meridiancapital.com',
    company: 'Meridian Capital Partners',
    service: 'AI Knowledge Retrieval (RAG)',
    budget: '$20,000 – $30,000',
    status: 'Proposal Sent',
    notes: 'Grounding internal investment memos and regulatory compliance filings with strict citations.',
    date: '2026-08-30',
    source: 'Contact Form'
  },
  {
    id: 'LEAD-9044',
    name: 'Julian Thorne',
    email: 'jthorne@omnicommerce.co',
    company: 'OmniCommerce Group',
    service: 'AI Customer Operations & CRM Sync',
    budget: '$15,000 – $25,000',
    status: 'Closed Won',
    notes: 'Automating Shopify refund triage and Zendesk order status resolution.',
    date: '2026-08-27',
    source: 'ROI Calculator'
  }
];

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('agency_leads_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse leads from localStorage', e);
      }
    }
    return INITIAL_SEED_LEADS;
  });

  useEffect(() => {
    localStorage.setItem('agency_leads_v2', JSON.stringify(leads));
  }, [leads]);

  const addLead = (leadData: Omit<Lead, 'id' | 'date'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const clearAllLeads = () => {
    setLeads([]);
  };

  return (
    <LeadContext.Provider
      value={{ leads, addLead, updateLeadStatus, deleteLead, clearAllLeads }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = (): LeadContextType => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
