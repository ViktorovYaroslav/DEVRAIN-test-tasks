import { useState, createContext } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { TASK2_QUERY_KEY } from "@/constants/query/keys";

import type { RecipeItem02 } from "@/types/query/tasks/response";

import type { FC, PropsWithChildren } from "react";
import type { RecipeContextType } from "./types";

import type { UseQueryResult } from "@tanstack/react-query";

export const RecipeContext = createContext<RecipeContextType>({
	activeRecipeIndex: Infinity,
	recipesLoading: false,
	query: {} as UseQueryResult<RecipeItem02[] | null>,
	setNewRecipe: () => {},
	setRecipesLoading: () => {},
	setActiveRecipeIndex: () => {},
});

export const RecipeProvider: FC<PropsWithChildren> = ({ children }) => {
	const query = useQuery<RecipeItem02[] | null>({
		queryKey: [TASK2_QUERY_KEY],
		queryFn: async () => null,
		enabled: false,
	});

	const [activeRecipeIndex, setActiveRecipeIndex] = useState(query.data ? query.data.length - 1 : 0);
	const [recipesLoading, setRecipesLoading] = useState(false);

	const queryClient = useQueryClient();

	const setNewRecipe = (recipe: RecipeItem02) => {
		queryClient.setQueryData<RecipeItem02[]>([TASK2_QUERY_KEY], (prev) => (prev ? [...prev, recipe] : [recipe]));
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
