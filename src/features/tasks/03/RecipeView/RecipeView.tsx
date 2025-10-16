import clsx from "clsx";
import { Transition } from "@headlessui/react";

import { Steps } from "@/components/ui/lists";
import { SparklesLoader } from "@/components/ui/loaders";
import { Ingredient } from "@/components/ui/content";
import { useRecipes } from "@/context/activeRecipeIndex/hooks";

import type { FC } from "react";

const RecipeView: FC = () => {
	const {
		query: { data: recipes },
		activeRecipeIndex,
		recipesLoading,
	} = useRecipes();

	const recipe = recipes ? recipes[activeRecipeIndex] : null;

	const isLoadingMore = recipesLoading && (recipes?.length ?? 0) > 0;

	return (
		<div
			className={clsx("relative w-full max-w-3xl opacity-0 transition-all duration-400 ease-out", {
				"grow opacity-100": recipes && recipes.length > 0,
			})}
		>
			<Transition
				show={isLoadingMore}
				as={"div"}
				className="-translate-x-10 -translate-y-10 absolute top-1/2 left-1/2"
				enter="transition-opacity duration-1000 ease-out"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-400 ease-out"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<SparklesLoader />
			</Transition>

			<div
				className={clsx("h-full transition-all duration-400 ease-out", {
					"select-none blur-md": isLoadingMore,
					"overflow-auto": !isLoadingMore,
				})}
			>
				{recipe && (
					<div className="space-y-8">
						<h2 className="font-medium text-xl first-letter:uppercase">{recipe.title}</h2>

						{"recipe" in recipe && <p>{recipe.recipe}</p>}

						{"notes" in recipe && recipe.notes.length > 0 && (
							<ul className="list-inside list-disc">
								{recipe.notes.map((note: string, index: number) => (
									<li key={index}>{note}</li>
								))}
							</ul>
						)}

						{"steps" in recipe && recipe.steps.length > 0 && (
							<Steps steps={recipe.steps.map((step: string, index: number) => <p key={index}>{step}</p>)} />
						)}

						{"ingredients" in recipe && recipe.ingredients.length > 0 && (
							<ul className="flex flex-wrap gap-2">
								{recipe.ingredients.map(
									(ingredient: { name: string; quantity: string; unit: string }, index: number) => (
										<li key={index}>
											<Ingredient {...ingredient} />
										</li>
									)
								)}
							</ul>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default RecipeView;
