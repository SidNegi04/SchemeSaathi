import { CheckCircle2, ExternalLink, FileText, Info } from "lucide-react";

export default function SchemeCard({ scheme }) {
  const statusConfig = {
    eligible: { text: "Eligible", color: "bg-green-100 text-green-800 border-green-300" },
    needs_info: { text: "Needs Info", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    near_miss: { text: "Almost Eligible", color: "bg-orange-100 text-orange-800 border-orange-300" },
  };
  
  const status = statusConfig[scheme.status] || { text: scheme.status, color: "bg-gray-100 text-gray-800" };

  return (
    <div className="card flex flex-col p-0 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gray-50 border-b border-gov-border p-4 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gov-blue">{scheme.name}</h3>
          <p className="text-xs uppercase text-gov-text-muted mt-1">{scheme.category}</p>
        </div>
        {scheme.status && (
          <span className={`px-2 py-1 text-[10px] font-bold uppercase border rounded-sm ${status.color}`}>
            {status.text}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-grow">
        <p className="text-sm text-gov-text mb-4">{scheme.benefit}</p>

        {scheme.why_matched?.length > 0 && (
          <div className="mb-3 bg-blue-50/50 p-3 rounded border border-blue-100 text-xs text-gov-blue">
            <p className="font-bold mb-1 flex items-center gap-1"><CheckCircle2 size={12}/> Why you qualify:</p>
            <ul className="list-disc pl-4 space-y-1">
              {scheme.why_matched.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        {scheme.missing_fields?.length > 0 && (
          <div className="mb-3 bg-yellow-50 p-3 rounded border border-yellow-200 text-xs text-yellow-800">
            <p className="font-bold mb-1">Missing Information:</p>
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
            <p className="text-xs font-bold text-gov-text flex items-center gap-1 mb-1"><FileText size={12}/> Documents Required:</p>
            <ul className="text-xs text-gov-text-muted list-disc pl-5">
              {scheme.documents.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="bg-gray-50 p-4 border-t border-gov-border flex items-center justify-between">
        {scheme.official_url ? (
          <a href={scheme.official_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-gov-blue hover:underline flex items-center gap-1">
            Apply on Official Portal <ExternalLink size={14} />
          </a>
        ) : (
          <span className="text-sm text-gray-400">Link not available</span>
        )}
      </div>
    </div>
  );
}