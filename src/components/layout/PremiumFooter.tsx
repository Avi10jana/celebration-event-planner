import React from 'react';
import { Sparkles, Heart, Globe, Shield, ArrowUpRight } from 'lucide-react';

export const PremiumFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#05070e]/80 backdrop-blur-xl pt-16 pb-12 px-6 mt-20 text-slate-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand statement */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight font-['Outfit']">
              Festiva<span className="text-amber-400">AI</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
              Luxury Edition
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            The premier autonomous event planning suite. Designed for wedding architects, private hosts, luxury gala coordinators, and discerning celebration planners worldwide.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> End-to-end Private &amp; Local</span>
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-cyan-400" /> Global Currencies</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">Budget Doctor <ArrowUpRight className="w-3 h-3 opacity-60" /></li>
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">Run of Show Timeline <ArrowUpRight className="w-3 h-3 opacity-60" /></li>
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">AI Toast &amp; Speech Crafter <ArrowUpRight className="w-3 h-3 opacity-60" /></li>
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">Vendor RFP Management <ArrowUpRight className="w-3 h-3 opacity-60" /></li>
          </ul>
        </div>

        {/* Concierge & Support */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Architecture</h4>
          <ul className="space-y-2.5 text-sm">
            <li>Modern Dark Glassmorphism</li>
            <li>Framer Motion Physics</li>
            <li>Tailwind CSS Design System</li>
            <li>Google Gemini 2.5/Flash AI</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 FestivaAI Autonomous Event Technologies. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for unforgettable celebrations.
        </p>
      </div>
    </footer>
  );
};

export default PremiumFooter;
