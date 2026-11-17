import { useState, useRef, useEffect } from "react";
import { Send, Trash2, User } from "lucide-react";
import { chat as chatAPI } from "../lib/api";
import logoImg from "../assets/logo.png"; // Logo import kiya

export default function Chat() {
  const [messages, setMessages] = useState([
    { 
      role: "bot", 
      text: "Namaste! Welcome to SchemeSaathi.\n\nI can help you discover government schemes that match your needs.\n\nLet's start by getting to know a little about you." 
    }
  ]);
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState({});
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const data = await chatAPI(text, profile, lang);
      if (data.profile) setProfile(data.profile);

      let botText = "";
      if (data.ask_next?.question) {
        botText = data.ask_next.question;
      } else if (data.results?.length > 0) {
        botText = `Great! I found ${data.results.length} scheme(s) that you might be eligible for. Let's look at the details.`;
      } else {
        botText = "Tell me a bit more about yourself and I'll keep looking.";
      }

      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, something went wrong connecting to the server. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([{ 
      role: "bot", 
      text: "Namaste! Welcome to SchemeSaathi.\n\nI can help you discover government schemes that match your needs." 
    }]);
    setProfile({});
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-5xl flex-col px-4 py-6">
      
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gov-blue">AI Assistant</h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> 
            Online · Chat in English or Hindi
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded border border-gray-300 text-xs font-semibold">
            <button onClick={() => setLang("en")} className={`px-3 py-1.5 ${lang === "en" ? "bg-gov-blue text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>EN</button>
            <button onClick={() => setLang("hi")} className={`px-3 py-1.5 ${lang === "hi" ? "bg-gov-blue text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>हिं</button>
          </div>
          
          <button 
            onClick={clearChat} 
            className="flex items-center gap-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto rounded-md border border-gray-200 bg-white p-4 shadow-sm scrollbar-thin">
        <div className="space-y-6">
          
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div key={i} className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                {/* Avatar - Changed to SchemeSaathi Logo for Bot */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden border ${isUser ? "bg-gov-blue text-white border-gov-blue" : "bg-white border-gray-300"}`}>
                  {isUser ? (
                    <User size={16} />
                  ) : (
                    <img src={logoImg} alt="SchemeSaathi" className="h-full w-full object-cover p-0.5" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser 
                    ? "rounded-br-sm bg-gov-blue text-white" 
                    : "rounded-bl-sm border border-gray-200 bg-gray-50 text-gray-800"
                }`}>
                  {m.text}
                </div>
              </div>
            );
          })}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-end gap-3">
               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden border border-gray-300 bg-white">
                  <img src={logoImg} alt="SchemeSaathi" className="h-full w-full object-cover p-0.5" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-gray-200 bg-gray-50 px-4 py-4">
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-200" />
              </div>
            </div>
          )}
          
          <div ref={endRef} />
        </div>
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && !loading && (
        <div className="mt-3 flex flex-wrap gap-2">
          {["I am a farmer in Bihar.", "I am a college student.", "I need a business loan."].map(p => (
            <button key={p} onClick={() => { setInput(p); }} className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-600 hover:border-gov-blue hover:text-gov-blue">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* INPUT AREA */}
      <form onSubmit={send} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me about yourself (e.g., I am a farmer in Bihar)..."
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gov-blue focus:outline-none focus:ring-1 focus:ring-gov-blue shadow-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-[46px] w-[46px] items-center justify-center rounded-md bg-gov-blue text-white transition hover:bg-gov-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Send size={18} />
        </button>
      </form>

    </div>
  );
}