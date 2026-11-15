import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        model_version: "1.0.0",
        input_shape: "(1, 256, 256, 6)",
        output_shape: "(1, 256, 256, 1)",
        threshold: 0.5,
        is_loaded: true,
        backbone: "Symmetric U-Net with Skip Connections",
        dataset: "S1GFloods (Sentinel-1 SAR + Sentinel-2 Optical)",
    });
}
