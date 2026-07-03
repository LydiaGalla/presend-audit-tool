import { jest, describe, test, expect } from '@jest/globals';

// Mock must happen before import
jest.unstable_mockModule('@anthropic-ai/sdk', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{
            type: 'text',
            text: JSON.stringify({
              readabilityScore: 7,
              readabilityVerdict: 'Pass',
              readabilitySummary: 'Test summary',
              readabilityIssues: ['Issue 1'],
              readabilitySuggestions: ['Suggestion 1'],
              complianceVerdict: 'Pass',
              complianceSummary: 'Test compliance summary',
              complianceChecks: [
                { item: 'Unsubscribe/Opt-out language', status: 'Pass', note: 'Present' },
                { item: 'Sender identification', status: 'Pass', note: 'Present' },
                { item: 'Deceptive subject line or claims', status: 'Pass', note: 'None found' },
                { item: 'Accessibility language (plain language standards)', status: 'Pass', note: 'Clear' },
                { item: 'Spam trigger words', status: 'Pass', note: 'None found' }
              ]
            })
          }]
        })
      }
    }))
  };
});

const { POST } = await import('../app/api/audit/route.js');

describe('POST /api/audit', () => {

  test('returns 400 when content is missing', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType: 'email', demographic: 'general consumer (25-44)' })
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  test('returns 400 when content exceeds 10000 characters', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'a'.repeat(10001),
        contentType: 'email',
        demographic: 'general consumer (25-44)'
      })
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  test('returns 200 with valid input', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Test email content',
        contentType: 'email',
        demographic: 'general consumer (25-44)'
      })
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  test('normalizes readabilityIssues to array', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Test email content',
        contentType: 'email',
        demographic: 'general consumer (25-44)'
      })
    });
    const response = await POST(request);
    const data = await response.json();
    expect(Array.isArray(data.readabilityIssues)).toBe(true);
  });

  test('returns readabilityScore between 1 and 10', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Test email content',
        contentType: 'email',
        demographic: 'general consumer (25-44)'
      })
    });
    const response = await POST(request);
    const data = await response.json();
    expect(data.readabilityScore).toBeGreaterThanOrEqual(1);
    expect(data.readabilityScore).toBeLessThanOrEqual(10);
  });

});