import { Link } from "react-router-dom";
import { Landmark, Phone, Mail, MapPin, ShieldCheck } from "lucide-react"; // Yahan ShieldCheck add kiya

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-300 border-t-4 border-gov-saffron">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <Landmark size={24} /> SchemeSaathi
            </div>
            <p className="text-sm text-gray-400 mb-4">
              An AI-powered government scheme discovery portal designed for Indian citizens.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ShieldCheck size={16} className="text-green-500" /> Secured & Verified
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/chat" className="hover:text-gov-saffron">AI Assistant</Link></li>
              <li><Link to="/explore" className="hover:text-gov-saffron">Explore Schemes</Link></li>
              <li><Link to="/results" className="hover:text-gov-saffron">My Results</Link></li>
              <li><Link to="/profile" className="hover:text-gov-saffron">User Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contact Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Phone size={16} /> 1800-123-4567</li>
              <li className="flex items-center gap-2"><Mail size={16} /> support@schemesaathi.in</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> New Delhi, India</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Disclaimer</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              SchemeSaathi is an informational platform. We do not process applications. 
              All scheme eligibility results are indicative.
            </p>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2026 SchemeSaathi. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}