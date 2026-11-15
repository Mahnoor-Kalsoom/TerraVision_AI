/** Application-wide constants. */

/** Maximum upload size: 10 MB */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Accepted MIME types for satellite image uploads */
export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/tiff",
];

/** Backend API base URL — set via NEXT_PUBLIC_API_URL env var */
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
