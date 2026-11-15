"use client";

import { useState, useCallback } from "react";
import { AnalysisResult, AnalysisStatus, UploadedImage } from "../types";
import { analyzeImages } from "../services/floodAnalysisService";

function isPreFloodName(name: string): boolean {
    const lower = name.toLowerCase();
    return lower.includes("pre") || lower.includes("before") || lower.includes("prior") || lower.includes("early");
}

function isPostFloodName(name: string): boolean {
    const lower = name.toLowerCase();
    return lower.includes("post") || lower.includes("after") || lower.includes("flood") || lower.includes("late");
}

export function useFloodAnalysis() {
    const [preImage, setPreImage] = useState<UploadedImage | null>(null);
    const [postImage, setPostImage] = useState<UploadedImage | null>(null);
    const [status, setStatus] = useState<AnalysisStatus>("idle");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoadingDemo, setIsLoadingDemo] = useState(false);
    const [selectedPairIndex, setSelectedPairIndex] = useState<number>(1);

    const setImage = useCallback(
        (type: "pre" | "post", file: File | null) => {
            if (type === "pre") {
                setPreImage((prev) => {
                    if (prev) URL.revokeObjectURL(prev.previewUrl);
                    return file ? { file, previewUrl: URL.createObjectURL(file) } : null;
                });
            } else {
                setPostImage((prev) => {
                    if (prev) URL.revokeObjectURL(prev.previewUrl);
                    return file ? { file, previewUrl: URL.createObjectURL(file) } : null;
                });
            }
            setErrorMessage(null);
            setResult(null);
        },
        []
    );

    const handleMultipleFiles = useCallback((files: File[]) => {
        if (!files || files.length === 0) return;

        if (files.length === 1) {
            setPreImage((prevPre) => {
                if (!prevPre) {
                    return { file: files[0], previewUrl: URL.createObjectURL(files[0]) };
                }
                setPostImage((prevPost) => {
                    if (prevPost) URL.revokeObjectURL(prevPost.previewUrl);
                    return { file: files[0], previewUrl: URL.createObjectURL(files[0]) };
                });
                return prevPre;
            });
            setErrorMessage(null);
            setResult(null);
            return;
        }

        const fileA = files[0];
        const fileB = files[1];

        let preFile = fileA;
        let postFile = fileB;

        if (isPreFloodName(fileB.name) || isPostFloodName(fileA.name)) {
            preFile = fileB;
            postFile = fileA;
        }

        setPreImage((prev) => {
            if (prev) URL.revokeObjectURL(prev.previewUrl);
            return { file: preFile, previewUrl: URL.createObjectURL(preFile) };
        });

        setPostImage((prev) => {
            if (prev) URL.revokeObjectURL(prev.previewUrl);
            return { file: postFile, previewUrl: URL.createObjectURL(postFile) };
        });

        setErrorMessage(null);
        setResult(null);
    }, []);

    const swapImages = useCallback(() => {
        setPreImage(postImage);
        setPostImage(preImage);
        setResult(null);
        setErrorMessage(null);
    }, [preImage, postImage]);

    const loadDemoImages = useCallback(async (pairNum: number = 1) => {
        setIsLoadingDemo(true);
        setSelectedPairIndex(pairNum);
        setErrorMessage(null);
        try {
            const preUrl = `/samples/real_flood_pair_${pairNum}_pre.png`;
            const postUrl = `/samples/real_flood_pair_${pairNum}_post.png`;

            const [preRes, postRes] = await Promise.all([
                fetch(preUrl),
                fetch(postUrl),
            ]);

            if (!preRes.ok || !postRes.ok) {
                // Fallback to primary demo
                const [fPre, fPost] = await Promise.all([
                    fetch("/samples/pre_flood.png"),
                    fetch("/samples/post_flood.png"),
                ]);
                if (!fPre.ok || !fPost.ok) {
                    throw new Error("Could not load sample satellite imagery.");
                }
                const [b1, b2] = await Promise.all([fPre.blob(), fPost.blob()]);
                const f1 = new File([b1], `sentinel_pre_flood.png`, { type: "image/png" });
                const f2 = new File([b2], `sentinel_post_flood.png`, { type: "image/png" });
                setPreImage({ file: f1, previewUrl: URL.createObjectURL(f1) });
                setPostImage({ file: f2, previewUrl: URL.createObjectURL(f2) });
                setResult(null);
                setStatus("idle");
                return;
            }

            const [preBlob, postBlob] = await Promise.all([preRes.blob(), postRes.blob()]);

            const preFile = new File([preBlob], `sentinel_pair_${pairNum}_pre.png`, { type: "image/png" });
            const postFile = new File([postBlob], `sentinel_pair_${pairNum}_post.png`, { type: "image/png" });

            setPreImage((prev) => {
                if (prev) URL.revokeObjectURL(prev.previewUrl);
                return { file: preFile, previewUrl: URL.createObjectURL(preFile) };
            });

            setPostImage((prev) => {
                if (prev) URL.revokeObjectURL(prev.previewUrl);
                return { file: postFile, previewUrl: URL.createObjectURL(postFile) };
            });

            setResult(null);
            setStatus("idle");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to load satellite images.";
            setErrorMessage(msg);
        } finally {
            setIsLoadingDemo(false);
        }
    }, []);

    const submit = useCallback(async () => {
        if (!preImage || !postImage) return;

        setStatus("loading");
        setResult(null);
        setErrorMessage(null);

        try {
            const analysisResult = await analyzeImages(preImage.file, postImage.file);
            setResult(analysisResult);
            setStatus("success");
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred during flood analysis.";
            setErrorMessage(msg);
            setStatus("error");
        }
    }, [preImage, postImage]);

    const reset = useCallback(() => {
        if (preImage) URL.revokeObjectURL(preImage.previewUrl);
        if (postImage) URL.revokeObjectURL(postImage.previewUrl);
        setPreImage(null);
        setPostImage(null);
        setStatus("idle");
        setResult(null);
        setErrorMessage(null);
    }, [preImage, postImage]);

    return {
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
    };
}
