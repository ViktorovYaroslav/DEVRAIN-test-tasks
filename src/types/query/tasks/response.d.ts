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

export interface RecommendedRecipe {
	title: string;
	matchScore: number;
	missing: string[];
	why: string;
}

export type RecipeItem02 = RecipeIngredients | RecipeInstruction;

export type RecipeItem03 = RecipeIngredients | RecipeInstruction | RecommendedRecipe;
