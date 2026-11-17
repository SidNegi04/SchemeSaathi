// ═══════════════════════════════════════════════════════════════
// API stubs — another dev replaces USE_MOCK=true with real calls.
// Signatures match FastAPI endpoints: /chat, /match, /schemes
// ═══════════════════════════════════════════════════════════════
import { SAMPLE_SCHEMES, ALL_SCHEMES, SAMPLE_PROFILE } from "../data/mockdata";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true"; // set VITE_USE_MOCK=true to demo without the backend

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function chat(message, profile, lang = "en") {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return {
      results: SAMPLE_SCHEMES.slice(0, 3),
      ask_next: { field: "has_bank_account", question: "Do you have a bank account?" },
      disclaimer: "Please confirm eligibility and details on the official website before applying.",
      profile: { ...SAMPLE_PROFILE, ...profile },
      extracted_by: "mock",
    };
  }
  return post("/chat", { message, profile, lang });
}

export async function getSchemes() {
  if (USE_MOCK) { await new Promise((r) => setTimeout(r, 300)); return ALL_SCHEMES; }
  const res = await fetch(`${BASE}/schemes`);
  return res.json();
}

export async function match(profile, lang = "en") {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return {
      results: SAMPLE_SCHEMES,
      merged_documents: ["Aadhaar", "Bank account details", "Land ownership record"],
      ask_next: null,
      disclaimer: "Please confirm eligibility and details on the official website before applying.",
    };
  }
  return post("/match", { profile, lang });
}