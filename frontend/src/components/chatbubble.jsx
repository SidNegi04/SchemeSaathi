import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

export default function ChatBubble({ role, text }) {
  const isUser = role === "user";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isUser ? "bg-ink-900 text-white" : "bg-gradient-to-br from-leaf-500 to-leaf-600 text-white"} shadow-sm`}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>
      <div className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isUser ? "rounded-br-md bg-ink-900 text-white" : "rounded-bl-md border border-ink-200 bg-white text-ink-900 shadow-sm"}`}>
        {text}
      </div>
    </motion.div>
  );
}