import { Link } from "react-router-dom";
import { ArrowRight, FileText, Users, ShieldCheck } from "lucide-react"; // Sahi imports

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      
      {/* HERO BANNER (Solid Blue) */}
      <section className="bg-gov-blue text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              One Platform for All <br/> Government Schemes
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Find and apply for eligible schemes across Central and State Governments. 
              Chat with our AI assistant in English or Hindi to get personalized recommendations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/chat" className="btn-saffron !text-lg !px-8">
                Find My Schemes <ArrowRight size={20} />
              </Link>
              <Link to="/explore" className="btn-secondary !bg-transparent !text-white !border-white hover:!bg-white/10">
                Browse All Schemes
              </Link>
            </div>
          </div>
          <div className="hidden md:block mt-8 md:mt-0 opacity-80">
             <ShieldCheck size={180} strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTICE TICKER */}
      <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-sm py-2">
        <div className="mx-auto max-w-7xl px-4 flex items-center gap-3 overflow-hidden">
          <span className="font-bold whitespace-nowrap bg-yellow-600 text-white px-2 py-0.5 rounded text-xs">LATEST UPDATE</span>
          <p className="truncate">Please verify all scheme details on official government portals before applying. SchemeSaathi is an informational tool.</p>
        </div>
      </div>

      {/* QUICK LINKS CARDS (Grid) */}
      <section className="bg-white border-b border-gov-border py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-2xl font-bold text-gov-blue border-l-4 border-gov-saffron pl-3 mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link to="/chat" className="group block p-6 border border-gov-border rounded bg-white hover:border-gov-blue hover:shadow-sm transition">
              <div className="text-gov-blue mb-4 bg-blue-50 w-12 h-12 rounded flex items-center justify-center"><Users size={24}/></div>
              <h3 className="font-bold text-lg text-gov-text group-hover:text-gov-blue">Check Eligibility</h3>
              <p className="text-sm text-gov-text-muted mt-2">Use our AI chat to find schemes you qualify for.</p>
            </Link>

            <Link to="/explore" className="group block p-6 border border-gov-border rounded bg-white hover:border-gov-blue hover:shadow-sm transition">
              <div className="text-gov-blue mb-4 bg-blue-50 w-12 h-12 rounded flex items-center justify-center"><FileText size={24}/></div>
              <h3 className="font-bold text-lg text-gov-text group-hover:text-gov-blue">Scheme Directory</h3>
              <p className="text-sm text-gov-text-muted mt-2">Browse the complete list of all available schemes.</p>
            </Link>

            <Link to="/results" className="group block p-6 border border-gov-border rounded bg-white hover:border-gov-blue hover:shadow-sm transition">
              <div className="text-gov-blue mb-4 bg-blue-50 w-12 h-12 rounded flex items-center justify-center"><ShieldCheck size={24}/></div>
              <h3 className="font-bold text-lg text-gov-text group-hover:text-gov-blue">My Results</h3>
              <p className="text-sm text-gov-text-muted mt-2">View your matched schemes and required documents.</p>
            </Link>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-gov-bg">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-2xl font-bold text-gov-blue border-l-4 border-gov-saffron pl-3 mb-8">How to Use SchemeSaathi</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Share Details", desc: "Chat with our AI assistant and tell it about your background, income, and occupation.", icon: Users },
              { step: "2", title: "AI Matches Schemes", desc: "Our system instantly checks your details against thousands of government schemes.", icon: ShieldCheck },
              { step: "3", title: "Apply Directly", desc: "See a list of eligible schemes, required documents, and click to apply on the official portal.", icon: FileText },
            ].map((s, i) => (
              <div key={i} className="relative bg-white p-6 rounded border border-gov-border shadow-sm text-center">
                <div className="w-10 h-10 bg-gov-blue text-white rounded-full flex items-center justify-center text-xl font-bold absolute -top-5 left-1/2 -translate-x-1/2">
                  {s.step}
                </div>
                <div className="mt-4 mb-3 flex justify-center text-gov-blue"><s.icon size={32}/></div>
                <h3 className="font-bold text-lg text-gov-text">{s.title}</h3>
                <p className="text-sm text-gov-text-muted mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-gov-blue text-white py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to find your scheme?</h2>
        <p className="text-blue-100 mb-6">No login required. Free for all citizens.</p>
        <Link to="/chat" className="btn-saffron !text-lg !px-8">
          Start Eligibility Check
        </Link>
      </section>
    </div>
  );
}