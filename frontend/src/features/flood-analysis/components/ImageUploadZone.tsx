"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, RefreshCw, ImageIcon, CheckCircle2, FolderOpen } from "lucide-react";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/constants";

interface ImageUploadZoneProps {
    id: string;
    label: string;
    badgeLabel?: string;
    description: string;
    previewUrl?: string;
    fileName?: string;
    fileSize?: number;
    onFileSelect: (file: File | null) => void;
    onMultiFileSelect?: (files: File[]) => void;
    error?: string;
}

function formatBytes(bytes?: number): string {
    if (!bytes || bytes <= 0) return "";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `(${mb.toFixed(1)} MB)`;
    const kb = bytes / 1024;
    return `(${kb.toFixed(0)} KB)`;
}

export function ImageUploadZone({
    id,
    label,
    badgeLabel,
    description,
    previewUrl,
    fileName,
    fileSize,
    onFileSelect,
    onMultiFileSelect,
    error,
}: ImageUploadZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);

    const processFiles = useCallback(
        (files: FileList | File[] | null) => {
            if (!files || files.length === 0) return;
            const fileArray = Array.from(files);

            if (fileArray.length > 1 && onMultiFileSelect) {
                onMultiFileSelect(fileArray);
                return;
            }

            onFileSelect(fileArray[0]);
        },
        [onFileSelect, onMultiFileSelect]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            dragCounter.current = 0;
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processFiles(e.dataTransfer.files);
            }
        },
        [processFiles]
    );

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current += 1;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current -= 1;
        if (dragCounter.current <= 0) {
            dragCounter.current = 0;
            setIsDragging(false);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            processFiles(e.target.files);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        },
        [processFiles]
    );

    const triggerFilePicker = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                triggerFilePicker();
            }
        },
        [triggerFilePicker]
    );

    return (
        <div className="flex flex-col gap-2.5 w-full">
            {/* Header label and status badge */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor={id}
                            onClick={triggerFilePicker}
                            className="text-sm font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                        >
                            {label}
                        </label>
                        {badgeLabel && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-secondary/90 text-primary border border-primary/20">
                                {badgeLabel}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>

                {previewUrl ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 shadow-sm shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Ready
                    </span>
                ) : (
                    <span className="text-[11px] text-muted-foreground/80 font-medium shrink-0">
                        Required
                    </span>
                )}
            </div>

            {/* Hidden file input supporting multiple selection */}
            <input
                ref={inputRef}
                id={id}
                type="file"
                multiple
                className="sr-only"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={handleChange}
                aria-label={`Select ${label}`}
            />

            {previewUrl ? (
                /* Preview state — standard <img> guarantees strict bounded dimensions without Next.js fill overflow */
                <div
                    onDrop={handleDrop}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-200 shadow-md ${
                        isDragging
                            ? "border-primary ring-4 ring-primary/30 bg-primary/10 scale-[1.01]"
                            : error
                            ? "border-destructive/60 bg-destructive/5"
                            : "border-border/80 group bg-slate-900/60 hover:border-primary/50"
                    }`}
                >
                    <div
                        onClick={triggerFilePicker}
                        onKeyDown={handleKeyDown}
                        role="button"
                        tabIndex={0}
                        title="Click to replace image"
                        className="relative h-56 sm:h-60 w-full cursor-pointer overflow-hidden bg-black/40 focus:outline-none"
                    >
                        {/* Standard HTML <img> prevents any layout blowout */}
                        <img
                            src={previewUrl}
                            alt={`${label} preview`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Hover overlay with instructions */}
                        <div
                            className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/65 backdrop-blur-[2px] transition-opacity duration-200 ${
                                isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shadow-lg">
                                <RefreshCw className="w-6 h-6 animate-pulse" />
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-white px-3.5 py-1.5 rounded-xl bg-black/80 border border-white/10 shadow">
                                {isDragging ? "Drop to replace this image" : "Click or drop new file to replace"}
                            </p>
                        </div>
                    </div>

                    {/* Bottom file info & action bar */}
                    <div className="px-3.5 py-2.5 flex items-center justify-between gap-2 bg-slate-900/90 border-t border-border/70">
                        <div className="flex items-center gap-2 min-w-0">
                            <ImageIcon className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-xs text-foreground font-semibold truncate max-w-[140px] sm:max-w-[220px]">
                                {fileName ?? "Selected satellite image"}
                            </span>
                            {fileSize && (
                                <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
                                    {formatBytes(fileSize)}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={triggerFilePicker}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary text-foreground hover:bg-primary/20 hover:text-primary transition-all border border-border/80 shadow-sm cursor-pointer"
                                title="Choose a different image"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Change</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onFileSelect(null)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all border border-border/80 shadow-sm cursor-pointer"
                                title="Remove image"
                                aria-label={`Remove ${label}`}
                            >
                                <X className="w-3.5 h-3.5" />
                                <span>Remove</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Drop zone state with styled, clickable primary button */
                <div
                    onClick={triggerFilePicker}
                    onKeyDown={handleKeyDown}
                    onDrop={handleDrop}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    role="button"
                    tabIndex={0}
                    aria-label={`Upload ${label}`}
                    className={`relative flex flex-col items-center justify-center gap-3.5 rounded-2xl border-2 border-dashed h-56 sm:h-60 px-5 text-center cursor-pointer transition-all duration-200 select-none shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                        isDragging
                            ? "border-primary bg-primary/10 ring-4 ring-primary/30 scale-[1.01]"
                            : error
                            ? "border-destructive/60 bg-destructive/5 hover:border-destructive"
                            : "border-border/80 bg-slate-900/40 hover:border-primary/60 hover:bg-primary/5 hover:shadow-md"
                    }`}
                >
                    <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 ${
                            isDragging
                                ? "bg-primary text-primary-foreground scale-110 shadow-lg glow"
                                : "bg-primary/10 border border-primary/30 text-primary group-hover:scale-105"
                        }`}
                    >
                        <Upload className="w-6 h-6 text-primary" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">
                            {isDragging ? "Drop your satellite image here" : `Choose ${label}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            JPEG, PNG, WebP, TIFF · Max 10 MB
                        </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={(e) => {
                                e.stopPropagation();
                                triggerFilePicker();
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-slate-950 hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <FolderOpen className="w-4 h-4" />
                            Browse Image
                        </button>
                    </div>

                    <p className="text-[11px] text-muted-foreground/75">
                        Click anywhere or drag & drop file here
                    </p>
                </div>
            )}

            {error && (
                <p className="text-xs text-destructive flex items-center gap-1 font-semibold mt-0.5">
                    {error}
                </p>
            )}
        </div>
    );
}
