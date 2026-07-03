import { jest, describe, test, expect } from '@jest/globals';

jest.unstable_mockModule('@anthropic-ai/sdk', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{
            type: 'text',
            text: JSON.stringify({
              readabilityScore: 5,
              readabilityVerdict: 'Pass',
              readabilitySummary: 'Test summary',
              readabilityIssues: 'None',
              readabilitySuggestions: 'None',
              complianceVerdict: 'Pass',
              complianceSummary: 'Test compliance summary',
              complianceChecks: 'None'
            })
          }]
        })
      }
    }))
  };
});

const { POST } = await import('../app/api/audit/route.js');

describe('Edge Cases', () => {

  test('handles model returning string instead of array for readabilityIssues', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Perfect clean copy',
        contentType: 'email',
        demographic: 'general consumer (25-44)'
      })
    });
    const response = await POST(request);
    const data = await response.json();
    expect(Array.isArray(data.readabilityIssues)).toBe(true);
    expect(data.readabilityIssues).toHaveLength(0);
  });

  test('handles model returning string instead of array for complianceChecks', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Perfect clean copy',
        contentType: 'email',
        demographic: 'general consumer (25-44)'
      })
    });
    const response = await POST(request);
    const data = await response.json();
    expect(Array.isArray(data.complianceChecks)).toBe(true);
  });

  test('handles very short SMS content', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Hi',
        contentType: 'SMS',
        demographic: 'young adult (18-24)'
      })
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  test('handles content at exactly 10000 characters', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'a'.repeat(10000),
        contentType: 'email',
        demographic: 'general consumer (25-44)'
      })
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  test('response structure always has readabilityVerdict', async () => {
    const request = new Request('http://localhost/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Test content',
        contentType: 'email',
        demographic: 'older adult (55+)'
      })
    });
    const response = await POST(request);
    const data = await response.json();
    expect(data.readabilityVerdict).toBeDefined();
  });

});