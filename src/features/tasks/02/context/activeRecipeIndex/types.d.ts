import type { Dispatch, SetStateAction } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { RecipeItem } from "@/types/query/tasks/02";

export interface RecipeContextType {
	activeRecipeIndex: number;
	recipesLoading: boolean;
	query: UseQueryResult<RecipeItem[] | null>;
	setNewRecipe: (recipe: RecipeItem) => void;
	setRecipesLoading: Dispatch<SetStateAction<boolean>>;
	setActiveRecipeIndex: Dispatch<SetStateAction<number>>;
}
