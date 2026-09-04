export interface BrandConfig {
  name: string;
  shortName: string;
  entityName: string;
  tagline: string;
  subtagline: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  domain: string;
  socials: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  stats: {
    latency: string;
    uptime: string;
    scope: string;
    precision: string;
  };
}

export const BRAND: BrandConfig = {
  name: "VALENCE DYNAMICS",
  shortName: "VALENCE",
  entityName: "VALENCE DYNAMICS // SYSTEMS",
  tagline: "INTELLIGENCE DESIGNED TO EVOLVE",
  subtagline: "Systems Engineering over AI Hype",
  description: "We engineer and deploy autonomous AI systems, event-driven pipelines, and deterministic agent swarms that scale modern enterprise operations.",
  contactEmail: "systems@valencedynamics.com",
  contactPhone: "+1 (888) 402-VALENCE",
  address: "San Francisco, CA • London • Singapore",
  domain: "https://valencedynamics.com",
  socials: {
    github: "https://github.com/dhrv9023/agency",
    twitter: "https://twitter.com/valencedynamics",
    linkedin: "https://linkedin.com/company/valencedynamics"
  },
  stats: {
    latency: "< 340ms",
    uptime: "99.98%",
    scope: "∞ Scalable",
    precision: "100% Deterministic"
  }
};
