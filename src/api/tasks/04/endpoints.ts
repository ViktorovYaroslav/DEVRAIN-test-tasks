import { RECIPE_ASSISTANT_TASK4_CHAT_URL } from "./urls";

import type { Message, RecipeInstruction, RecipeIngredients, RecommendedRecipes } from "@/types/query/tasks/response";

type ChatResponse = RecipeInstruction | RecipeIngredients | RecommendedRecipes;

type ChatResponsePayload = {
	response: ChatResponse;
};

export const fetchChatResponse = async (history: Message[]): Promise<Message> => {
	const response = await fetch(RECIPE_ASSISTANT_TASK4_CHAT_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ history }),
	});

	if (!response.ok) {
		throw new Error("Failed to fetch chat response");
	}

	const data = (await response.json()) as ChatResponsePayload;
	const content = JSON.stringify(data.response, null, 2);
	return { role: "assistant", content };
};
