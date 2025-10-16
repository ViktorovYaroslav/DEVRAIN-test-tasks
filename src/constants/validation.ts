import * as v from "valibot";

export const CHAT_TEXTAREA_VALIDATION_SCHEMA = v.pipe(v.string(), v.minLength(1, "Message is required"));
