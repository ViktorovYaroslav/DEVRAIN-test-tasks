import type { Dispatch, SetStateAction } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { RecipeItem02 } from "@/types/query/tasks/response";

export interface RecipeContextType {
	activeRecipeIndex: number;
	recipesLoading: boolean;
	query: UseQueryResult<RecipeItem02[] | null>;
	setNewRecipe: (recipe: RecipeItem) => void;
	setRecipesLoading: Dispatch<SetStateAction<boolean>>;
	setActiveRecipeIndex: Dispatch<SetStateAction<number>>;
}
