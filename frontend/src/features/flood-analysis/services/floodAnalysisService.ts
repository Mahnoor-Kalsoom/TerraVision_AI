import { ApiAnalysisResponse, AnalysisResult } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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
    const body = new FormData();
    body.append("pre_flood_image", preFloodImage);
    body.append("post_flood_image", postFloodImage);

    let response: Response;
    try {
        response = await fetch(`${API_BASE}/api/v1/analyze`, {
            method: "POST",
            body,
            // No Content-Type header — browser sets multipart boundary automatically
        });
    } catch {
        throw new Error(
            `Unable to connect to the backend server at ${API_BASE}. Please ensure the backend is running (uvicorn app.main:app --port 8000).`
        );
    }

    if (!response.ok) {
        let errorMsg = `Request failed (${response.status}).`;
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
        throw new Error(errorMsg);
    }

    const data: ApiAnalysisResponse = await response.json();
    return mapResponse(data);
}
