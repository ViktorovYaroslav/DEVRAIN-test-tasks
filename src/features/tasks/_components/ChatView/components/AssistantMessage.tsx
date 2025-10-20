import { useState } from "react";

import { ViewMode } from "../../ViewMode";
import { Steps } from "@/components/ui/lists";
import { Ingredient, MarkdownWrapper } from "@/components/ui/content";

import { isRecipeIngredients, isRecipeInstruction, isRecommendedRecipes } from "@/types/query/tasks/guards";
import { VIEW_MODES } from "../../ViewMode/constants/modes";

import type { FC } from "react";
import type { RecipeItem } from "@/types/query/tasks/response";

interface Props {
	content: RecipeItem;
}

const AssistantMessage: FC<Props> = ({ content }) => {
	const [viewMode, setViewMode] = useState(VIEW_MODES[0].option);

	const isInstruction = isRecipeInstruction(content);
	const isIngredients = isRecipeIngredients(content);
	const isRecommended = isRecommendedRecipes(content);

	return (
		<>
			{content && (
				<article className="space-y-8">
					<header className="flex items-center justify-between gap-4">
						<h2 className="font-medium text-xl first-letter:uppercase">
							{"title" in content ? content.title : "Recommendations"}
						</h2>
						<div className="flex-1" />
						<ViewMode onChange={setViewMode} />
					</header>

					{viewMode === "formatted" && (
						<>
							{isInstruction && <p>{content.recipe}</p>}

							{isInstruction && content.notes.length > 0 && (
								<ul className="list-inside list-disc">
									{content.notes.map((note, index) => (
										<li key={index}>{note}</li>
									))}
								</ul>
							)}

							{isInstruction && content.steps.length > 0 && (
								<Steps steps={content.steps.map((step, index) => <p key={index}>{step}</p>)} />
							)}

							{isIngredients && content.ingredients.length > 0 && (
								<ul className="flex flex-wrap gap-2">
									{content.ingredients.map((ingredient, index) => (
										<li key={`ingredient-${index}`}>
											<Ingredient {...ingredient} />
										</li>
									))}
								</ul>
							)}

							{isRecommended && content.suggestions.length > 0 && (
								<ul className="space-y-3">
									{content.suggestions.map(({ title, matchScore, missing, why }, index) => (
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
						<MarkdownWrapper>{["```json", JSON.stringify(content, null, 2), "```"].join("\n")}</MarkdownWrapper>
					)}
				</article>
			)}
		</>
	);
};

export default AssistantMessage;
