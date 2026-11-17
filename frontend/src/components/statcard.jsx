import { motion } from "framer-motion";

export default function StatCard({ value, label, note, index = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.08 }}
      className="card p-6 text-center">
      <p className="font-display text-3xl font-extrabold text-navy-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-700">{label}</p>
      {note && <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">{note}</p>}
    </motion.div>
  );
}