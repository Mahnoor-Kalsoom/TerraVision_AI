"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Satellite, Zap, Shield, Sparkles, Layers, Activity, Eye, CheckCircle2 } from "lucide-react";

export function LandingHero() {
    const [activeTab, setActiveTab] = useState<"pre" | "post" | "mask" | "composite">("composite");

    return (
        <section className="relative overflow-hidden grid-bg pt-12 pb-24 md:pt-16 md:pb-28">
            {/* Ambient atmospheric glows */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gradient-to-b from-cyan-500/15 via-teal-500/10 to-transparent blur-[120px]" />
            <div className="pointer-events-none absolute bottom-10 right-10 w-[500px] h-[400px] rounded-full bg-blue-600/10 blur-[100px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* NASA EO Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-teal-500/40 bg-teal-500/10 text-teal-300 text-xs font-semibold mb-8 shadow-[0_0_20px_rgba(0,210,200,0.2)]">
                    <Satellite className="w-3.5 h-3.5 text-teal-400" />
                    <span>NASA Earth Observation Challenge · U-Net Dual-Temporal Segmentation</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span className="text-teal-200/80 font-mono">S1GFloods SAR/Optical</span>
                </div>

                {/* Main Hero Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1] max-w-5xl mx-auto">
                    Detect Flood Inundation From{" "}
                    <span className="gradient-text">Satellite Imagery</span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
                    A dual-temporal earth observation pipeline that compares Sentinel-1 SAR passes using
                    a convolutional U-Net, delineating surface water expansion and calculating pixel-accurate
                    inundation maps for disaster assessment.
                </p>

                {/* Main CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link
                        href="/analyze"
                        id="hero-begin-analysis"
                        className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 text-slate-950 font-extrabold text-sm sm:text-base hover:brightness-110 transition-all shadow-[0_0_25px_rgba(0,210,200,0.4)] hover:shadow-[0_0_35px_rgba(0,210,200,0.6)] active:scale-95"
                    >
                        <Sparkles className="w-5 h-5 fill-slate-950" />
                        <span>Launch Flood Analysis Tool</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-slate-700/80 bg-slate-900/60 text-slate-200 text-sm sm:text-base font-semibold hover:border-teal-500/50 hover:text-white transition-all backdrop-blur-md"
                    >
                        <span>Explore Architecture</span>
                    </Link>
                </div>

                {/* Key Benchmark Stats Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
                    {[
                        { label: "Flood IoU Metric", value: "0.9249", subtitle: "Intersection over Union" },
                        { label: "Detection Precision", value: "0.9582", subtitle: "True positive rate" },
                        { label: "Recall Sensitivity", value: "0.9637", subtitle: "Total flood detection" },
                        { label: "Inference Latency", value: "< 2.0s", subtitle: "On CPU / GPU batch" },
                    ].map(({ label, value, subtitle }) => (
                        <div
                            key={label}
                            className="glass rounded-2xl p-5 border border-slate-800/80 bg-slate-900/50 text-center hover:border-teal-500/40 transition-all"
                        >
                            <div className="text-3xl sm:text-4xl font-black gradient-text tracking-tight">{value}</div>
                            <div className="text-white text-xs sm:text-sm font-bold mt-1.5">{label}</div>
                            <div className="text-slate-400 text-[11px] mt-0.5">{subtitle}</div>
                        </div>
                    ))}
                </div>

                {/* Interactive Satellite Demonstration Showcase */}
                <div className="max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 glass border border-teal-500/30 bg-slate-950/70 shadow-2xl relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
                        <div className="text-left">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
                                <h2 className="text-lg sm:text-xl font-bold text-white">
                                    Interactive Model Demonstration
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Real U-Net inference output on sample Sentinel satellite observation pair
                            </p>
                        </div>

                        {/* View Tabs */}
                        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                            {[
                                { id: "pre", label: "Pre-Flood" },
                                { id: "post", label: "Post-Flood" },
                                { id: "mask", label: "AI Flood Mask" },
                                { id: "composite", label: "Composite Overlay" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        activeTab === tab.id
                                            ? "bg-teal-500 text-slate-950 shadow-sm"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Preview & Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="relative aspect-square w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-xl group">
                            {activeTab === "pre" && (
                                <Image
                                    src="/samples/pre_flood.png"
                                    alt="Pre-flood baseline satellite image"
                                    fill
                                    className="object-cover"
                                />
                            )}
                            {activeTab === "post" && (
                                <Image
                                    src="/samples/post_flood.png"
                                    alt="Post-flood satellite image with inundation"
                                    fill
                                    className="object-cover"
                                />
                            )}
                            {activeTab === "mask" && (
                                <div className="relative w-full h-full bg-black flex items-center justify-center">
                                    <Image
                                        src="/samples/predicted_flood_mask.png"
                                        alt="Binary flood segmentation mask"
                                        fill
                                        className="object-cover pixelated"
                                    />
                                </div>
                            )}
                            {activeTab === "composite" && (
                                <Image
                                    src="/samples/composite_overlay.png"
                                    alt="Emergency flood overlay"
                                    fill
                                    className="object-cover"
                                />
                            )}

                            {/* View label chip */}
                            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-mono font-bold text-teal-300">
                                {activeTab === "pre" && "Input Channel 1-3: RGB Pre-Flood"}
                                {activeTab === "post" && "Input Channel 4-6: RGB Post-Flood"}
                                {activeTab === "mask" && "Model Output: Sigmoid Probability ≥ 0.5"}
                                {activeTab === "composite" && "Composite: Inundation Highlight Overlay"}
                            </div>
                        </div>

                        {/* Interactive Insights */}
                        <div className="text-left space-y-4">
                            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-teal-400" />
                                    How the Model Detects This Area
                                </h3>
                                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                                    The U-Net architecture maps non-linear reflectance deviations between the baseline
                                    dry ground and submerged specular surfaces, generating an exact pixel polygon mask of the water body.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
                                    <span className="text-slate-400 block text-[11px]">Resolution</span>
                                    <span className="text-white font-bold font-mono">256 × 256 px</span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
                                    <span className="text-slate-400 block text-[11px]">Channels</span>
                                    <span className="text-white font-bold font-mono">6 Band Tensor</span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
                                    <span className="text-slate-400 block text-[11px]">Target Class</span>
                                    <span className="text-teal-300 font-bold">Flood Inundation</span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
                                    <span className="text-slate-400 block text-[11px]">Status</span>
                                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Ready
                                    </span>
                                </div>
                            </div>

                            <Link
                                href="/analyze"
                                className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold hover:bg-teal-500/30 transition-all cursor-pointer"
                            >
                                <Eye className="w-4 h-4 text-teal-400" />
                                <span>Run Live Analysis on This Benchmark Tile</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Highlights */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                        {
                            icon: Satellite,
                            title: "Earth Observation Ready",
                            desc: "Trained on Sentinel-1 and optical satellite passes for multi-sensor adaptability and radar resilience.",
                        },
                        {
                            icon: Zap,
                            title: "Sub-Second Processing",
                            desc: "Optimized U-Net architecture provides rapid segmentation masks for emergency response teams.",
                        },
                        {
                            icon: Shield,
                            title: "Robust Defense Pipeline",
                            desc: "Magic-byte header inspection, PIL decompression bomb shielding, and per-IP rate protection.",
                        },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="glass rounded-2xl p-6 text-left border border-slate-800/80 bg-slate-900/40 hover:border-teal-500/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4">
                                <Icon className="w-5 h-5 text-teal-400" />
                            </div>
                            <h3 className="font-bold text-sm text-white mb-1.5">{title}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
