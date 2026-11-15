import { LandingHero } from "@/components/layout/LandingHero";
import { HowItWorks } from "@/components/layout/HowItWorks";
import { Methodology } from "@/components/layout/Methodology";
import { TechStack } from "@/components/layout/TechStack";
import Link from "next/link";
import { ArrowRight, Sparkles, Satellite } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHero />
      <HowItWorks />
      <Methodology />
      <TechStack />

      {/* Final NASA Challenge Call to Action */}
      <section className="py-24 text-center relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-bold mb-6">
            <Satellite className="w-3.5 h-3.5 text-teal-400" />
            <span>Ready for Evaluation & Live Testing</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            Analyze Satellite Imagery with{" "}
            <span className="gradient-text">TerraVision AI</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-10 leading-relaxed">
            Upload custom pre-flood and post-flood satellite image pairs or run the instant
            1-click Sentinel demo dataset to inspect pixel-accurate inundation masks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/analyze"
              id="landing-cta"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 text-slate-950 font-black text-base hover:brightness-110 transition-all shadow-[0_0_30px_rgba(0,210,200,0.4)] active:scale-95"
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>Launch Live Analysis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
