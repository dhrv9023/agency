#!/usr/bin/env node

/**
 * ============================================================================
 * VARAH SYSTEMS — Semantic Breadcrumb & Schema.org JSON-LD Generator
 * ============================================================================
 * Injects accessible breadcrumbs and Google-compliant BreadcrumbList structured data
 * across all 17 nested pages (solutions/*, case-studies/*, industries/*).
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://varahsystems.com';

const NESTED_PAGES = [
  // Solutions (8)
  {
    file: 'public/solutions/ai-automation.html',
    parentName: 'Solutions',
    parentHref: '../solutions.html',
    parentUrl: `${BASE_URL}/solutions.html`,
    leafName: 'Workflow Automation',
    leafUrl: `${BASE_URL}/solutions/ai-automation.html`,
  },
  {
    file: 'public/solutions/ai-agents.html',
    parentName: 'Solutions',
    parentHref: '../solutions.html',
    parentUrl: `${BASE_URL}/solutions.html`,
    leafName: 'Autonomous AI Agents',
    leafUrl: `${BASE_URL}/solutions/ai-agents.html`,
  },
  {
    file: 'public/solutions/ai-voice.html',
    parentName: 'Solutions',
    parentHref: '../solutions.html',
    parentUrl: `${BASE_URL}/solutions.html`,
    leafName: 'Voice AI Telephony',
    leafUrl: `${BASE_URL}/solutions/ai-voice.html`,
  },
  {
    file: 'public/solutions/ai-customer-support.html',
    parentName: 'Solutions',
    parentHref: '../solutions.html',
    parentUrl: `${BASE_URL}/solutions.html`,
    leafName: 'Customer Support Automation',
    leafUrl: `${BASE_URL}/solutions/ai-customer-support.html`,
  },
  {
    file: 'public/solutions/ai-sales.html',
    parentName: 'Solutions',
    parentHref: '../solutions.html',
    parentUrl: `${BASE_URL}/solutions.html`,
    leafName: 'Inbound Lead Qualification',
    leafUrl: `${BASE_URL}/solutions/ai-sales.html`,
  },
  {
    file: 'public/solutions/ai-knowledge.html',
    parentName: 'Solutions',
    parentHref: '../solutions.html',
    parentUrl: `${BASE_URL}/solutions.html`,
    leafName: 'Knowledge Systems (RAG)',
    leafUrl: `${BASE_URL}/solutions/ai-knowledge.html`,
  },
  {
    file: 'public/solutions/document-intelligence.html',
    parentName: 'Solutions',
    parentHref: '../solutions.html',
    parentUrl: `${BASE_URL}/solutions.html`,
    leafName: 'Document Intelligence',
    leafUrl: `${BASE_URL}/solutions/document-intelligence.html`,
  },
  {
    file: 'public/solutions/custom-ai.html',
    parentName: 'Solutions',
    parentHref: '../solutions.html',
    parentUrl: `${BASE_URL}/solutions.html`,
    leafName: 'Custom AI Systems',
    leafUrl: `${BASE_URL}/solutions/custom-ai.html`,
  },

  // Case Studies (3)
  {
    file: 'public/case-studies/lead-qualification.html',
    parentName: 'Case Studies',
    parentHref: '../case-studies.html',
    parentUrl: `${BASE_URL}/case-studies.html`,
    leafName: 'Autonomous Lead Qualification Engine',
    leafUrl: `${BASE_URL}/case-studies/lead-qualification.html`,
  },
  {
    file: 'public/case-studies/invoice-processing.html',
    parentName: 'Case Studies',
    parentHref: '../case-studies.html',
    parentUrl: `${BASE_URL}/case-studies.html`,
    leafName: 'Invoice Extraction & 3-Way Reconciliation',
    leafUrl: `${BASE_URL}/case-studies/invoice-processing.html`,
  },
  {
    file: 'public/case-studies/knowledge-assistant.html',
    parentName: 'Case Studies',
    parentHref: '../case-studies.html',
    parentUrl: `${BASE_URL}/case-studies.html`,
    leafName: 'Grounded Knowledge Assistant (RAG)',
    leafUrl: `${BASE_URL}/case-studies/knowledge-assistant.html`,
  },

  // Industries (6)
  {
    file: 'public/industries/real-estate.html',
    parentName: 'Industries',
    parentHref: '../industries.html',
    parentUrl: `${BASE_URL}/industries.html`,
    leafName: 'Real Estate',
    leafUrl: `${BASE_URL}/industries/real-estate.html`,
  },
  {
    file: 'public/industries/ecommerce.html',
    parentName: 'Industries',
    parentHref: '../industries.html',
    parentUrl: `${BASE_URL}/industries.html`,
    leafName: 'E-Commerce & Retail',
    leafUrl: `${BASE_URL}/industries/ecommerce.html`,
  },
  {
    file: 'public/industries/recruitment.html',
    parentName: 'Industries',
    parentHref: '../industries.html',
    parentUrl: `${BASE_URL}/industries.html`,
    leafName: 'Recruitment & Staffing',
    leafUrl: `${BASE_URL}/industries/recruitment.html`,
  },
  {
    file: 'public/industries/marketing.html',
    parentName: 'Industries',
    parentHref: '../industries.html',
    parentUrl: `${BASE_URL}/industries.html`,
    leafName: 'Marketing Agencies',
    leafUrl: `${BASE_URL}/industries/marketing.html`,
  },
  {
    file: 'public/industries/professional-services.html',
    parentName: 'Industries',
    parentHref: '../industries.html',
    parentUrl: `${BASE_URL}/industries.html`,
    leafName: 'Professional Services',
    leafUrl: `${BASE_URL}/industries/professional-services.html`,
  },
  {
    file: 'public/industries/manufacturing.html',
    parentName: 'Industries',
    parentHref: '../industries.html',
    parentUrl: `${BASE_URL}/industries.html`,
    leafName: 'Logistics & Manufacturing',
    leafUrl: `${BASE_URL}/industries/manufacturing.html`,
  },
];

function generateBreadcrumbHtml(item) {
  return `<!-- BREADCRUMB_START -->
    <nav aria-label="Breadcrumb" class="breadcrumb-nav">
      <div class="container">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item"><a href="/">Home</a></li>
          <li class="breadcrumb-item"><a href="${item.parentHref}">${item.parentName}</a></li>
          <li class="breadcrumb-item" aria-current="page">${item.leafName}</li>
        </ol>
      </div>
    </nav>
    <!-- BREADCRUMB_END -->`;
}

function generateBreadcrumbJsonLd(item) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: item.parentName,
        item: item.parentUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: item.leafName,
        item: item.leafUrl,
      },
    ],
  };

  return `<!-- BREADCRUMB_JSONLD_START -->
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
  <!-- BREADCRUMB_JSONLD_END -->`;
}

let modifiedCount = 0;

NESTED_PAGES.forEach((item) => {
  const filePath = path.resolve(__dirname, '..', item.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] File not found: ${item.file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const breadcrumbHtml = generateBreadcrumbHtml(item);
  const jsonLdHtml = generateBreadcrumbJsonLd(item);

  // 1. Inject JSON-LD into <head>
  if (content.includes('<!-- BREADCRUMB_JSONLD_START -->')) {
    content = content.replace(
      /<!-- BREADCRUMB_JSONLD_START -->[\s\S]*?<!-- BREADCRUMB_JSONLD_END -->/,
      jsonLdHtml
    );
    changed = true;
  } else {
    // Insert before </head>
    content = content.replace('</head>', `  ${jsonLdHtml}\n</head>`);
    changed = true;
  }

  // 2. Inject Breadcrumb markup inside <main>
  if (content.includes('<!-- BREADCRUMB_START -->')) {
    content = content.replace(
      /<!-- BREADCRUMB_START -->[\s\S]*?<!-- BREADCRUMB_END -->/,
      breadcrumbHtml
    );
    changed = true;
  } else {
    // Insert immediately after <main>
    content = content.replace('<main>', `<main>\n    ${breadcrumbHtml}`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    console.log(`[BREADCRUMB] Updated: ${item.file}`);
  }
});

console.log(`\n✓ SUCCESS: Injected breadcrumbs and JSON-LD across ${modifiedCount} nested pages.`);
