import { RECIPE_ASSISTANT_TASK4_CHAT_URL } from "./urls";

import type { Message } from "@/types/query/tasks/response";

type ChatResponsePayload = {
	response: string;
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
	return { role: "assistant", content: data.response };
};
