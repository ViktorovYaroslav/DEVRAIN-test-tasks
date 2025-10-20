import type { ChatMode } from "@/types/query/tasks/modes";

export const CHAT_TEXTAREA_PLACEHOLDERS: Record<ChatMode, string> = {
	recommend: "E.g., 'I have chicken and rice, what can I make?'",
	instruction: "How to cook spaghetti carbonara?",
	ingredients: "List ingredients for a chocolate cake recipe.",
};
