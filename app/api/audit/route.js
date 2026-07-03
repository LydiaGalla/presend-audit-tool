import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, contentType, demographic } = body;

    if (!content || !contentType || !demographic) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (content.length > 10000) {
      return Response.json({ error: "Content too long" }, { status: 400 });
    }

    const prompt = `You are an expert in marketing compliance, readability, and audience alignment. Audit the following ${contentType} marketing content for a ${demographic} audience.

Content to audit:
"""
${content}
"""

Provide your audit in this exact JSON format:
{
  "readabilityScore": <number 1-10, where 10 is perfectly matched to the audience>,
  "readabilityVerdict": "<Pass or Fail>",
  "readabilitySummary": "<2-3 sentences explaining the readability assessment>",
  "readabilityIssues": ["<issue 1>", "<issue 2>"],
  "readabilitySuggestions": ["<suggestion 1>", "<suggestion 2>"],
  "complianceVerdict": "<Pass or Fail>",
  "complianceSummary": "<2-3 sentences explaining overall compliance>",
  "complianceChecks": [
    {"item": "Unsubscribe/Opt-out language", "status": "<Pass or Fail>", "note": "<brief explanation>"},
    {"item": "Sender identification", "status": "<Pass or Fail>", "note": "<brief explanation>"},
    {"item": "Deceptive subject line or claims", "status": "<Pass or Fail>", "note": "<brief explanation>"},
    {"item": "Accessibility language (plain language standards)", "status": "<Pass or Fail>", "note": "<brief explanation>"},
    {"item": "Spam trigger words", "status": "<Pass or Fail>", "note": "<brief explanation>"}
  ]
}

Return only valid JSON, no extra text.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(raw);

    result.readabilityIssues = Array.isArray(result.readabilityIssues) ? result.readabilityIssues : [];
    result.readabilitySuggestions = Array.isArray(result.readabilitySuggestions) ? result.readabilitySuggestions : [];
    result.complianceChecks = Array.isArray(result.complianceChecks) ? result.complianceChecks : [];

    return Response.json(result);

  } catch (error) {
    console.error("Audit error:", error);
    return Response.json({ error: "Audit failed. Please try again." }, { status: 500 });
  }
}