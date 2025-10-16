import { useContext } from "react";

import { RecipeContext } from "../RecipeProvider";

const useRecipes = () => {
	const context = useContext(RecipeContext);

	if (!context) {
		throw new Error("useRecipes must be used within an RecipeProvider");
	}

	return context;
};

export default useRecipes;
