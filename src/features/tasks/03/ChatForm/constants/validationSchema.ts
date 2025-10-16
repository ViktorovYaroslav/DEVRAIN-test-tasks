import * as v from "valibot";
import { CHAT_TEXTAREA_VALIDATION_SCHEMA } from "@/constants/validation";

export const CHAT_FORM_VALIDATION_SCHEMA = v.object({
	message: CHAT_TEXTAREA_VALIDATION_SCHEMA,
});
