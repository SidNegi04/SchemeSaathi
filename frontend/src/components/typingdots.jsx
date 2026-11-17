import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function TypingDots() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-leaf-500 to-leaf-600 text-white shadow-sm">
        <Bot size={14} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-ink-200 bg-white px-4 py-3.5 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-ink-400" animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </div>
    </div>
  );
}