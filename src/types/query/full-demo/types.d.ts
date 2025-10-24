export interface FullDemoImage {
	data: string;
	mediaType: string;
}

export interface FullDemoUserMessage {
	role: "user";
	content: string;
	images?: FullDemoImage[];
}

export interface FullDemoAssistantMessage {
	role: "assistant";
	content: string;
}

export type FullDemoMessage = FullDemoUserMessage | FullDemoAssistantMessage;

export interface FullDemoRecommendationItem {
	title: string;
	why: string;
	matchScore: number;
	missing: string[];
}

export interface FullDemoRecommendationsResponse {
	response_type: "recommendations";
	data: {
		items: FullDemoRecommendationItem[];
	};
}

export interface FullDemoIngredient {
	name: string;
	quantity: string;
	unit: string;
}

export interface FullDemoRecipeResponse {
	response_type: "recipe";
	data: {
		title: string;
		summary: string;
		ingredients: FullDemoIngredient[];
		steps: string[];
		notes: string[];
	};
}

export interface FullDemoMarkdownResponse {
	response_type: "markdown";
	data: string;
}

export type FullDemoChatResponse = FullDemoRecommendationsResponse | FullDemoRecipeResponse | FullDemoMarkdownResponse;
