import type { RecipeIngredients, RecipeInstruction, RecommendedRecipes, RecipeItem } from "./response";

export const isRecipeInstruction = (item: RecipeItem): item is RecipeInstruction => {
	return (
		(item as RecipeInstruction)?.recipe !== undefined &&
		Array.isArray((item as RecipeInstruction)?.steps) &&
		Array.isArray((item as RecipeInstruction)?.notes)
	);
};

export const isRecipeIngredients = (item: RecipeItem): item is RecipeIngredients => {
	return Array.isArray((item as RecipeIngredients)?.ingredients);
};

export const isRecommendedRecipes = (item: RecipeItem): item is RecommendedRecipes => {
	return Array.isArray((item as RecommendedRecipes)?.suggestions);
};
