import type { ChatMode } from "@/types/query/tasks/modes";

export const CHAT_TEXTAREA_PLACEHOLDERS: Record<ChatMode, string> = {
	recommend: "E.g., 'I have chicken and rice, what can I make?'",
	instruction: "I need a recipe with chicken, rice and broccoli",
	ingredients: "I have eggs, milk and flour, what can I cook?",
};
