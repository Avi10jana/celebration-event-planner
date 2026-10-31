import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, ShieldCheck, Calendar, Users } from 'lucide-react';

interface PremiumLandingHeroProps {
  onExplorePlanner: () => void;
  onOpenCinemaStory: () => void;
  activeEventTitle: string;
}

export const PremiumLandingHero: React.FC<PremiumLandingHeroProps> = ({
  onExplorePlanner,
  onOpenCinemaStory,
  activeEventTitle,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 px-4 md:px-8 border-b border-white/[0.08] mb-12">
      {/* Background ambient luxury glow orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-purple-600/20 via-pink-500/15 to-amber-500/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        {/* Top pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-8 shadow-sm backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Curating {activeEventTitle} &bull; Autonomous Luxury Event Suite</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12] mb-6 font-['Outfit']"
        >
          Curate Unforgettable Moments With{' '}
          <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-purple-400 bg-clip-text text-transparent">
            Autonomous Elegance.
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal mb-10"
        >
          From bespoke weddings and high-profile galas to milestone anniversaries.
          Experience seamless real-time budgeting, master day-of run-of-show orchestration,
          vendor negotiation, and generative speechcraft.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onExplorePlanner}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
          >
            <span>Launch Event Planner</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenCinemaStory}
            className="px-7 py-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-semibold text-base backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer shadow-md"
          >
            <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span>Watch Cinematic Story</span>
          </button>
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
        >
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-amber-400 mb-1.5 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Smart Doctor</span>
            </div>
            <p className="text-xs text-slate-400">Real-time budget analysis with proactive overspend alerts</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-amber-400 mb-1.5 font-semibold text-sm">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Master Timeline</span>
            </div>
            <p className="text-xs text-slate-400">Minute-by-minute day-of schedules &amp; vendor check-in</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-amber-400 mb-1.5 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Creative Studio</span>
            </div>
            <p className="text-xs text-slate-400">AI speeches, toasts, WhatsApp invites &amp; palettes</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-amber-400 mb-1.5 font-semibold text-sm">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Vendor Portals</span>
            </div>
            <p className="text-xs text-slate-400">Interactive quotes, contracts &amp; verified milestone delivery</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumLandingHero;
