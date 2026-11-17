import { useState } from "react";
import { motion } from "framer-motion";
import { Save, User } from "lucide-react";
import { SAMPLE_PROFILE } from "../data/mockdata";

const FIELDS = [
  { key: "name", label: "Full Name", type: "text" },
  { key: "state", label: "State", type: "text" },
  { key: "age", label: "Age", type: "number" },
  { key: "gender", label: "Gender", type: "select", options: ["male", "female", "other"] },
  { key: "occupation", label: "Occupation", type: "select", options: ["farmer", "student", "small_business", "salaried", "unemployed", "other"] },
  { key: "annual_income", label: "Annual Income (₹)", type: "number" },
  { key: "land_acres", label: "Land (acres)", type: "number" },
  { key: "category", label: "Category", type: "select", options: ["general", "obc", "sc", "st", "ews"] },
  { key: "has_bank_account", label: "Has Bank Account", type: "boolean" },
  { key: "has_girl_child_under_10", label: "Girl child under 10", type: "boolean" },
];

export default function Profile() {
  const [profile, setProfile] = useState(SAMPLE_PROFILE);
  const [saved, setSaved] = useState(false);

  function update(key, value) {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function save(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-leaf-500 to-leaf-600 text-white shadow-lg">
          <User size={28} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-600">Account</p>
          <h1 className="mt-1 font-display text-4xl text-ink-900">Your profile</h1>
        </div>
      </div>

      <form onSubmit={save} className="card p-8">
        <div className="grid gap-6 md:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">{f.label}</label>
              {f.type === "select" ? (
                <select value={profile[f.key] || ""} onChange={(e) => update(f.key, e.target.value)} className="input">
                  <option value="">Select…</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === "boolean" ? (
                <div className="flex gap-2">
                  {[true, false].map((v) => (
                    <button key={String(v)} type="button" onClick={() => update(f.key, v)} className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${profile[f.key] === v ? "border-leaf-500 bg-leaf-50 text-leaf-700" : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"}`}>
                      {v ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              ) : (
                <input type={f.type} value={profile[f.key] ?? ""} onChange={(e) => update(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)} className="input" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-ink-100 pt-6">
          {saved ? <p className="text-sm font-medium text-leaf-600">✓ Profile saved (placeholder)</p> : <p className="text-xs text-ink-400">Changes are local until you connect the backend.</p>}
          <button type="submit" className="btn-primary ml-auto"><Save size={15} /> Save Profile</button>
        </div>
      </form>
    </motion.div>
  );
}