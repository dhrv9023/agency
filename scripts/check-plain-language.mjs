#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');

function getAllHtmlFiles(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (['dev', 'dist', 'assets', 'node_modules', '.next'].includes(item.name)) continue;
      files.push(...getAllHtmlFiles(full));
    } else if (item.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function getFleschKincaid(text) {
  const mainMatch = text.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const targetText = mainMatch ? mainMatch[1] : text;
  const clean = targetText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
  const sentences = clean.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = clean.split(/\s+/).filter(w => /^[a-zA-Z0-9]+$/.test(w));
  if (sentences.length === 0 || words.length === 0) return { grade: 0, readingEase: 100, words: 0, sentences: 0 };
  
  function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }
  let totalSyllables = 0;
  for (const w of words) totalSyllables += countSyllables(w);
  const ASL = words.length / sentences.length;
  const ASW = totalSyllables / words.length;
  const fkGrade = 0.39 * ASL + 11.8 * ASW - 15.59;
  const fkEase = 206.835 - 1.015 * ASL - 84.6 * ASW;
  return { grade: Math.round(fkGrade * 10) / 10, readingEase: Math.round(fkEase * 10) / 10, words: words.length, sentences: sentences.length };
}

const bannedTerms = [
  'LLM', 'RAG', 'agentic', 'autonomous agent', 'orchestration', 'pipeline',
  'deterministic', 'inference', 'vector database', 'fine-tuning', 'hallucination',
  'scalable', 'synergy', 'end-to-end', 'leverage', 'seamless', 'cutting-edge',
  'revolutionary', 'game-changing', 'unlock', 'supercharge'
];

const bannedRegex = new RegExp(`\\b(${bannedTerms.join('|')})\\b`, 'i');

const files = getAllHtmlFiles(publicDir);
let highGradeCount = 0;
let jargonCount = 0;

console.log('================================================================');
console.log('         VARAH SYSTEMS — PLAIN-LANGUAGE READABILITY AUDIT       ');
console.log('================================================================');
console.log('Page | Flesch-Kincaid Grade | Target | Status');
console.log('----------------------------------------------------------------');

for (const file of files) {
  const rel = path.relative(publicDir, file);
  // Skip dev or internal admin
  if (rel === 'admin.html' || rel.startsWith('dev/')) continue;

  const content = fs.readFileSync(file, 'utf8');
  const fk = getFleschKincaid(content);
  const passes = fk.grade <= 9.5;
  if (!passes) highGradeCount++;

  const status = passes ? '✅ PASS' : '⚠️ HIGH';
  console.log(`${rel.padEnd(35)} | ${String(fk.grade).padStart(5)} | <= 9.0 | ${status}`);
}

console.log('----------------------------------------------------------------');
console.log(`Audited ${files.length} pages. Pages requiring readability lowering: ${highGradeCount}`);
