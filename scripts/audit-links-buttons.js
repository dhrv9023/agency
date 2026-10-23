#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(PUBLIC_DIR);
console.log(`Found ${htmlFiles.length} HTML files to inspect.\n`);

const results = {
  links: [],
  buttons: [],
  forms: [],
  duplicateIds: {},
  assetErrors: []
};

// Simple regex matchers
const A_TAG_REGEX = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
const BUTTON_TAG_REGEX = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
const FORM_TAG_REGEX = /<form\b([^>]*)>([\s\S]*?)<\/form>/gi;
const ID_ATTR_REGEX = /\bid=["']([^"']+)["']/gi;
const HREF_ATTR_REGEX = /\bhref=["']([^"']*)["']/i;
const SRC_ATTR_REGEX = /\bsrc=["']([^"']*)["']/i;
const TYPE_ATTR_REGEX = /\btype=["']([^"']*)["']/i;
const ACTION_ATTR_REGEX = /\baction=["']([^"']*)["']/i;
const METHOD_ATTR_REGEX = /\bmethod=["']([^"']*)["']/i;
const TARGET_ATTR_REGEX = /\btarget=["']([^"']*)["']/i;
const REL_ATTR_REGEX = /\brel=["']([^"']*)["']/i;
const ONCLICK_REGEX = /\bonclick=["']([^"']*)["']/i;

// Cache page IDs
const pageIdsMap = {};
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const ids = new Set();
  let match;
  while ((match = ID_ATTR_REGEX.exec(content)) !== null) {
    const id = match[1];
    if (ids.has(id)) {
      if (!results.duplicateIds[file]) results.duplicateIds[file] = [];
      results.duplicateIds[file].push(id);
    }
    ids.add(id);
  }
  pageIdsMap[file] = ids;
});

