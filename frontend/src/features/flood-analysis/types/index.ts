/** TypeScript types for the flood-analysis feature. */

export type AnalysisStatus = "idle" | "loading" | "success" | "error";

export interface UploadedImage {
    file: File;
    previewUrl: string;
}

export interface AnalysisResult {
    analysisId: string;
    maskB64: string;
    width: number;
    height: number;
    floodPixels: number;
    totalPixels: number;
    floodPercentage: number;
    threshold: number;
    processingTimeMs: number;
    modelVersion: string;
}

export interface ApiAnalysisResponse {
    analysis_id: string;
    mask_b64: string;
    width: number;
    height: number;
    flood_pixels: number;
    total_pixels: number;
    flood_percentage: number;
    threshold: number;
    processing_time_ms: number;
    model_version: string;
}
