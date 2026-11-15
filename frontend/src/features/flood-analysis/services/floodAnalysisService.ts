import { ApiAnalysisResponse, AnalysisResult } from "../types";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== "")
    ? process.env.NEXT_PUBLIC_API_URL
    : "";

/**
 * Optimizes large images (> 800KB) down to a balanced 512x512 raster
 * before upload to prevent serverless 413 Payload Too Large limits.
 */
async function prepareImageForAnalysis(file: File): Promise<File> {
    if (typeof window === "undefined" || file.size < 700 * 1024) {
        return file;
    }

    return new Promise((resolve) => {
        const img = new window.Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement("canvas");
            const maxDim = 512;
            let width = img.naturalWidth || img.width;
            let height = img.naturalHeight || img.height;

            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }

            canvas.width = Math.max(1, width);
            canvas.height = Math.max(1, height);
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve(file);
                return;
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }
                    const optimizedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
                        type: "image/jpeg",
                        lastModified: Date.now(),
                    });
                    resolve(optimizedFile);
                },
                "image/jpeg",
                0.88
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file);
        };

        img.src = url;
    });
}

function mapResponse(raw: ApiAnalysisResponse): AnalysisResult {
    return {
        analysisId: raw.analysis_id,
        maskB64: raw.mask_b64,
        width: raw.width,
        height: raw.height,
        floodPixels: raw.flood_pixels,
        totalPixels: raw.total_pixels,
        floodPercentage: raw.flood_percentage,
        threshold: raw.threshold,
        processingTimeMs: raw.processing_time_ms,
        modelVersion: raw.model_version,
    };
}

export async function analyzeImages(
    preFloodImage: File,
    postFloodImage: File
): Promise<AnalysisResult> {
    // Automatically scale down huge files to prevent 413 limits while preserving spatial features
    const [optimizedPre, optimizedPost] = await Promise.all([
        prepareImageForAnalysis(preFloodImage),
        prepareImageForAnalysis(postFloodImage),
    ]);

    const body = new FormData();
    body.append("pre_flood_image", optimizedPre);
    body.append("post_flood_image", optimizedPost);

    let response: Response;
    try {
        response = await fetch(`${API_BASE}/api/v1/analyze`, {
            method: "POST",
            body,
            // No Content-Type header — browser sets multipart boundary automatically
        });
    } catch {
        throw new Error(
            `Unable to connect to the analysis engine at ${API_BASE || "cloud API"}. Please try again.`
        );
    }

    if (!response.ok) {
        let errorMsg = `Analysis request failed (Status ${response.status}).`;
        if (response.status === 413) {
            errorMsg = "Uploaded images exceed the cloud payload limit. Please use images under 10 MB each.";
        } else {
            try {
                const json = await response.json();
                if (typeof json?.error === "string") {
                    errorMsg = json.error;
                } else if (typeof json?.detail === "string") {
                    errorMsg = json.detail;
                } else if (Array.isArray(json?.detail)) {
                    errorMsg = json.detail
                        .map((item: { msg?: string }) => item.msg ?? JSON.stringify(item))
                        .join("; ");
                }
            } catch {
                // Ignore parse error, use default message
            }
        }
        throw new Error(errorMsg);
    }

    const raw: ApiAnalysisResponse = await response.json();
    return mapResponse(raw);
}
