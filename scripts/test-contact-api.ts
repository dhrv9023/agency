import type { NextRequest } from 'next/server';
import { POST } from '../app/api/contact/route';

function createMockRequest(url: string, init: RequestInit): NextRequest {
  return new Request(url, init) as unknown as NextRequest;
}

async function runTests() {
  console.log('=============================================================================');
  console.log('VARAH SYSTEMS — /api/contact Route Integration & Security Verification');
  console.log('=============================================================================\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Validation Failure (Invalid email & short message)
  try {
    const badReq = createMockRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.1',
      },
      body: JSON.stringify({
        name: 'A', // too short (< 2)
        email: 'not-an-email',
        company: 'X', // too short (< 2)
        message: 'short', // too short (< 10)
        turnstileToken: '1x00000000000000000000AA',
      }),
    });

    const res = await POST(badReq);
    const json = await res.json();

    if (res.status === 400 && json.success === false && json.issues?.length > 0) {
      console.log('✓ [PASS] Test 1: Zod validation correctly rejects invalid payload (400 with field issues)');
      passed++;
    } else {
      console.error('✗ [FAIL] Test 1: Expected 400 validation error, got:', res.status, json);
      failed++;
    }
  } catch (err) {
    console.error('✗ [FAIL] Test 1 Exception:', err);
    failed++;
  }

  // Test 2: Honeypot Trap Detection
  try {
    const hpReq = createMockRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.2',
      },
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'spammer@botnet.biz',
        company: 'Spam Corp',
        message: 'Buy cheap watches and luxury replicas here now!',
        website_hp: 'http://malicious-spam-site.biz', // HONEYPOT TRIGGER
      }),
    });

    const res = await POST(hpReq);
    const json = await res.json();

    if (res.status === 200 && json.success === true && json.id.startsWith('lead_hp_')) {
      console.log('✓ [PASS] Test 2: Honeypot silently trapped spam bot with synthetic 200');
      passed++;
    } else {
      console.error('✗ [FAIL] Test 2: Expected synthetic 200 for honeypot, got:', res.status, json);
      failed++;
    }
  } catch (err) {
    console.error('✗ [FAIL] Test 2 Exception:', err);
    failed++;
  }

  // Test 3: Valid Lead Submission
  try {
    const validReq = createMockRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.3',
      },
      body: JSON.stringify({
        name: 'Enterprise Director',
        email: 'director@enterprise-client.com',
        company: 'Apex Logistics Corp',
        serviceInterest: 'Autonomous Operations',
        budgetRange: '$25,000 - $50,000',
        message: 'Looking to automate our dispatch reconciliation pipeline across multiple warehouse management systems.',
        preferredTimes: 'Tue / Thu 2:00 PM - 5:00 PM EST',
        turnstileToken: '1x00000000000000000000AA',
      }),
    });

    const res = await POST(validReq);
    const json = await res.json();

    if (res.status === 200 && json.success === true && json.responseSla === 'We reply within one business day.') {
      console.log('✓ [PASS] Test 3: Valid submission processed with standardized SLA: "We reply within one business day."');
      passed++;
    } else {
      console.error('✗ [FAIL] Test 3: Expected 200 with standardized SLA, got:', res.status, json);
      failed++;
    }
  } catch (err) {
    console.error('✗ [FAIL] Test 3 Exception:', err);
    failed++;
  }

  // Test 4: Rate Limiting Enforcement (5 allowed, 6th rejected with 429)
  try {
    const testIp = '198.51.100.42';
    let hitRateLimit = false;

    for (let i = 1; i <= 6; i++) {
      const rlReq = createMockRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIp,
        },
        body: JSON.stringify({
          name: `Rate Limit Tester ${i}`,
          email: `tester_${i}@ratelimit-test.org`,
          company: 'RateLimit Test Inc',
          message: `Testing request rate limit submission number ${i}.`,
          turnstileToken: '1x00000000000000000000AA',
        }),
      });

      const res = await POST(rlReq);
      if (i <= 5) {
        if (res.status !== 200) {
          console.warn(`Request ${i} returned status ${res.status}`);
        }
      } else {
        // 6th request must be 429
        if (res.status === 429 && res.headers.get('Retry-After')) {
          hitRateLimit = true;
          console.log(`✓ [PASS] Test 4: 6th request blocked with 429 Too Many Requests (Retry-After: ${res.headers.get('Retry-After')}s)`);
          passed++;
        } else {
          console.error(`✗ [FAIL] Test 4: 6th request expected 429, got status ${res.status}`);
          failed++;
        }
      }
    }

    if (!hitRateLimit && failed === 0) {
      console.error('✗ [FAIL] Test 4: Rate limit was not triggered on 6th request.');
      failed++;
    }
  } catch (err) {
    console.error('✗ [FAIL] Test 4 Exception:', err);
    failed++;
  }

  // Test 5: Cloudflare Turnstile Missing Token Rejection
  try {
    const noTurnstileReq = createMockRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.55',
      },
      body: JSON.stringify({
        name: 'Human User',
        email: 'human@legit-user.com',
        company: 'Legit Company',
        message: 'This is a valid inquiry message from a legit user.',
        // Missing turnstileToken
      }),
    });

    const res = await POST(noTurnstileReq);
    const json = await res.json();

    if (res.status === 400 && json.success === false && json.error?.includes('Security challenge verification token missing')) {
      console.log('✓ [PASS] Test 5: Missing Turnstile verification token correctly rejected (400)');
      passed++;
    } else {
      console.error('✗ [FAIL] Test 5: Expected 400 for missing Turnstile token, got:', res.status, json);
      failed++;
    }
  } catch (err) {
    console.error('✗ [FAIL] Test 5 Exception:', err);
    failed++;
  }

  console.log('\n-----------------------------------------------------------------------------');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('-----------------------------------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
