import * as v from "valibot";

export const CHAT_FORM_VALIDATION_SCHEMA = v.object({
	message: v.pipe(v.string(), v.minLength(1, "Message is required")),
});
