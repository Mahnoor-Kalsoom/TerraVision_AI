import type { Metadata } from "next";
import Link from "next/link";
import {
    BrainCircuit,
    Code2,
    Satellite,
    Sparkles,
    ShieldCheck,
    Layers,
    Terminal,
    Compass,
    CheckCircle2,
    ArrowRight,
    Award,
    Cpu,
    GitBranch,
} from "lucide-react";

export const metadata: Metadata = {
    title: "The Team — The Minds Behind TerraVision AI",
    description:
        "Meet the engineers and researchers behind TerraVision AI: Ghani Abdul Rehman Khan and Mahnoor Kalsoom, pioneering deep learning for satellite flood detection.",
};

const teamMembers = [
    {
        name: "Ghani Abdul Rehman Khan",
        role: "Lead Software Engineer & Deep Learning Systems Architect",
        badge: "Systems & Infrastructure",
        bio: "Specializes in high-throughput geospatial computing, full-stack software architecture, and production machine learning serving. Focused on bridging deep neural networks with low-latency client interfaces and resilient cloud services.",
        expertise: [
            "Full-Stack Web Architecture (Next.js 16, React 19, TypeScript)",
            "High-Throughput Machine Learning API Design (FastAPI, Async Python)",
            "Convolutional Neural Network (CNN) Deployment & Tensor Engineering",
            "Vectorized NumPy Pipeline & Multi-Band Channel Stacking",
            "Decompression Bomb Defense, Rate Limiting & System Hardening",
            "Thread-Safe Model Lifecycle Management & Keras 3 Runtime Serving",
        ],
        icon: Code2,
        accentColor: "from-teal-400 to-cyan-500",
    },
    {
        name: "Mahnoor Kalsoom",
        role: "Computer Vision & Remote Sensing AI Research Engineer",
        badge: "Model Research & Training",
        bio: "Specializes in satellite radar remote sensing, computer vision architectures, and semantic segmentation of environmental phenomena. Focused on multi-temporal Earth observation and pixel-level hydrological change detection.",
        expertise: [
            "Convolutional Neural Networks (CNNs) & Encoder-Decoder U-Net",
            "Synthetic Aperture Radar (SAR) Telemetry & Sentinel-1 Data Fusion",
            "Multi-Scale Skip Connections & High-Frequency Boundary Preservation",
            "Custom Loss Functions (Combined Dice Loss & Weighted BCE)",
            "Empirical Model Validation (0.9249 IoU, 0.9582 Precision, 0.9637 Recall)",
            "Global Flood Dataset Curation & Hyperparameter Convergence Optimization",
        ],
        icon: BrainCircuit,
        accentColor: "from-cyan-400 to-blue-500",
    },
];

const technicalPillars = [
    {
        icon: Satellite,
        title: "Earth Observation & Radar Sensing",
        desc: "Processing dual-temporal Sentinel-1 C-band Synthetic Aperture Radar (SAR) and optical telemetry to penetrate weather constraints and map specular surface water changes.",
    },
    {
        icon: Layers,
        title: "Deep Convolutional Segmentation",
        desc: "Designing symmetric U-Net skip-connection backbones that retain fine geographic waterways while suppressing speckle noise and terrain false alarms.",
    },
    {
        icon: Cpu,
        title: "Production System Engineering",
        desc: "Deploying high-performance asynchronous API endpoints with thread-synchronized model inference, strict magic-byte validation, and instant interactive visualization.",
    },
];

export function TeamPage() {
    return (
        <div className="min-h-screen grid-bg py-12 sm:py-16 md:py-20">
            {/* Atmospheric Background Glows */}
            <div className="pointer-events-none fixed top-0 left-1/2 w-[800px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[140px]" />
            <div className="pointer-events-none fixed bottom-0 right-10 w-[500px] h-[400px] rounded-full bg-cyan-600/10 blur-[120px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-bold mb-4 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                        <span>The Minds Behind TerraVision AI</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
                        Engineering Team &{" "}
                        <span className="gradient-text">Research Leads</span>
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
                        Meet the engineers and researchers who conceptualized, trained, and deployed TerraVision AI — uniting
                        computer vision, satellite remote sensing, and scalable full-stack software architecture for global flood response.
                    </p>
                </div>

                {/* Team Members Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                    {teamMembers.map((member) => (
                        <div
                            key={member.name}
                            className="glass rounded-3xl p-7 sm:p-9 border border-slate-800 bg-slate-950/70 hover:border-teal-500/40 transition-all shadow-2xl relative overflow-hidden flex flex-col justify-between group"
                        >
                            {/* Subtle top ambient bar */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${member.accentColor}`} />

                            <div>
                                {/* Header badge & icon */}
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center group-hover:scale-105 group-hover:border-teal-500/60 transition-all shadow-inner">
                                        <member.icon className="w-7 h-7 text-teal-400" />
                                    </div>
                                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-800 text-teal-300 border border-slate-700 font-mono">
                                        {member.badge}
                                    </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1.5">
                                    {member.name}
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-teal-400 font-mono mb-4">
                                    {member.role}
                                </p>

                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                                    {member.bio}
                                </p>

                                {/* Technical Competencies */}
                                <div className="mb-6 pt-5 border-t border-slate-800/80">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                                        <Terminal className="w-3.5 h-3.5 text-teal-400" />
                                        Core Technical Focus Areas
                                    </h3>
                                    <ul className="space-y-2">
                                        {member.expertise.map((skill) => (
                                            <li key={skill} className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                                <span className="leading-snug">{skill}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Verified NASA Submission Tag */}
                            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                                <span className="inline-flex items-center gap-1.5 text-teal-300 font-semibold">
                                    <Award className="w-3.5 h-3.5 text-teal-400" />
                                    TerraVision AI Co-Creator
                                </span>
                                <span className="font-mono text-[11px]">NASA Project Submission</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Team Philosophy & Technical Collaboration */}
                <div className="glass rounded-3xl p-8 sm:p-10 border border-slate-800 bg-slate-950/60 shadow-2xl mb-20">
                    <div className="max-w-3xl mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                            Collaborative Vision
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                            Interdisciplinary Engineering for Earth Observation
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            TerraVision AI is the culmination of shared expertise across advanced deep learning research and resilient systems engineering.
                            By uniting custom U-Net computer vision modeling with sub-second API serving and intuitive geospatial interfaces, the platform empowers emergency responders with rapid, reproducible flood telemetry.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {technicalPillars.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4">
                                    <Icon className="w-5 h-5 text-teal-400" />
                                </div>
                                <h3 className="font-bold text-sm text-white mb-2">{title}</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center py-12 border-t border-slate-800/80">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                        Experience the Platform in Action
                    </h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
                        Evaluate the trained convolutional U-Net on real Sentinel-1 disaster telemetry.
                    </p>
                    <Link
                        href="/analyze"
                        className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-teal-500/25 active:scale-95 cursor-pointer"
                    >
                        <Sparkles className="w-4 h-4 fill-slate-950" />
                        <span>Launch Flood Analysis Tool</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default TeamPage;
