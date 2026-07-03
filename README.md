# PreSend Audit Tool

A pre-send content auditing tool for email and SMS marketing copy. Powered by Claude (Anthropic).

**Live demo:** https://presend-audit-tool.vercel.app

---

## What does this tool do?

The tool that I created is a pre-send content auditor. This product is designed to sit between content creation and publishing, essentially a QA layer for marketing copy.

Considering It's Today Media's role in scaling email and SMS lists, I created this product for the teams sending high volumes of these marketing messages, it will allow the team to assess the readability and compliance of their messages before they ever reach a client.

While the product itself is simple, the return is invaluable. The user pastes their message then selects their content type (SMS or email) and target demographic, then selects Run Audit. In return they will receive two assessments of readability and compliance.

Using an API call to Claude, the tool analyzes their writing and flags potential issues with vocabulary, complexity of terms used, and audience misalignment. The compliance assessment catches legal red flags, spam trigger words, and deceptive claims.

Assessment results display instantly providing a clear explanation of any issues and suggestions for improvements. For a team putting out a high volume of content, an audit before sending to catch any issues is highly favorable over a flop email that requires later revisions.

---

## Why did I build this one?

When language is too complex, misaligned with the audience, or legally non-compliant, leads and prospective clients can be lost before conversion. My background sits at a unique intersection that has positioned me to see this problem clearly. I hold a master's degree in reading education and spent years as a certified reading specialist implementing structured literacy programs, working with dyslexic learners, and owning a private dyslexia therapy business with 25+ clients and three school district contracts.

I then pivoted into tech, completing a software engineering bootcamp and landing a role as a Software Test Analyst at Körber Supply Chain, where my job is finding what breaks before it reaches end users. In this role, I have also rewritten dozens of user manuals produced by solutions architects to make them accessible to warehouse managers, which is the exact same skill as auditing marketing copy for audience alignment. I have taken highly technical documents and converted them not only into readable guides but also a scalable training platform made up of individual courses that is currently in use internally at my organization with intention to sell in the next year.

On top of these responsibilities, I run all social media and marketing for a local Pittsburgh restaurant and manage two high-following accounts of my own, so I understand the content creation side firsthand.

Because of this broad yet focused background, I understand at a research level, not just intuitively, why language complexity and vocabulary mismatch loses audiences before they ever act. In my current role in QA, I have seen firsthand how the misalignment causes failed communication, confusion, and even distrust or skepticism from the client. In my personal pursuits within content creation, I have honed in on the benefit of a brand voice and the importance of audience connection.

After researching how affiliate marketing operations work at scale, sending hundreds of thousands of emails and SMS messages daily across multiple platforms, I spent time considering where I could bring value. I realized compliance and readability failures at that volume aren't just embarrassing, they're expensive. My goal was to utilize what I know to build and maintain human connection and prevent those failures.

Every single bit of information being pushed out by a marketing team involves reading. Without dialing in on the opportunities behind understanding the science of language and connecting with the target audience, leads, and prospective clients are lost with each and every message.

Nobody on my team has built or considered a QA layer for copy. So I did.

---

## What would I build next?

If this were my full-time job, my first priority would be improving the robustness of my pre-send audit tool before expanding its scope.

On the technical side, the current tool parses Claude's response by stripping markdown formatting and converting it to JSON. A more reliable approach would be to use the Anthropic SDK's forced tool use feature to guarantee a clean, structured response without any parsing workarounds. I would also add rate limiting and authentication to the API endpoint to prevent abuse and protect against runaway costs. This would be something that matters before this tool could move into real production use.

From a product standpoint, the feature I would be most excited to add is brand voice profiles. Right now, the tool evaluates copy against demographic and compliance standards but has no knowledge of a specific brand's established voice, style, or overall theme. A brand like a financial publisher naturally would have a very different tone than a consumer lifestyle brand, meaning writing that scores well might still be completely off-brand or not necessarily appealing to the target audience. I would build a brand voice input layer so teams can define their tone, key phrases, and style, allowing the audit to also evaluate against those requirements in addition to the demographic and compliance checks.

Beyond that I would add bulk upload for teams running A/B tests across multiple copy variants, platform-specific compliance rulesets for Meta, Google, TikTok, and Taboola since each has policies beyond CAN-SPAM and TCPA, and an audit history dashboard so teams can track patterns in their failures over time and improve their content process systematically.

The bigger vision is a pre-send layer that becomes a standard step in the content workflow. In the same way that no engineer releases code without running tests, no marketing team should send at scale without running an audit.

More broadly, any tool I would build in this role would be guided by a simple idea: AI should make human communication more effective, not replace it. Successful marketing has always been about genuine connection with an audience. My goal would be to build tools that use AI to remove tedious obstacles that slow down production, catch mistakes, and clear the path for that connection to happen, allowing the humans on the team to focus on creative work that actually moves people.

---

## Setup

### Prerequisites
- Node.js 18+
- An Anthropic API key ([get one here](https://platform.anthropic.com))

### Installation

```bash
git clone https://github.com/LydiaGalla/presend-audit-tool.git
cd presend-audit-tool
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and add your Anthropic API key:

```bash
cp .env.example .env.local
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

```bash
npm test
```

See [TESTING.md](./TESTING.md) for full test documentation.

---

## Tech Stack

- **Next.js 15** — App Router, React 19
- **Tailwind CSS** — styling
- **Anthropic Claude API** — AI-powered audit engine
- **Vercel** — deployment
- **Jest** — testing