import type { Metadata } from "next";
import { AnalysisForm } from "@/features/flood-analysis/components/AnalysisForm";

export const metadata: Metadata = {
    title: "Flood Analysis Engine — TerraVision AI",
    description:
        "Upload multi-temporal pre-flood and post-flood satellite image pairs to generate binary inundation masks and spatial analytics using TerraVision AI.",
};

export default function AnalyzePage() {
    return (
        <div className="grid-bg min-h-screen py-6">
            <div className="pointer-events-none fixed top-0 left-1/2 w-[800px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
            <AnalysisForm />
        </div>
    );
}
