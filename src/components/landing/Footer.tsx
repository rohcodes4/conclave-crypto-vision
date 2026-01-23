import React from "react";
import { X } from "lucide-react"; // replace with your icons

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-neutral-900 text-neutral-400 px-6 py-10">
      {/* Top subtle divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-neutral-700 via-neutral-800 to-neutral-700 opacity-40" />

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left: Logo / Product Name */}
        <div className="text-white font-bold text-xl tracking-widest">
          Paper Trader
        </div>

        {/* Center: Social Icons */}
        <div className="flex gap-6 text-neutral-400 hover:text-emerald-400 transition-colors">
          {/* <a
            href="#"
            aria-label="X / Twitter"
            className="hover:text-emerald-400 transition-colors"
          >
            <X size={20} />
          </a> */}
          {/* <a
            href="#"
            aria-label="Discord"
            className="hover:text-emerald-400 transition-colors"
          >
            <X size={20} />
          </a> */}
          {/* Add more social links here */}
        </div>

        {/* Right / Bottom: Disclaimer */}
        <div className="text-sm text-neutral-500 text-center md:text-right max-w-xs">
          Paper trading only. No real funds. Not financial advice.
        </div>
      </div>

      {/* Optional: subtle ambient glow */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/10 blur-3xl" />
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-cyan-400/10 blur-3xl" />
    </footer>
  );
};

export default Footer;
