import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/constants";

export const imageFileSchema = z
    .instanceof(File, { message: "Please select an image file." })
    .refine(
        (file) => file.size <= MAX_FILE_SIZE_BYTES,
        `Image must be smaller than ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`
    )
    .refine(
        (file) =>
            ACCEPTED_IMAGE_TYPES.includes(file.type) ||
            /\.(jpe?g|png|webp|tiff?)$/i.test(file.name),
        "Only JPEG, PNG, WebP, and TIFF images are accepted."
    );

export const uploadFormSchema = z.object({
    preFloodImage: imageFileSchema,
    postFloodImage: imageFileSchema,
});

export type UploadFormValues = z.infer<typeof uploadFormSchema>;
