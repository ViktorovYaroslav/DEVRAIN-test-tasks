import type { CHAT_FORM_VALIDATION_SCHEMA } from "./validationSchema";
import type { InferInput } from "valibot";

export const CHAT_FORM_INITIAL_VALUES: InferInput<typeof CHAT_FORM_VALIDATION_SCHEMA> = {
	message: "",
};
