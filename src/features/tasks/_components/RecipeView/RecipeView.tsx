import { useState } from "react";

import clsx from "clsx";
import { Transition } from "@headlessui/react";

import { ViewMode } from "./components";
import { Steps } from "@/components/ui/lists";
import { SparklesLoader } from "@/components/ui/loaders";
import { Ingredient, MarkdownWrapper } from "@/components/ui/content";
import { useRecipes } from "@/context/activeRecipeIndex/hooks";
import { isRecipeIngredients, isRecipeInstruction, isRecommendedRecipes } from "@/types/query/tasks/guards";

import { VIEW_MODES } from "./components/ViewMode/constants/modes";

import type { FC } from "react";

const RecipeView: FC = () => {
	const {
		query: { data: recipes },
		activeRecipeIndex,
		recipesLoading,
	} = useRecipes();

	const [viewMode, setViewMode] = useState(VIEW_MODES[0].option);

	const recipe = recipes ? recipes[activeRecipeIndex] : null;

	const isLoadingMore = recipesLoading && (recipes?.length ?? 0) > 0;

	return (
		<div
			className={clsx("relative min-h-0 w-full max-w-3xl opacity-0 transition-all duration-400 ease-out", {
				"min-h-0 shrink grow opacity-100": recipes && recipes.length > 0,
			})}
		>
			<Transition
				show={isLoadingMore}
				as={"div"}
				className="-translate-x-10 -translate-y-10 absolute top-1/2 left-1/2 z-10"
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
				className={clsx("h-full min-h-0 transition-all duration-400 ease-out", {
					"select-none blur-md": isLoadingMore,
					"overflow-auto": !isLoadingMore,
				})}
			>
				{recipe && (
					<article className="space-y-8">
						<header className="flex items-center justify-between gap-4">
							<h2 className="font-medium text-xl first-letter:uppercase">
								{"title" in recipe ? recipe.title : "Recommendations"}
							</h2>
							<div className="flex-1" />
							<ViewMode onChange={setViewMode} />
						</header>

						{viewMode === "formatted" && (
							<>
								{isRecipeInstruction(recipe) && <p>{recipe.recipe}</p>}

								{isRecipeInstruction(recipe) && recipe.notes.length > 0 && (
									<ul className="list-inside list-disc">
										{recipe.notes.map((note, index) => (
											<li key={index}>{note}</li>
										))}
									</ul>
								)}

								{isRecipeInstruction(recipe) && recipe.steps.length > 0 && (
									<Steps steps={recipe.steps.map((step, index) => <p key={index}>{step}</p>)} />
								)}

								{isRecipeIngredients(recipe) && recipe.ingredients.length > 0 && (
									<ul className="flex flex-wrap gap-2">
										{recipe.ingredients.map((ingredient, index) => (
											<li key={`ingredient-${index}`}>
												<Ingredient {...ingredient} />
											</li>
										))}
									</ul>
								)}

								{isRecommendedRecipes(recipe) && recipe.suggestions.length > 0 && (
									<ul className="space-y-3">
										{recipe.suggestions.map(({ title, matchScore, missing, why }, index) => (
											<li key={`suggestion-${index}`}>
												<article className="card__material space-y-2">
													<h3 className="mb-4 font-medium">{title}</h3>
													<p>
														<span>Match Score: {matchScore}</span>
														{missing && <span className="text-sm"> (Missing: {missing.join(", ")})</span>}
													</p>
													{why && <p className="text-sm">Why: {why}</p>}
												</article>
											</li>
										))}
									</ul>
								)}
							</>
						)}

						{viewMode === "json" && (
							<MarkdownWrapper>{["```json", JSON.stringify(recipe, null, 2), "```"].join("\n")}</MarkdownWrapper>
						)}
					</article>
				)}
			</div>
		</div>
	);
};

export default RecipeView;
