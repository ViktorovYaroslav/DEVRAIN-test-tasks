import { useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { TASK2_QUERY_KEY } from "@/constants/query/keys";

import type { RecipeItem } from "@/types/query/tasks/02";

const useRecipes = () => {
	const [loadNewRecipe, setLoadNewRecipe] = useState(false);

	const queryClient = useQueryClient();

	const query = useQuery<RecipeItem[] | null>({
		queryKey: [TASK2_QUERY_KEY],
		queryFn: async () => null,
		enabled: false,
	});

	const setNewRecipe = (recipe: RecipeItem) => {
		queryClient.setQueryData<RecipeItem[]>([TASK2_QUERY_KEY], (prev) => (prev ? [...prev, recipe] : [recipe]));
	};

	return {
		...query,
		loadNewRecipe,
		setLoadNewRecipe,
		setNewRecipe,
	};
};

export default useRecipes;
