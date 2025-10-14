import clsx from "clsx";

import { useRecipes } from "../../context/activeRecipeIndex/hooks";

import type { FC } from "react";
import type { RecipeItem } from "@/types/query/tasks/02";

interface Props {
	currentIndex: number;
	recipe: RecipeItem;
}

const HistoryItem: FC<Props> = ({ currentIndex, recipe }) => {
	const { activeRecipeIndex, setActiveRecipeIndex } = useRecipes();

	return (
		<button
			type="button"
			className={clsx(
				"group !text-left w-full gap-2 rounded-md p-2 font-medium text-sm first-letter:uppercase hover:bg-primary-50 hover:text-primary-600",
				{
					"bg-primary-50 text-gray-900/70": currentIndex === activeRecipeIndex,
				}
			)}
			onClick={() => setActiveRecipeIndex(currentIndex)}
		>
			{recipe.title} <span>({"ingredients" in recipe ? "ingredients" : "recipe"})</span>
		</button>
	);
};

export default HistoryItem;
