import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export default function EmptyState({ title, description, action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-white px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-50 text-ink-400">
        <SearchX size={28} />
      </div>
      <h3 className="font-display text-xl text-ink-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}