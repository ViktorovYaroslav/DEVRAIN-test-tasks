export interface Ingredient {
	name: string;
	quantity: string;
	unit: string;
}

export interface RecipeInstruction {
	title: string;
	recipe: string;
	steps: string[];
	notes: string[];
}

export interface RecipeIngredients {
	title: string;
	ingredients: Ingredient[];
}

export interface RecommendedRecipes {
	suggestions: Array<{
		title: string;
		matchScore: number;
		missing: string[];
		why: string;
	}>;
}

export type RecipeItem = RecipeIngredients | RecipeInstruction | RecommendedRecipes;

export interface UserMessage {
	role: "user";
	content: string;
}

export interface AssistantMessage {
	role: "assistant";
	content: string;
}

export type Message = UserMessage | AssistantMessage;
