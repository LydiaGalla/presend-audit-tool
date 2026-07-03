"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("email");
  const [demographic, setDemographic] = useState("general consumer (25-44)");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAudit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, contentType, demographic }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-white">PreSend Audit Tool</h1>
        <p className="text-gray-400 mb-8">
          Paste your email or SMS copy below and get an instant readability and compliance audit before you send.
        </p>

        <div className="bg-gray-900 rounded-2xl p-6 mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Content Type</label>
              <select
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="email">Email</option>
                <option value="SMS">SMS</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Target Demographic</label>
              <select
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
                value={demographic}
                onChange={(e) => setDemographic(e.target.value)}
              >
                <option>general consumer (25-44)</option>
                <option>older adult (55+)</option>
                <option>young adult (18-24)</option>
                <option>financial investor audience</option>
                <option>small business owner</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Paste Your Copy</label>
            <textarea
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 h-48 resize-none"
              placeholder="Paste your email or SMS content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button
            onClick={handleAudit}
            disabled={loading || !content.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Auditing..." : "Run Audit"}
          </button>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {result && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Readability</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.readabilityVerdict === "Pass" ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"}`}>
                  {result.readabilityVerdict}
                </span>
              </div>
              <div className="mb-3">
                <span className="text-gray-400 text-sm">Audience Alignment Score</span>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${result.readabilityScore * 10}%` }}
                    />
                  </div>
                  <span className="font-bold text-lg">{result.readabilityScore}/10</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{result.readabilitySummary}</p>
              {result.readabilityIssues?.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-red-400 font-medium mb-1">Issues</p>
                  <ul className="space-y-1">
                    {result.readabilityIssues.map((issue, i) => (
                      <li key={i} className="text-sm text-gray-300">• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.readabilitySuggestions?.length > 0 && (
                <div>
                  <p className="text-sm text-green-400 font-medium mb-1">Suggestions</p>
                  <ul className="space-y-1">
                    {result.readabilitySuggestions.map((s, i) => (
                      <li key={i} className="text-sm text-gray-300">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Compliance</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.complianceVerdict === "Pass" ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"}`}>
                  {result.complianceVerdict}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4">{result.complianceSummary}</p>
              <div className="space-y-3">
                {result.complianceChecks?.map((check, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`mt-0.5 text-lg ${check.status === "Pass" ? "text-green-400" : "text-red-400"}`}>
                      {check.status === "Pass" ? "✓" : "✗"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{check.item}</p>
                      <p className="text-xs text-gray-400">{check.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
        <footer className="mt-12 text-center text-gray-600 text-sm">
        Built by Lydia Gallagher
        </footer>
    </main>
  );
}