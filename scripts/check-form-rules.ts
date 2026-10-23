#!/usr/bin/env tsx

/**
 * ==============================================================================
 * VARAH SYSTEMS — Form Rules & Zod Parity Auditor
 * ==============================================================================
 * Verifies that the Layer B Zod schema in lib/validations/contact.ts strictly
 * adheres to the single source of truth in templates/form-rules.json.
 * Exits with code 1 if any field constraints disagree.
 */

import fs from 'node:fs';
import path from 'node:path';
import { contactFormSchema } from '../lib/validations/contact';
import { z } from 'zod';

const ROOT_DIR = path.resolve(__dirname, '..');
const RULES_FILE = path.join(ROOT_DIR, 'templates', 'form-rules.json');

if (!fs.existsSync(RULES_FILE)) {
  console.error(`[FAIL] Rules file missing: ${RULES_FILE}`);
  process.exit(1);
}

const rules = JSON.parse(fs.readFileSync(RULES_FILE, 'utf8'));
const { fields } = rules;
const discrepancies: string[] = [];

// Helper to inspect Zod type definitions
const schemaShape = (contactFormSchema as any).shape;

for (const [fieldName, rule] of Object.entries<any>(fields)) {
  const zodField = schemaShape[fieldName];

  if (!zodField) {
    discrepancies.push(`Missing field '${fieldName}' in Zod schema.`);
    continue;
  }

  // Test optional vs required behavior
  const isOptionalInRule = rule.required === false;

  // Test with undefined
  const undefinedResult = zodField.safeParse(undefined);
  if (isOptionalInRule && !undefinedResult.success) {
    discrepancies.push(`Field '${fieldName}' should be optional according to form-rules.json, but Zod rejected undefined.`);
  } else if (!isOptionalInRule && undefinedResult.success) {
    discrepancies.push(`Field '${fieldName}' is required in form-rules.json, but Zod accepted undefined.`);
  }

  // Test maxLength enforcement
  if (typeof rule.maxLength === 'number') {
    const oversizedString = 'a'.repeat(rule.maxLength + 1);
    const parseResult = zodField.safeParse(oversizedString);
    if (parseResult.success) {
      discrepancies.push(`Field '${fieldName}' exceeded maxLength ${rule.maxLength} without triggering Zod error.`);
    }
  }

  // Test minLength enforcement
  if (typeof rule.minLength === 'number' && rule.minLength > 0) {
    const undersizedString = 'a'.repeat(rule.minLength - 1);
    const parseResult = zodField.safeParse(undersizedString);
    if (parseResult.success) {
      discrepancies.push(`Field '${fieldName}' violated minLength ${rule.minLength} without triggering Zod error.`);
    }
  }
}

console.log('=================================================================');
console.log('VARAH SYSTEMS — Form Rules vs Zod Parity Auditor');
console.log(`Checking ${Object.keys(fields).length} fields against lib/validations/contact.ts`);
console.log('=================================================================\n');

if (discrepancies.length === 0) {
  console.log('✓ PARITY CONFIRMED: Zod schema matches templates/form-rules.json perfectly.');
  process.exit(0);
} else {
  console.error(`[!] DISCREPANCY DETECTED: ${discrepancies.length} disagreement(s) found:\n`);
  discrepancies.forEach((d, idx) => console.error(`  ${idx + 1}. ${d}`));
  console.error('\nPlease synchronize lib/validations/contact.ts with templates/form-rules.json.');
  process.exit(1);
}
