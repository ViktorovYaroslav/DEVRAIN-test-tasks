import { useState, createContext } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { RecipeItem } from "@/types/query/tasks/response";

import type { FC, PropsWithChildren } from "react";
import type { RecipeContextType } from "./types";

import type { UseQueryResult } from "@tanstack/react-query";

export const RecipeContext = createContext<RecipeContextType>({
	activeRecipeIndex: Infinity,
	recipesLoading: false,
	query: {} as UseQueryResult<RecipeItem[] | null>,
	setNewRecipe: () => {},
	setRecipesLoading: () => {},
	setActiveRecipeIndex: () => {},
});

interface Props extends PropsWithChildren {
	task: string;
}

export const RecipeProvider: FC<Props> = ({ children, task }) => {
	const queryKey = ["tasks", task];
	const query = useQuery<RecipeItem[] | null>({
		queryKey: queryKey,
		queryFn: async () => null,
		enabled: false,
	});

	const [activeRecipeIndex, setActiveRecipeIndex] = useState(query.data ? query.data.length - 1 : 0);
	const [recipesLoading, setRecipesLoading] = useState(false);

	const queryClient = useQueryClient();

	const setNewRecipe = (recipe: RecipeItem) => {
		queryClient.setQueryData<RecipeItem[]>(queryKey, (prev) => (prev ? [...prev, recipe] : [recipe]));
	};

	return (
		<RecipeContext.Provider
			value={{
				activeRecipeIndex,
				recipesLoading,
				query,
				setActiveRecipeIndex,
				setRecipesLoading,
				setNewRecipe,
			}}
		>
			{children}
		</RecipeContext.Provider>
	);
};

export default RecipeProvider;
