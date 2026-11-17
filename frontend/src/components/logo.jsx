import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";

export default function Logo({ light = false, size = "md" }) {
  const sizes = {
    sm: "h-9 w-9",
    md: "h-11 w-11",
    lg: "h-16 w-16",
  };

  return (
    <Link to="/" className="group flex items-center gap-3">
      {/* Circular crop wrapper */}
      <div
        className={`${sizes[size]} relative shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-leaf-500/20 to-leaf-600/30 ring-1 ring-white/20 transition group-hover:scale-105`}
      >
        {/* Image scaled up + centered so the illustration fills the circle */}
        <img
          src={logoImg}
          alt="SchemeSaathi"
          className="absolute left-1/2 top-1/2 h-[260%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
        />
      </div>

      <div className="leading-none">
        <p className={`font-display text-lg ${light ? "text-white" : "text-ink-900"}`}>
          Scheme<span className="italic text-leaf-400">Saathi</span>
        </p>
        <p className={`mt-1 text-[9px] font-medium uppercase tracking-[0.2em] ${light ? "text-white/50" : "text-ink-400"}`}>
          Made Personal
        </p>
      </div>
    </Link>
  );
}