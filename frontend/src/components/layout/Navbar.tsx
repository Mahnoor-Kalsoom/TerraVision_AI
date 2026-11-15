"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Satellite, Menu, X, Activity, Sparkles, ArrowRight } from "lucide-react";

const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#methodology", label: "Methodology" },
    { href: "/team", label: "Team" },
    { href: "/analyze", label: "Live Analysis" },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [engineStatus, setEngineStatus] = useState<"checking" | "online" | "offline">("checking");

    useEffect(() => {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== "")
            ? process.env.NEXT_PUBLIC_API_URL
            : "";
        fetch(`${apiUrl}/api/v1/health`)
            .then((res) => {
                if (res.ok) setEngineStatus("online");
                else setEngineStatus("offline");
            })
            .catch(() => setEngineStatus("offline"));
    }, []);

    return (
        <header className="sticky top-0 z-50 glass border-b border-border/60 bg-slate-950/80 backdrop-blur-xl">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
                <div className="flex items-center justify-between h-20">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-3 group" aria-label="TerraVision AI Home">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-teal-500/30 to-emerald-500/20 border border-primary/40 flex items-center justify-center group-hover:border-primary/80 group-hover:shadow-[0_0_20px_rgba(0,210,200,0.35)] transition-all">
                            <Satellite className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xl tracking-tight text-white">
                                    TerraVision <span className="gradient-text font-black">AI</span>
                                </span>
                                <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                    NASA EO
                                </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground tracking-wide font-medium hidden sm:block">
                                Satellite Flood Inundation Intelligence
                            </span>
                        </div>
                    </Link>

                    {/* Desktop links & Status */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Live Engine Status Pill */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/80 text-xs font-medium mr-2">
                            <span className="relative flex h-2 w-2">
                                {engineStatus === "online" ? (
                                    <>
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </>
                                ) : engineStatus === "checking" ? (
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 animate-pulse"></span>
                                ) : (
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
                                )}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                                {engineStatus === "online" ? "AI Engine Ready" : engineStatus === "checking" ? "Checking Engine..." : "API Standby"}
                            </span>
                        </div>

                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <Link
                            href="/analyze"
                            className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,210,200,0.3)] hover:shadow-[0_0_30px_rgba(0,210,200,0.5)] active:scale-95"
                        >
                            <Sparkles className="w-4 h-4 fill-slate-950" />
                            <span>Launch Tool</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        id="mobile-menu-toggle"
                        className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-secondary/70 border border-border/70"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div id="mobile-menu" className="md:hidden py-4 pb-6 border-t border-border/60 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg bg-secondary/50 text-xs">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span>
                            <span className="text-muted-foreground">AI Engine: {engineStatus === "online" ? "Connected" : "Standby"}</span>
                        </div>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-3 py-2.5 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/analyze"
                            className="block mt-4 mx-2 px-5 py-3 text-sm font-bold text-center rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 hover:brightness-110 shadow-lg shadow-teal-500/25"
                            onClick={() => setMobileOpen(false)}
                        >
                            Launch Flood Analysis Tool
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}
