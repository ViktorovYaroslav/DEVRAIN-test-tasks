import type { mimeType } from "valibot";

export const VALID_IMAGE_MIME_TYPES: Parameters<typeof mimeType>[0] = ["image/jpeg", "image/png", "image/webp"];
