import clsx from "clsx";

import { Steps } from "@/components/ui/lists";
import { Ingredient } from "@/components/ui/content";
import { useRecipes } from "../utils/hooks/useRecipes";

import type { FC } from "react";

const RecipeView: FC = () => {
	const { data: recipes, loadNewRecipe } = useRecipes();

	const lastRecipe = recipes ? recipes.at(-1) : null;

	return (
		<div
			className={clsx("w-full max-w-3xl overflow-auto transition-all duration-400 ease-out", {
				grow: !loadNewRecipe && recipes && recipes.length > 0,
			})}
		>
			{lastRecipe && (
				<div className="space-y-8">
					<h2 className="font-medium text-xl first-letter:uppercase">{lastRecipe.title}</h2>

					{"recipe" in lastRecipe && <p>{lastRecipe.recipe}</p>}

					{"notes" in lastRecipe && lastRecipe.notes.length > 0 && (
						<ul className="list-inside list-disc">
							{lastRecipe.notes.map((note, index) => (
								<li key={index}>{note}</li>
							))}
						</ul>
					)}

					{"steps" in lastRecipe && lastRecipe.steps.length > 0 && (
						<Steps steps={lastRecipe.steps.map((step, index) => <p key={index}>{step}</p>)} />
					)}

					{"ingredients" in lastRecipe && lastRecipe.ingredients.length > 0 && (
						<ul className="flex flex-wrap gap-2">
							{lastRecipe.ingredients.map((ingredient, index) => (
								<li key={index}>
									<Ingredient {...ingredient} />
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	);
};

export default RecipeView;
