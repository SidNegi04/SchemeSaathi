import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, Trash2, User, Languages } from "lucide-react";
import { chat as chatAPI } from "../lib/api";
import logoImg from "../assets/logo.png";

const T = {
  en: {
    greeting:
      "Namaste! Welcome to SchemeSaathi.\n\nI can help you discover government schemes that match your needs.\n\nTell me a little about yourself, or pick an example below.",
    title: "AI Assistant",
    status: "Online · Chat in English or Hindi",
    placeholder: "Tell me about yourself (e.g., I am a farmer in Bihar)...",
    clear: "Clear",
    found: (n) => `Great! I found ${n} scheme(s) you may be eligible for.`,
    viewResults: "View my results",
    more: "Tell me a bit more about yourself and I'll keep looking.",
    error: "Sorry, something went wrong connecting to the server. Please try again.",
    tryThese: "Try one of these:",
    starters: [
      "I am a farmer in Bihar with 2 acres of land.",
      "I run a small shop in Delhi and I am 30 years old.",
      "I live in Rajasthan and have a 6-year-old daughter.",
      "I am 28 and work a private job in Maharashtra.",
    ],
  },
  hi: {
    greeting:
      "नमस्ते! SchemeSaathi में आपका स्वागत है।\n\nमैं आपकी ज़रूरत के हिसाब से सरकारी योजनाएँ खोजने में मदद कर सकता हूँ।\n\nअपने बारे में थोड़ा बताइए, या नीचे दिया कोई उदाहरण चुनिए।",
    title: "AI सहायक",
    status: "ऑनलाइन · हिंदी या अंग्रेज़ी में बात करें",
    placeholder: "अपने बारे में बताइए (जैसे, मैं बिहार का किसान हूँ)...",
    clear: "साफ़ करें",
    found: (n) => `बढ़िया! आपके लिए ${n} योजना(एँ) मिली हैं जिनके लिए आप पात्र हो सकते हैं।`,
    viewResults: "मेरे परिणाम देखें",
    more: "अपने बारे में थोड़ा और बताइए, मैं खोज जारी रखूँगा।",
    error: "क्षमा करें, सर्वर से जुड़ने में समस्या हुई। कृपया दोबारा कोशिश करें।",
    tryThese: "इनमें से कोई चुनें:",
    starters: [
      "मैं बिहार का किसान हूँ और मेरे पास 2 एकड़ ज़मीन है।",
      "मेरी दिल्ली में छोटी दुकान है और मेरी उम्र 30 साल है।",
      "मैं राजस्थान में रहता हूँ और मेरी 6 साल की बेटी है।",
      "मेरी उम्र 28 साल है और मैं महाराष्ट्र में नौकरी करता हूँ।",
    ],
  },
};

export default function Chat() {
  const [lang, setLang] = useState(null); // null = language not chosen yet
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function chooseLang(l) {
    setLang(l);
    setProfile({});
    setMessages([{ role: "bot", text: T[l].greeting }]);
  }

  async function send(e, preset) {
    e?.preventDefault();
    const text = (preset ?? input).trim();
    if (!text || loading || !lang) return;
    const t = T[lang];

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const data = await chatAPI(text, profile, lang);
      if (data.profile) setProfile(data.profile);

      try {
        sessionStorage.setItem(
          "ss_results",
          JSON.stringify({
            results: data.results || [],
            merged_documents: data.merged_documents || [],
            profile: data.profile || {},
            lang,
          })
        );
      } catch { /* storage unavailable, ignore */ }

      const hasResults = data.results?.length > 0;
      let botText;
      if (data.ask_next?.question) {
        botText = data.ask_next.question;
      } else if (hasResults) {
        botText = t.found(data.results.length);
      } else {
        botText = t.more;
      }
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: botText, showResults: hasResults && !data.ask_next?.question },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: t.error }]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setProfile({});
    setMessages([{ role: "bot", text: T[lang].greeting }]);
    try { sessionStorage.removeItem("ss_results"); } catch { /* ignore */ }
  }

  /* ---------- STEP 0: choose language ---------- */
  if (!lang) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-xl flex-col items-center justify-center px-4 py-10 text-center">
        <img src={logoImg} alt="SchemeSaathi" className="mb-4 h-16 w-16 object-contain" />
        <Languages className="mb-2 text-gov-blue" size={28} />
        <h1 className="font-display text-2xl font-bold text-gov-blue">
          Choose your language
        </h1>
        <h2 className="mt-1 font-display text-xl font-bold text-gov-blue">
          अपनी भाषा चुनें
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          You can change it anytime · आप इसे कभी भी बदल सकते हैं
        </p>
        <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
          <button
            onClick={() => chooseLang("en")}
            className="rounded-md border-2 border-gov-blue bg-white px-6 py-6 text-lg font-bold text-gov-blue shadow-sm transition hover:bg-gov-blue hover:text-white"
          >
            English
          </button>
          <button
            onClick={() => chooseLang("hi")}
            className="rounded-md border-2 border-gov-blue bg-white px-6 py-6 text-lg font-bold text-gov-blue shadow-sm transition hover:bg-gov-blue hover:text-white"
          >
            हिन्दी
          </button>
        </div>
      </div>
    );
  }

  const t = T[lang];

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-5xl flex-col px-4 py-6">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gov-blue">{t.title}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            {t.status}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded border border-gray-300 text-xs font-semibold">
            <button onClick={() => setLang("en")} className={`px-3 py-1.5 ${lang === "en" ? "bg-gov-blue text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>EN</button>
            <button onClick={() => setLang("hi")} className={`px-3 py-1.5 ${lang === "hi" ? "bg-gov-blue text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>हिं</button>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} /> {t.clear}
          </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="scrollbar-thin flex-1 overflow-y-auto rounded-md border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-6">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div key={i} className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border ${isUser ? "border-gov-blue bg-gov-blue text-white" : "border-gray-300 bg-white"}`}>
                  {isUser ? <User size={16} /> : <img src={logoImg} alt="SchemeSaathi" className="h-full w-full object-cover p-0.5" />}
                </div>

                <div className="max-w-[75%]">
                  <div className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "rounded-br-sm bg-gov-blue text-white"
                      : "rounded-bl-sm border border-gray-200 bg-gray-50 text-gray-800"
                  }`}>
                    {m.text}
                  </div>
                  {m.showResults && (
                    <Link
                      to="/results"
                      className="mt-2 inline-block rounded bg-gov-blue px-4 py-2 text-xs font-bold text-white hover:bg-gov-blue-dark"
                    >
                      {t.viewResults} →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-end gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-white">
                <img src={logoImg} alt="SchemeSaathi" className="h-full w-full object-cover p-0.5" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-gray-200 bg-gray-50 px-4 py-4">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>
      </div>

      {/* Suggested prompts: click sends immediately */}
      {messages.length === 1 && !loading && (
        <div className="mt-3">
          <p className="mb-2 text-xs text-gray-500">{t.tryThese}</p>
          <div className="flex flex-wrap gap-2">
            {t.starters.map((p) => (
              <button
                key={p}
                onClick={() => send(null, p)}
                className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-600 hover:border-gov-blue hover:text-gov-blue"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* INPUT AREA */}
      <form onSubmit={send} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-gov-blue focus:outline-none focus:ring-1 focus:ring-gov-blue"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-[46px] w-[46px] items-center justify-center rounded-md bg-gov-blue text-white shadow-sm transition hover:bg-gov-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
