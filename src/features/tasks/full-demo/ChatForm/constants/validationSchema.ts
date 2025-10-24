import * as v from "valibot";

import { CHAT_TEXTAREA_VALIDATION_SCHEMA } from "@/constants/validation";
import { VALID_IMAGE_MIME_TYPES } from "./mime";

export const CHAT_FORM_VALIDATION_SCHEMA = v.object({
	message: CHAT_TEXTAREA_VALIDATION_SCHEMA,
	images: v.array(v.pipe(v.file(), v.mimeType(VALID_IMAGE_MIME_TYPES))),
});
