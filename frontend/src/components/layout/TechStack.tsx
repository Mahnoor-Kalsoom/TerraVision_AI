import { Code2, Server, BrainCircuit, Check } from "lucide-react";

const techStack = [
    {
        category: "Client Application",
        icon: Code2,
        tag: "UI / UX",
        items: ["Next.js 16 (App Router)", "React 19 & Turbopack", "TypeScript 5", "Tailwind CSS v4", "Lucide Icons", "Client Zod Validation"],
    },
    {
        category: "Backend Services",
        icon: Server,
        tag: "Inference Server",
        items: ["FastAPI Async Framework", "Python 3.10+ Engine", "Pydantic v2 Settings", "SlowAPI Rate Limiter", "PIL Decompression Guard"],
    },
    {
        category: "Deep Learning Engine",
        icon: BrainCircuit,
        tag: "AI Architecture",
        items: ["TensorFlow 2.21+ & Keras 3", "U-Net Skip-Connection Model", "Multi-Temporal 6-Band Fusion", "S1GFloods SAR/Optical Dataset", "NumPy Vectorized Ops"],
    },
];

export function TechStack() {
    return (
        <section id="tech-stack" className="py-24 bg-slate-950/40 border-t border-slate-800/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                        Engineering Stack
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                        Modern Geospatial AI Stack
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                        Engineered with a high-throughput, fault-tolerant stack for rapid disaster assessment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {techStack.map(({ category, icon: Icon, tag, items }) => (
                        <div key={category} className="glass rounded-3xl p-8 border border-slate-800 bg-slate-900/40 hover:border-teal-500/30 transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-teal-400" />
                                </div>
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-teal-300 font-mono border border-slate-700">
                                    {tag}
                                </span>
                            </div>

                            <h3 className="font-extrabold text-lg text-white mb-5">{category}</h3>
                            <ul className="space-y-3">
                                {items.map((item) => (
                                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                                        <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                                            <Check className="w-2.5 h-2.5" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
