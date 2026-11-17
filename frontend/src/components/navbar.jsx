import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Phone, HelpCircle, User, Search } from "lucide-react";
import Logo from "./logo";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/chat", label: "AI Assistant" },
  { to: "/explore", label: "Explore Schemes" },
  { to: "/results", label: "My Results" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="w-full">
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-[#f8f9fa] border-b border-gray-200 text-[11px] py-1.5 hidden md:block">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={12}/> Helpline: 1800-123-4567</span>
            <span className="flex items-center gap-1"><HelpCircle size={12}/> Help</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <div className="flex items-center gap-1">
              <button className="text-gov-blue hover:underline">English</button>
              <span>|</span>
              <button className="hover:text-gov-blue hover:underline">हिंदी</button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (White Area) */}
      <div className="bg-white py-3 border-b-[3px] border-gov-saffron">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Logo />
          </div>
          
          {/* Right: Satyamev Jayate + Login/Register */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right hidden xl:block border-r border-gray-200 pr-6">
              <p className="text-sm font-serif font-bold text-gov-blue tracking-widest">सत्यमेव जयते</p>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest">Satyameva Jayate</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/profile" className="btn-secondary !px-4 !py-2 !text-xs flex items-center gap-1 border-gray-300">
                <User size={14} /> Login / Register
              </Link>
              <Link to="/chat" className="btn-primary !px-5 !py-2 !text-sm shadow-sm">
                Check Eligibility
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION BAR (Solid Blue) */}
      <nav className="bg-gov-blue text-white shadow-md sticky top-0 z-50">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 flex items-center justify-between">
          
          {/* Left side links */}
          <ul className="flex flex-wrap items-center text-sm font-medium">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `block px-5 py-3 transition-colors ${
                      isActive ? "bg-gov-blue-dark text-white border-b-2 border-gov-saffron" : "hover:bg-gov-blue-dark text-blue-100"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right side tools (Search & Font size) */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-blue-200 border-r border-blue-700 pr-4">
              <span className="font-bold text-xs mr-1 uppercase">Text Size</span>
              <button className="hover:text-white font-bold" title="Decrease">A-</button>
              <button className="hover:text-white font-bold mx-1" title="Normal">A</button>
              <button className="hover:text-white font-bold" title="Increase">A+</button>
            </div>
            
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schemes..." 
                className="bg-gov-blue-dark border border-blue-700 text-white placeholder-blue-300 text-xs rounded-sm pl-3 pr-8 py-1.5 focus:outline-none focus:border-gov-saffron w-48 lg:w-64"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white">
                <Search size={14} />
              </button>
            </form>
          </div>

        </div>
      </nav>
    </header>
  );
}