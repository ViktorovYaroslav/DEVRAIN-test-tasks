import { RECIPE_ASSISTANT_FULL_DEMO_URL } from "./urls";

import type { RecipeInstruction, RecipeIngredients, RecommendedRecipes } from "@/types/query/tasks/response";
import type { FullDemoMessage } from "@/types/query/full-demo/types";

type ChatResponse = RecipeInstruction | RecipeIngredients | RecommendedRecipes;

type ChatResponsePayload = {
	response: ChatResponse;
};

export const fetchChatResponse = async (history: FullDemoMessage[]): Promise<FullDemoMessage> => {
	const response = await fetch(RECIPE_ASSISTANT_FULL_DEMO_URL, {
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
