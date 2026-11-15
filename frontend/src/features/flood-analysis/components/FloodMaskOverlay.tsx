"use client";

import { useEffect, useRef, useState } from "react";
import { Sliders, Eye } from "lucide-react";

interface FloodMaskOverlayProps {
    postImageUrl: string;
    maskB64: string;
}

export function FloodMaskOverlay({ postImageUrl, maskB64 }: FloodMaskOverlayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [opacity, setOpacity] = useState<number>(60);
    const [showOverlay, setShowOverlay] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const size = 256;
        canvas.width = size;
        canvas.height = size;

        // Draw post-flood base image
        const baseImg = new window.Image();
        baseImg.crossOrigin = "anonymous";

        baseImg.onload = () => {
            if (!isMounted) return;
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(baseImg, 0, 0, size, size);

            if (!showOverlay) return;

            // Overlay the mask in cyan/teal with variable opacity on flood pixels
            const maskImg = new window.Image();
            maskImg.crossOrigin = "anonymous";

            maskImg.onload = () => {
                if (!isMounted) return;
                const offscreenMask = document.createElement("canvas");
                offscreenMask.width = size;
                offscreenMask.height = size;
                const maskCtx = offscreenMask.getContext("2d")!;
                maskCtx.drawImage(maskImg, 0, 0, size, size);

                const maskData = maskCtx.getImageData(0, 0, size, size);

                const offscreenOverlay = document.createElement("canvas");
                offscreenOverlay.width = size;
                offscreenOverlay.height = size;
                const overlayCtx = offscreenOverlay.getContext("2d")!;
                const overlayImageData = overlayCtx.createImageData(size, size);

                const alphaValue = Math.round((opacity / 100) * 255);

                for (let i = 0; i < maskData.data.length; i += 4) {
                    const isFlood = maskData.data[i] > 127; // grayscale — flood = white (255)
                    overlayImageData.data[i] = isFlood ? 0 : 0;         // R (cyan/teal)
                    overlayImageData.data[i + 1] = isFlood ? 212 : 0;   // G
                    overlayImageData.data[i + 2] = isFlood ? 200 : 0;   // B
                    overlayImageData.data[i + 3] = isFlood ? alphaValue : 0; // A
                }

                overlayCtx.putImageData(overlayImageData, 0, 0);

                // Draw overlay on top of base image with native alpha blending
                ctx.drawImage(offscreenOverlay, 0, 0);
            };

            maskImg.src = `data:image/png;base64,${maskB64}`;
        };

        baseImg.src = postImageUrl;

        return () => {
            isMounted = false;
        };
    }, [postImageUrl, maskB64, opacity, showOverlay]);

    return (
        <div className="glass rounded-2xl p-5 sm:p-6 border border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                    <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                        <span>Flood Mask Composite Overlay</span>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                            Teal = Flood Water
                        </span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Interactive layer blending post-flood optical satellite imagery with U-Net prediction
                    </p>
                </div>

                {/* Opacity slider and toggle */}
                <div className="flex items-center gap-4 bg-secondary/60 px-3.5 py-2 rounded-xl border border-border/60 shrink-0">
                    <button
                        type="button"
                        onClick={() => setShowOverlay(!showOverlay)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
                            showOverlay
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                        title="Toggle overlay on/off"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{showOverlay ? "Visible" : "Hidden"}</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <Sliders className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-mono w-9">{opacity}%</span>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={opacity}
                            disabled={!showOverlay}
                            onChange={(e) => setOpacity(Number(e.target.value))}
                            className="w-20 sm:w-28 accent-primary cursor-pointer disabled:opacity-40"
                            aria-label="Overlay opacity"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Post-flood base */}
                <div className="rounded-xl overflow-hidden border border-border/40 bg-secondary/20">
                    <div className="relative h-64 sm:h-72 w-full">
                        <img
                            src={postImageUrl}
                            alt="Post-flood satellite base"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <p className="text-xs text-center font-medium text-muted-foreground py-2 border-t border-border/40">
                        Post-Flood Satellite Scene
                    </p>
                </div>

                {/* Composite overlay */}
                <div className="rounded-xl overflow-hidden border border-primary/30 bg-secondary/20">
                    <div className="flex items-center justify-center h-64 sm:h-72 w-full bg-black/25">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full object-contain"
                            style={{ imageRendering: "pixelated" }}
                        />
                    </div>
                    <p className="text-xs text-center text-primary font-semibold py-2 border-t border-border/40 bg-primary/5">
                        Composite Layer ({opacity}% Opacity)
                    </p>
                </div>
            </div>
        </div>
    );
}
