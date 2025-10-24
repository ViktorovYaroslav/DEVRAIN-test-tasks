import { useState } from "react";

import { ViewMode } from "../../ViewMode";
import { Steps } from "@/components/ui/lists";
import { Ingredient, MarkdownWrapper } from "@/components/ui/content";

import { VIEW_MODES } from "../../ViewMode/constants/modes";

import type { FC } from "react";
import type { FullDemoChatResponse } from "@/types/query/full-demo/types";

interface Props {
	content: FullDemoChatResponse;
}

const AssistantMessage: FC<Props> = ({ content }) => {
	const [viewMode, setViewMode] = useState(VIEW_MODES[0].option);

	const isRecipe = content.response_type === "recipe";
	const isRecommendations = content.response_type === "recommendations";
	const isMarkdown = content.response_type === "markdown";

	return (
		<>
			{content && (
				<article className="space-y-8">
					<div className="flex items-center justify-between gap-4">
						{!isMarkdown && (
							<h2 className="font-medium text-xl first-letter:uppercase">
								{isRecipe && content.data.title}
								{isRecommendations && "Recommendations"}
							</h2>
						)}

						<div className="flex-1" />

						<ViewMode onChange={setViewMode} />
					</div>

					{viewMode === "formatted" && (
						<>
							{isRecipe && content.data.summary && <p>{content.data.summary}</p>}

							{isRecipe && content.data.notes.length > 0 && (
								<ul className="list-inside list-disc">
									{content.data.notes.map((note, index) => (
										<li key={index}>{note}</li>
									))}
								</ul>
							)}

							{isRecipe && content.data.steps.length > 0 && (
								<Steps steps={content.data.steps.map((step, index) => <p key={index}>{step}</p>)} />
							)}

							{isRecipe && content.data.ingredients.length > 0 && (
								<ul className="flex flex-wrap gap-2">
									{content.data.ingredients.map((ingredient, index) => (
										<li key={`ingredient-${index}`}>
											<Ingredient {...ingredient} />
										</li>
									))}
								</ul>
							)}

							{isRecommendations && content.data.items.length > 0 && (
								<ul className="space-y-3">
									{content.data.items.map(({ title, matchScore, missing, why }, index) => (
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

							{isMarkdown && <MarkdownWrapper>{content.data}</MarkdownWrapper>}
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
