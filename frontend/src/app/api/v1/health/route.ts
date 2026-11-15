import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        engine: "TerraVision AI Cloud Engine",
        model_version: "1.0.0",
        device: "Cloud / Autonomous Edge",
    });
}
