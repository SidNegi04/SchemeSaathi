const STYLES = {
  eligible: "bg-leaf-50 text-leaf-700 border-leaf-200",
  needs_info: "bg-amber-50 text-amber-700 border-amber-200",
  near_miss: "bg-orange-50 text-orange-700 border-orange-200",
  verified: "bg-leaf-50 text-leaf-700 border-leaf-200",
  unverified: "bg-ink-50 text-ink-500 border-ink-200",
};
const LABELS = {
  eligible: "Eligible", needs_info: "Needs Info",
  near_miss: "Almost Eligible", verified: "Verified", unverified: "Unverified",
};

export default function Badge({ status, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STYLES[status] || "bg-ink-50 text-ink-600 border-ink-200"}`}>
      {children || LABELS[status] || status}
    </span>
  );
}