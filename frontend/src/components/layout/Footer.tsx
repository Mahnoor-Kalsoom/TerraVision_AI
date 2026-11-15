import Link from "next/link";
import { Satellite, AlertTriangle, ExternalLink } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* NASA Research disclaimer */}
                <div className="mb-10 p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <span className="font-bold text-amber-300">NASA Earth Observation & Disaster Intelligence Notice: </span>
                        TerraVision AI is designed for remote sensing research, hackathon evaluation, and educational flood assessment.
                        Model accuracy metrics (IoU 0.9249, Precision 0.9582, Recall 0.9637) were validated on the S1GFloods dataset test split.
                        Operational emergency deployments should always corroborate automated AI masks with ground-truth hydrological sensors and GIS emergency teams.
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                            <Satellite className="w-4 h-4 text-teal-400" />
                        </div>
                        <div>
                            <span className="text-sm font-extrabold text-white">TerraVision AI</span>
                            <span className="text-slate-400 text-xs ml-2 font-mono">· U-Net Satellite Flood Inundation</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400 font-medium">
                        <Link href="/" className="hover:text-teal-400 transition-colors">Overview</Link>
                        <Link href="/analyze" className="hover:text-teal-400 transition-colors">Live Tool</Link>
                        <Link href="/team" className="hover:text-teal-400 transition-colors">Team</Link>
                        <Link href="/#how-it-works" className="hover:text-teal-400 transition-colors">Workflow</Link>
                        <Link href="/#methodology" className="hover:text-teal-400 transition-colors">Methodology</Link>
                    </div>

                    <p className="text-xs text-slate-400 font-mono">
                        © {new Date().getFullYear()} TerraVision AI · NASA Project Submission
                    </p>
                </div>
            </div>
        </footer>
    );
}