// Inspect each HTML file
htmlFiles.forEach(file => {
  const relFile = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, 'utf8');
  const fileDir = path.dirname(file);

  // 1. Audit Anchors
  let aMatch;
  while ((aMatch = A_TAG_REGEX.exec(content)) !== null) {
    const fullAttrs = aMatch[1];
    const rawText = aMatch[2].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');
    const hrefMatch = fullAttrs.match(HREF_ATTR_REGEX);
    const targetMatch = fullAttrs.match(TARGET_ATTR_REGEX);
    const relMatch = fullAttrs.match(REL_ATTR_REGEX);
    const onclickMatch = fullAttrs.match(ONCLICK_REGEX);

    const href = hrefMatch ? hrefMatch[1] : null;
    const target = targetMatch ? targetMatch[1] : null;
    const rel = relMatch ? relMatch[1] : '';
    const onclick = onclickMatch ? onclickMatch[1] : null;

    let status = 'OK';
    let issue = '';
    let fix = 'None';

    if (href === null) {
      status = 'ERROR';
      issue = 'Missing href attribute entirely';
      fix = 'Add appropriate href or convert to button';
    } else if (href === '' || href === '#') {
      status = 'ERROR';
      issue = `Dead href ("${href}")`;
      fix = 'Repoint to valid destination or replace with action button';
    } else if (href.startsWith('javascript:')) {
      status = 'ERROR';
      issue = `Inline javascript: URL (${href})`;
      fix = 'Convert to semantic <button> with event listener';
    } else if (href.includes('localhost') || href.includes('127.0.0.1')) {
      status = 'ERROR';
      issue = `Hardcoded local address (${href})`;
      fix = 'Use relative or canonical path';
    } else if (href.startsWith('mailto:')) {
      const email = href.replace('mailto:', '');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status = 'ERROR';
        issue = `Malformed mailto: email (${email})`;
        fix = 'Correct email syntax';
      }
    } else if (href.startsWith('tel:')) {
      const phone = href.replace('tel:', '');
      if (!/^\+?[0-9\s\-()]+$/.test(phone)) {
        status = 'ERROR';
        issue = `Malformed tel: number (${phone})`;
        fix = 'Format with valid E.164 phone string';
      }
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      // External link
      if (target === '_blank' && (!rel.includes('noopener') || !rel.includes('noreferrer'))) {
        status = 'WARN';
        issue = 'target="_blank" missing rel="noopener noreferrer"';
        fix = 'Add rel="noopener noreferrer"';
      }
    } else {
      // Internal Link
      let targetPathPart = href;
      let targetHash = '';
      if (href.includes('#')) {
        const parts = href.split('#');
        targetPathPart = parts[0];
        targetHash = parts[1];
      }
      if (targetPathPart.includes('?')) {
        targetPathPart = targetPathPart.split('?')[0];
      }

      let resolvedFile = null;
      if (targetPathPart === '' || targetPathPart === '.') {
        resolvedFile = file;
      } else if (targetPathPart.startsWith('/')) {
        // Absolute to public root
        resolvedFile = path.join(PUBLIC_DIR, targetPathPart.replace(/^\//, ''));
      } else {
        resolvedFile = path.resolve(fileDir, targetPathPart);
      }

      // Check if target file exists or if it's Next.js route
      if (targetPathPart === '/admin' || targetPathPart.startsWith('/admin/')) {
        // Known Next.js route
      } else if (targetPathPart !== '' && !fs.existsSync(resolvedFile)) {
        status = 'ERROR';
        issue = `404 File not found: ${targetPathPart} -> ${path.relative(ROOT_DIR, resolvedFile)}`;
        fix = 'Repoint to valid existing file or create target';
      } else if (targetHash) {
        // Target file exists, check hash ID
        const targetIds = pageIdsMap[resolvedFile] || new Set();
        if (targetHash !== 'top' && !targetIds.has(targetHash)) {
          status = 'ERROR';
          issue = `Broken anchor target: #${targetHash} does not exist in ${path.relative(ROOT_DIR, resolvedFile)}`;
          fix = `Add id="${targetHash}" to target element or update link`;
        }
      }
    }

    if (onclick) {
      status = 'WARN';
      issue += (issue ? '; ' : '') + `Inline onclick attribute: "${onclick}"`;
      fix = 'Move to external JS handler';
    }

    results.links.push({
      file: relFile,
      text: rawText || '[No Text / Icon]',
      href,
      target,
      rel,
      status,
      issue,
      fix
    });
  }

  // 2. Audit Buttons
  let btnMatch;
  while ((btnMatch = BUTTON_TAG_REGEX.exec(content)) !== null) {
    const fullAttrs = btnMatch[1];
    const rawText = btnMatch[2].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');
    const typeMatch = fullAttrs.match(TYPE_ATTR_REGEX);
    const onclickMatch = fullAttrs.match(ONCLICK_REGEX);
    const idMatch = fullAttrs.match(/\bid=["']([^"']+)["']/i);
    const classMatch = fullAttrs.match(/\bclass=["']([^"']+)["']/i);

    const type = typeMatch ? typeMatch[1] : 'submit (default)';
    const onclick = onclickMatch ? onclickMatch[1] : null;
    const id = idMatch ? idMatch[1] : null;
    const className = classMatch ? classMatch[1] : '';

    let state = 'Static';
    let issue = '';
    let fix = 'None';

    if (!typeMatch) {
      issue = 'Missing explicit type attribute (defaults to submit)';
      fix = 'Add explicit type="button" or type="submit"';
    }

    results.buttons.push({
      file: relFile,
      label: rawText || id || className || '[Icon Button]',
      type,
      id,
      className,
      onclick,
      issue,
      fix
    });
  }

  // 3. Audit Forms
  let formMatch;
  while ((formMatch = FORM_TAG_REGEX.exec(content)) !== null) {
    const fullAttrs = formMatch[1];
    const idMatch = fullAttrs.match(/\bid=["']([^"']+)["']/i);
    const actionMatch = fullAttrs.match(ACTION_ATTR_REGEX);
    const methodMatch = fullAttrs.match(METHOD_ATTR_REGEX);

    results.forms.push({
      file: relFile,
      id: idMatch ? idMatch[1] : '[No ID]',
      action: actionMatch ? actionMatch[1] : '[None]',
      method: methodMatch ? methodMatch[1] : '[None]'
    });
  }
});

console.log(`=== AUDIT SUMMARY ===`);
console.log(`Total Links Inspected: ${results.links.length}`);
const linkErrors = results.links.filter(l => l.status === 'ERROR');
const linkWarns = results.links.filter(l => l.status === 'WARN');
console.log(`Link Errors: ${linkErrors.length}`);
console.log(`Link Warnings: ${linkWarns.length}`);

console.log(`\n=== LINK ISSUES LIST ===`);
linkErrors.forEach(l => {
  console.log(`[ERR] ${l.file} | "${l.text}" -> "${l.href}" | ${l.issue}`);
});
linkWarns.forEach(l => {
  console.log(`[WARN] ${l.file} | "${l.text}" -> "${l.href}" | ${l.issue}`);
});

console.log(`\n=== DUPLICATE IDs ===`);
console.log(JSON.stringify(results.duplicateIds, null, 2));

console.log(`\n=== FORMS AUDITED ===`);
console.log(JSON.stringify(results.forms, null, 2));

// Save JSON report
fs.writeFileSync(path.join(ROOT_DIR, 'scripts', 'link-button-audit-results.json'), JSON.stringify(results, null, 2));
console.log(`\nWrote complete audit results to scripts/link-button-audit-results.json`);
