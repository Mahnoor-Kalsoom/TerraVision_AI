import { FlaskConical, Database, Network, Scale, ShieldCheck, CheckCircle2 } from "lucide-react";

const pillars = [
    {
        icon: Database,
        title: "S1GFloods Benchmark Dataset",
        badge: "Data Foundation",
        description:
            "Trained on S1GFloods, a curated benchmark combining Sentinel-1 Synthetic Aperture Radar (SAR) observations and optical satellite acquisitions, capturing diverse hydrologic flooding topographies worldwide.",
    },
    {
        icon: Network,
        title: "Deep U-Net Architecture",
        badge: "Neural Backbone",
        description:
            "Employs an encoder-decoder network with skip connections that preserve fine-grained spatial boundaries. The multi-level skip links guarantee that thin waterways and flood boundaries are not lost during downsampling.",
    },
    {
        icon: FlaskConical,
        title: "Rigorous Preprocessing Pipeline",
        badge: "Signal Preparation",
        description:
            "Input images undergo LANCZOS high-order spatial resampling to 256 × 256, RGB conversion, float32 normalization in [0, 1], and channel-wise stacking into a robust 6-channel spatial tensor (1, 256, 256, 6).",
    },
    {
        icon: Scale,
        title: "Calibrated Decision Boundary",
        badge: "Thresholding",
        description:
            "A fine-tuned 0.5 probability sigmoid threshold balances false alarms against missed detections. Pixel probabilities reflect local floodwater presence, enabling downstream risk classification.",
    },
];

export function Methodology() {
    return (
        <section id="methodology" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                        Scientific Foundation
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                        Technical Methodology
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Full technical overview of dataset curation, neural architecture, and inference calibration.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    {pillars.map(({ icon: Icon, title, badge, description }) => (
                        <div
                            key={title}
                            className="glass rounded-3xl p-8 hover:border-teal-500/40 transition-all group border border-slate-800 bg-slate-900/40"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-teal-400" />
                                </div>
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-teal-300 border border-slate-700 font-mono">
                                    {badge}
                                </span>
                            </div>
                            <h3 className="font-extrabold text-lg text-white mb-2">{title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>

                {/* Model metrics table */}
                <div className="glass rounded-3xl p-8 border border-slate-800 bg-slate-950/70 overflow-x-auto shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="font-extrabold text-xl text-white">Empirical Evaluation Metrics</h3>
                            <p className="text-xs text-slate-400 mt-1">Measured on S1GFloods held-out test split</p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified Model Binary
                        </div>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-left">
                                <th className="py-3 px-4 text-slate-400 font-semibold uppercase text-xs tracking-wider">Evaluation Metric</th>
                                <th className="py-3 px-4 text-slate-400 font-semibold uppercase text-xs tracking-wider">Measured Score</th>
                                <th className="py-3 px-4 text-slate-400 font-semibold uppercase text-xs tracking-wider">Operational Significance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {[
                                { metric: "Flood IoU (Jaccard Index)", value: "0.9249", note: "Strong overlap precision on inundated surface water" },
                                { metric: "Positive Detection Precision", value: "0.9582", note: "Minimizes false alarms on wet soil and shadows" },
                                { metric: "True Positive Recall Sensitivity", value: "0.9637", note: "Captures 96.3%+ of actual floodwater pixels" },
                                { metric: "Input Tensor Shape", value: "(1, 256, 256, 6)", note: "Batch size × Height × Width × Multi-temporal bands" },
                                { metric: "Output Mask Shape", value: "(1, 256, 256, 1)", note: "Binary single-channel segmentation mask" },
                                { metric: "Sigmoid Confidence Threshold", value: "0.5000", note: "Optimal F1 balance cutoff point" },
                            ].map(({ metric, value, note }) => (
                                <tr key={metric} className="hover:bg-slate-900/60 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-white">{metric}</td>
                                    <td className="py-3.5 px-4">
                                        <code className="text-teal-300 font-bold font-mono text-xs bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
                                            {value}
                                        </code>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-400 text-xs">{note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
