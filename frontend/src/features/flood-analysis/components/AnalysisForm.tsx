"use client";

import {
    AlertCircle,
    ArrowRight,
    ArrowLeftRight,
    CheckCircle2,
    Circle,
    Loader2,
    Play,
    RefreshCw,
    Sparkles,
    Layers,
    Info,
    UploadCloud,
    Satellite,
    Droplets,
} from "lucide-react";
import { ImageUploadZone } from "./ImageUploadZone";
import { useFloodAnalysis } from "../hooks/useFloodAnalysis";
import { ResultsDashboard } from "./ResultsDashboard";
import { imageFileSchema } from "../schemas/uploadSchema";

export function AnalysisForm() {
    const {
        preImage,
        postImage,
        status,
        result,
        errorMessage,
        isLoadingDemo,
        selectedPairIndex,
        setImage,
        handleMultipleFiles,
        swapImages,
        loadDemoImages,
        submit,
        reset,
    } = useFloodAnalysis();

    const validateFile = (file: File | null): string | undefined => {
        if (!file) return undefined;
        const check = imageFileSchema.safeParse(file);
        if (!check.success) return check.error.issues[0]?.message;
        return undefined;
    };

    const preError = preImage ? validateFile(preImage.file) : undefined;
    const postError = postImage ? validateFile(postImage.file) : undefined;
    const isBothUploaded = Boolean(preImage && postImage);
    const canSubmit = isBothUploaded && !preError && !postError && status !== "loading";

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Header section */}
            <div className="mb-8 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-bold mb-3 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>NASA Earth Observation Challenge · U-Net Dual-Temporal Segmentation</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 text-white">
                    Satellite Flood <span className="gradient-text">Inundation Analysis</span>
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl">
                    Upload a spatially aligned pre-flood and post-flood satellite tile pair.
                    The deep neural network compares multi-temporal optical/SAR reflectance changes to detect and quantify floodwater inundation.
                </p>
            </div>

            {/* Stepper overview bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 text-xs sm:text-sm">
                <div className={`flex items-center gap-2.5 p-3 sm:p-3.5 rounded-xl border transition-all ${
                    isBothUploaded
                        ? "bg-teal-500/15 border-teal-500/50 text-teal-300 font-bold shadow-sm"
                        : "bg-slate-900/60 border-slate-800 text-slate-400"
                }`}>
                    {isBothUploaded ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    ) : (
                        <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <div className="truncate">
                        <span className="font-extrabold">Step 1:</span>{" "}
                        <span className="hidden sm:inline">Upload / Select Imagery</span>
                        <span className="sm:hidden">Upload</span>
                    </div>
                </div>

                <div className={`flex items-center gap-2.5 p-3 sm:p-3.5 rounded-xl border transition-all ${
                    status === "loading"
                        ? "bg-teal-500/20 border-teal-400 text-teal-300 font-bold animate-pulse shadow-md"
                        : status === "success"
                        ? "bg-teal-500/15 border-teal-500/50 text-teal-300 font-bold shadow-sm"
                        : "bg-slate-900/60 border-slate-800 text-slate-400"
                }`}>
                    {status === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    ) : (
                        <Layers className="w-4 h-4 shrink-0" />
                    )}
                    <div className="truncate">
                        <span className="font-extrabold">Step 2:</span>{" "}
                        <span className="hidden sm:inline">U-Net AI Inference</span>
                        <span className="sm:hidden">Inference</span>
                    </div>
                </div>

                <div className={`flex items-center gap-2.5 p-3 sm:p-3.5 rounded-xl border transition-all ${
                    status === "success"
                        ? "bg-teal-500/15 border-teal-500/50 text-teal-300 font-bold shadow-sm"
                        : "bg-slate-900/60 border-slate-800 text-slate-400"
                }`}>
                    {status === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    ) : (
                        <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <div className="truncate">
                        <span className="font-extrabold">Step 3:</span>{" "}
                        <span className="hidden sm:inline">Results & Flood Mask</span>
                        <span className="sm:hidden">Results</span>
                    </div>
                </div>
            </div>

            {/* Upload section */}
            {status !== "success" && (
                <div className="glass rounded-3xl p-5 sm:p-7 md:p-8 mb-6 border border-slate-800 bg-slate-950/70 shadow-2xl transition-all">
                    {/* Quick Action & Real Dataset Selector Bar */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 shadow-md">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-semibold">
                                <Satellite className="w-4 h-4 text-teal-400 shrink-0" />
                                <span>1-Click Real Sentinel-1 Satellite Benchmark Datasets:</span>
                            </div>

                            {(preImage || postImage) && (
                                <button
                                    type="button"
                                    onClick={swapImages}
                                    title="Swap Pre-Flood and Post-Flood images"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:border-teal-500/40 cursor-pointer self-start lg:self-auto"
                                >
                                    <ArrowLeftRight className="w-3.5 h-3.5 text-teal-400" />
                                    <span>Swap Pre ⇄ Post</span>
                                </button>
                            )}
                        </div>

                        {/* 3 Real Test Samples Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {[
                                { id: 1, label: "Sample 1: River Inundation", badge: "~6.9% Flood", desc: "Moderate water rise" },
                                { id: 2, label: "Sample 2: Regional Flood", badge: "~24.7% Flood", desc: "Severe overland flooding" },
                                { id: 3, label: "Sample 3: Extreme Flood", badge: "~86.2% Flood", desc: "Extensive submersion" },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => loadDemoImages(item.id)}
                                    disabled={isLoadingDemo}
                                    className={`flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                        selectedPairIndex === item.id && (preImage || postImage)
                                            ? "bg-teal-500/20 border-teal-500/60 shadow-[0_0_15px_rgba(0,210,200,0.2)]"
                                            : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full mb-1">
                                        <span className="text-xs font-bold text-white">{item.label}</span>
                                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-400">{item.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dual upload cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-7">
                        <ImageUploadZone
                            id="pre-flood-image"
                            label="Pre-Flood Satellite Image"
                            badgeLabel="Before Event"
                            description="Baseline optical/SAR scene before inundation"
                            previewUrl={preImage?.previewUrl}
                            fileName={preImage?.file.name}
                            fileSize={preImage?.file.size}
                            onFileSelect={(file) => setImage("pre", file)}
                            onMultiFileSelect={handleMultipleFiles}
                            error={preError}
                        />

                        <ImageUploadZone
                            id="post-flood-image"
                            label="Post-Flood Satellite Image"
                            badgeLabel="After Event"
                            description="Inundated optical/SAR scene during or after flood"
                            previewUrl={postImage?.previewUrl}
                            fileName={postImage?.file.name}
                            fileSize={postImage?.file.size}
                            onFileSelect={(file) => setImage("post", file)}
                            onMultiFileSelect={handleMultipleFiles}
                            error={postError}
                        />
                    </div>

                    {/* Alignment notice */}
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6 text-xs text-amber-200/90 leading-relaxed">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                        <span>
                            <strong>Spatial Alignment:</strong> Ensure both satellite tiles cover the same coordinate bounding box.
                            The U-Net model concatenates both 3-channel optical tensors into a 6-channel input array (1, 256, 256, 6) to detect surface water change.
                        </span>
                    </div>

                    {/* Primary Action Bar */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                                isBothUploaded
                                    ? "bg-teal-500/20 border-teal-500/50 text-teal-400 shadow-sm"
                                    : "bg-slate-800 border-slate-700 text-slate-400"
                            }`}>
                                {isBothUploaded ? (
                                    <CheckCircle2 className="w-5 h-5 text-teal-400" />
                                ) : (
                                    <UploadCloud className="w-5 h-5" />
                                )}
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm font-bold text-white">
                                    {isBothUploaded
                                        ? "Both Image Tiles Loaded & Ready"
                                        : "Satellite Image Status"}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {!preImage && !postImage && "0 of 2 tiles loaded · Click a sample above or drag-and-drop your own"}
                                    {preImage && !postImage && "1 of 2 tiles loaded · Please provide Post-Flood scene"}
                                    {!preImage && postImage && "1 of 2 tiles loaded · Please provide Pre-Flood scene"}
                                    {isBothUploaded && "Ready · Click button to execute U-Net neural inference"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {(preImage || postImage) && status !== "loading" && (
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-700 transition-all cursor-pointer shadow-sm active:scale-95"
                                >
                                    <RefreshCw className="w-4 h-4 inline mr-1.5" />
                                    Clear
                                </button>
                            )}

                            {/* Prominent RUN Button */}
                            <button
                                id="submit-analysis"
                                type="button"
                                onClick={submit}
                                disabled={!canSubmit}
                                className={`inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-black text-sm tracking-wide transition-all shadow-xl select-none ${
                                    canSubmit
                                        ? "bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(0,210,200,0.4)] cursor-pointer scale-[1.02] active:scale-[0.98]"
                                        : "bg-slate-800 text-slate-500 border border-slate-700 opacity-50 cursor-not-allowed"
                                }`}
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Running U-Net Inference…</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5 fill-current" />
                                        <span>RUN FLOOD ANALYSIS</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error state alert */}
            {status === "error" && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-red-500/40 bg-red-500/10 mb-6 backdrop-blur-sm shadow-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-extrabold text-red-400 text-sm">Analysis Request Failed</p>
                            <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                                {errorMessage}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={!canSubmit}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-all shrink-0 cursor-pointer shadow-md"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry Analysis
                    </button>
                </div>
            )}

            {/* Results dashboard */}
            {status === "success" && result && (
                <ResultsDashboard
                    result={result}
                    preImageUrl={preImage!.previewUrl}
                    postImageUrl={postImage!.previewUrl}
                    onReset={reset}
                />
            )}
        </div>
    );
}
