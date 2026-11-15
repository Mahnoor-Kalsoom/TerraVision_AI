import { Upload, Cpu, BarChart2, ArrowRight, Layers, CheckCircle2 } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Upload,
        title: "Dual Satellite Ingestion",
        tag: "Input Preparation",
        description:
            "Provide two spatially registered satellite image tiles — a baseline pre-flood reference and an inundated post-flood acquisition covering identical geographic bounding boxes.",
    },
    {
        number: "02",
        icon: Cpu,
        title: "6-Channel Neural Segmentation",
        tag: "U-Net Inference",
        description:
            "Both imagery arrays are normalized into a unified 6-channel tensor (Pre-RGB + Post-RGB) and passed through the U-Net skip-connection pipeline to generate pixel confidence maps.",
    },
    {
        number: "03",
        icon: BarChart2,
        title: "Inundation Metrics & Export",
        tag: "Actionable Insights",
        description:
            "Instant polygon-level segmentation mask, flooded pixel ratio calculations, dynamic alpha overlays, and one-click GIS mask downloads for emergency coordinators.",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-slate-950/60 border-y border-slate-800/60 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                        Workflow Architecture
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                        How TerraVision AI Works
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        A three-stage end-to-end pipeline bridging raw satellite telemetry with rapid, actionable disaster analytics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <div
                            key={step.number}
                            className="glass rounded-3xl p-8 relative group hover:border-teal-500/40 transition-all border border-slate-800 bg-slate-900/40"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-5xl font-black text-slate-800 group-hover:text-teal-500/30 transition-colors select-none font-mono">
                                    {step.number}
                                </span>
                                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                                    <step.icon className="w-6 h-6 text-teal-400" />
                                </div>
                            </div>

                            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-widest block mb-1">
                                {step.tag}
                            </span>
                            <h3 className="font-extrabold text-xl text-white mb-3">{step.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
