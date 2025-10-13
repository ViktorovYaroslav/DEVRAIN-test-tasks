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

export type RecipeItem = RecipeIngredients | RecipeInstruction;
