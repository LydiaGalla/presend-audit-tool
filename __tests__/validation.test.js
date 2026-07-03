import { jest, describe, test, expect } from '@jest/globals';

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
              readabilityIssues: [],
              readabilitySuggestions: [],
              complianceVerdict: 'Pass',
              complianceSummary: 'Test compliance summary',
              complianceChecks: []
            })
          }]
        })
      }
    }))
  };
});

const { POST } = await import('../app/api/audit/route.js');

describe('Input Validation', () => {

  test('returns 400 when contentType is missing', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Test content', demographic: 'general consumer (25-44)' })
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  test('returns 400 when demographic is missing', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Test content', contentType: 'email' })
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  test('returns 400 when content is empty string', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '', contentType: 'email', demographic: 'general consumer (25-44)' })
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  test('accepts SMS as valid content type', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Test SMS content', contentType: 'SMS', demographic: 'general consumer (25-44)' })
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  test('response always contains complianceChecks array', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Test content', contentType: 'email', demographic: 'general consumer (25-44)' })
    });
    const response = await POST(request);
    const data = await response.json();
    expect(Array.isArray(data.complianceChecks)).toBe(true);
  });

  test('response always contains readabilitySuggestions array', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Test content', contentType: 'email', demographic: 'general consumer (25-44)' })
    });
    const response = await POST(request);
    const data = await response.json();
    expect(Array.isArray(data.readabilitySuggestions)).toBe(true);
  });

});