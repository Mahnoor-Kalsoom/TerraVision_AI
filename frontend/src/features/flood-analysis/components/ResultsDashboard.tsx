"use client";

import { AnalysisResult } from "../types";
import { StatCard } from "./StatCard";
import { SideBySideComparison } from "./SideBySideComparison";
import { FloodMaskOverlay } from "./FloodMaskOverlay";
import { Download, RefreshCw, CheckCircle2, Droplets, Target, Timer, Info, Cpu, Sparkles } from "lucide-react";

interface ResultsDashboardProps {
    result: AnalysisResult;
    preImageUrl: string;
    postImageUrl: string;
    onReset: () => void;
}

function downloadMask(maskB64: string, analysisId: string) {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${maskB64}`;
    link.download = `flood_mask_${analysisId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function ResultsDashboard({
    result,
    preImageUrl,
    postImageUrl,
    onReset,
}: ResultsDashboardProps) {
    const maskDataUrl = `data:image/png;base64,${result.maskB64}`;

    return (
        <div className="space-y-6 w-full animate-in fade-in duration-300">
            {/* Success header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl glass border border-primary/40 bg-primary/5 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0 shadow-inner">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-extrabold text-lg text-foreground">Analysis Complete</p>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Inference Complete
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate max-w-[240px] sm:max-w-none">
                            Run ID: {result.analysisId}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        id="download-mask"
                        type="button"
                        onClick={() => downloadMask(result.maskB64, result.analysisId)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-slate-950 text-xs sm:text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/25 cursor-pointer hover:scale-105 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Download Mask PNG
                    </button>
                    <button
                        id="run-new-analysis"
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-secondary/80 text-foreground text-xs sm:text-sm font-bold hover:border-primary/40 hover:bg-secondary transition-all cursor-pointer shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        New Analysis
                    </button>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <StatCard
                    icon={Droplets}
                    label="Flood Coverage"
                    value={`${result.floodPercentage}%`}
                    subValue="of 256×256 area"
                    accent
                />
                <StatCard
                    icon={Info}
                    label="Flood Pixels"
                    value={result.floodPixels.toLocaleString()}
                    subValue={`of ${result.totalPixels.toLocaleString()} total`}
                />
                <StatCard
                    icon={Target}
                    label="Threshold"
                    value={result.threshold.toString()}
                    subValue="binary cutoff"
                />
                <StatCard
                    icon={Timer}
                    label="Processing"
                    value={`${result.processingTimeMs.toFixed(0)} ms`}
                    subValue="end-to-end"
                />
                <div className="col-span-2 sm:col-span-1">
                    <StatCard
                        icon={Cpu}
                        label="Model Version"
                        value={result.modelVersion}
                        subValue="U-Net · S1GFloods"
                    />
                </div>
            </div>

            {/* Side-by-side comparison */}
            <SideBySideComparison
                preImageUrl={preImageUrl}
                postImageUrl={postImageUrl}
                maskDataUrl={maskDataUrl}
            />

            {/* Overlay */}
            <FloodMaskOverlay postImageUrl={postImageUrl} maskB64={result.maskB64} />

            {/* Raw mask */}
            <div className="glass rounded-2xl p-5 sm:p-6 border border-border/60">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Predicted Binary Flood Mask</span>
                </h3>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="rounded-2xl overflow-hidden border-2 border-border/70 bg-black/50 shrink-0 shadow-md">
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                            <img
                                src={maskDataUrl}
                                alt="Flood mask"
                                className="w-full h-full object-contain"
                                style={{ imageRendering: "pixelated" }}
                            />
                        </div>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-2.5">
                        <p>
                            <span className="font-bold text-foreground">White pixels</span> indicate areas
                            classified as <span className="text-primary font-bold">flooded</span> (model output probability ≥ {result.threshold}).
                        </p>
                        <p>
                            <span className="font-bold text-foreground">Black pixels</span> indicate
                            non-flooded terrain or permanent dry ground.
                        </p>
                        <p>
                            The generated mask is exactly {result.width} × {result.height} pixels, matching the input spatial dimensions for satellite tile analysis.
                        </p>
                        <div className="text-xs border-t border-border/40 pt-3 text-muted-foreground/80">
                            * Model evaluation: S1GFloods validation IoU 0.9249, Precision 0.9582, Recall 0.9637.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
