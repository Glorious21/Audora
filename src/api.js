// Fetch wrapper around the Audora backend. Same-origin in dev via the Vite
// proxy (/api → :3001) so the MemWal delegate key never reaches the browser.

async function json(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || body.error || `HTTP ${res.status}`);
  return body;
}

export const api = {
  health: () => fetch("/api/health").then(json),

  capture: (fields) =>
    fetch("/api/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    }).then(json),

  jobStatus: (jobId) => fetch(`/api/memories/status/${jobId}`).then(json),

  recall: (q) => fetch(`/api/memories/search?q=${encodeURIComponent(q)}`).then(json),
};
