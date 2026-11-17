import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle2, ExternalLink, HelpCircle, Clock, AlertCircle } from "lucide-react";
import { SAMPLE_SCHEMES } from "../data/mockdata";

export default function Results() {
  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => { setSchemes(SAMPLE_SCHEMES); setLoading(false); }, 500);
    return () => clearTimeout(t);
  }, []);

  const eligible = schemes.filter((s) => s.status === "eligible");
  const needsInfo = schemes.filter((s) => s.status === "needs_info");
  const nearMiss = schemes.filter((s) => s.status === "near_miss");
  const mergedDocs = Array.from(new Set(eligible.flatMap((s) => s.documents || [])));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <Link to="/chat" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gov-text-muted hover:text-gov-blue">
        <ArrowLeft size={14} /> Back to chat
      </Link>

      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gov-blue">Your Results</p>
        <h1 className="mt-3 font-display text-4xl text-gov-text md:text-5xl">Scheme matches</h1>
        <p className="mt-3 max-w-2xl text-sm text-gov-text-muted">
          Based on your profile. Results are indicative — always verify on official government portals.
        </p>
      </div>

      {/* STATUS SUMMARY CARDS */}
      <div className="mb-10 grid gap-4 md:grid-cols-4">
        <Stat label="Total" value={schemes.length} tone="ink" />
        <Stat label="Eligible" value={eligible.length} tone="leaf" />
        <Stat label="Needs Info" value={needsInfo.length} tone="amber" />
        <Stat label="Almost" value={nearMiss.length} tone="orange" />
      </div>

      {/* MERGED DOCUMENTS */}
      {mergedDocs.length > 0 && (
        <div className="mb-10 overflow-hidden rounded-md border border-gov-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gov-text">
            <FileText size={16} className="text-gov-blue" /> Combined document checklist
          </h3>
          <div className="flex flex-wrap gap-2">
            {mergedDocs.map((d) => (
              <span key={d} className="rounded-sm border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gov-text-muted">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SECTIONS */}
      <Section title="Eligible Schemes" count={eligible.length}>
        {eligible.map((s, i) => <SchemeCard key={s.id} scheme={s} index={i} />)}
      </Section>

      {needsInfo.length > 0 && (
        <Section title="More Information Required" count={needsInfo.length}>
          {needsInfo.map((s, i) => <SchemeCard key={s.id} scheme={s} index={i} />)}
        </Section>
      )}

      {nearMiss.length > 0 && (
        <Section title="Almost Eligible" count={nearMiss.length}>
          {nearMiss.map((s, i) => <SchemeCard key={s.id} scheme={s} index={i} />)}
        </Section>
      )}
    </div>
  );
}

function Stat({ label, value, tone }) {
  const tones = {
    ink: "border-gov-blue bg-gov-blue text-white",
    leaf: "border-green-200 bg-green-50 text-green-700",
    amber: "border-yellow-200 bg-yellow-50 text-yellow-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
  };
  return (
    <div className={`rounded-md border p-5 shadow-sm ${tones[tone]}`}>
      <p className="text-[11px] font-bold uppercase tracking-wider opacity-90">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center gap-3 border-b border-gov-border pb-2">
        <h2 className="font-display text-2xl font-bold text-gov-text">{title}</h2>
        <span className="rounded-sm bg-gov-blue text-white px-2 py-0.5 text-xs font-bold">{count}</span>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function SchemeCard({ scheme }) {
  const statusConfig = {
    eligible: { text: "Eligible", color: "bg-green-100 text-green-800 border-green-300" },
    needs_info: { text: "Needs Info", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    near_miss: { text: "Almost Eligible", color: "bg-orange-100 text-orange-800 border-orange-300" },
  };
  const status = statusConfig[scheme.status] || { text: scheme.status, color: "bg-gray-100" };

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-gov-border bg-white shadow-sm">
      <div className="flex items-start justify-between border-b border-gov-border bg-gray-50 p-4">
        <div>
          <h3 className="font-bold text-lg text-gov-blue">{scheme.name}</h3>
          <p className="mt-1 text-xs uppercase text-gov-text-muted">{scheme.category}</p>
        </div>
        {scheme.status && (
          <span className={`rounded-sm border px-2 py-1 text-[10px] font-bold uppercase ${status.color}`}>
            {status.text}
          </span>
        )}
      </div>

      <div className="flex-grow p-4">
        <p className="mb-4 text-sm text-gov-text">{scheme.benefit}</p>

        {scheme.why_matched?.length > 0 && (
          <div className="mb-3 rounded border border-blue-100 bg-blue-50/50 p-3 text-xs text-gov-blue">
            <p className="mb-1 flex items-center gap-1 font-bold"><CheckCircle2 size={12}/> Why you qualify:</p>
            <ul className="list-disc space-y-1 pl-4">
              {scheme.why_matched.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        {scheme.missing_fields?.length > 0 && (
          <div className="mb-3 rounded border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
            <p className="mb-1 font-bold">Missing Information:</p>
            <p>{scheme.missing_fields.map((f) => f.replace(/_/g, " ")).join(", ")}</p>
          </div>
        )}

        {scheme.unmet?.length > 0 && (
          <div className="mb-3 rounded border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800">
            <p className="mb-1 font-bold">You would qualify if:</p>
            <ul className="list-disc space-y-1 pl-4">
              {scheme.unmet.map((u, i) => <li key={i}>{u}</li>)}
            </ul>
          </div>
        )}

        {scheme.documents?.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 flex items-center gap-1 text-xs font-bold text-gov-text"><FileText size={12}/> Documents Required:</p>
            <ul className="list-disc pl-5 text-xs text-gov-text-muted">
              {scheme.documents.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gov-border bg-gray-50 p-4">
        {scheme.official_url ? (
          <a href={scheme.official_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold text-gov-blue hover:underline">
            Apply on Official Portal <ExternalLink size={14} />
          </a>
        ) : (
          <span className="text-sm text-gray-400">Link not available</span>
        )}
      </div>
    </div>
  );
}