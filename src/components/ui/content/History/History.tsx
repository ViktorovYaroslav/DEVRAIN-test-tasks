import { useState } from "react";

import { ListBulletIcon } from "@heroicons/react/24/outline";

import { Button } from "../../buttons";
import { SidePanel } from "@/components/ui/dialogs";
import { HistoryItem } from "./components";

import { useRecipes } from "@/context/recipe/hooks";

import type { FC } from "react";

const History: FC = () => {
	const {
		query: { data: recipes },
	} = useRecipes();

	const [isHistoryOpen, setIsHistoryOpen] = useState(false);

	const isRecipeAvailable = (recipes?.length ?? 0) > 1;

	if (!isRecipeAvailable) return null;

	return (
		<>
			<Button className="!size-fit pr-0" variant="icon" square type="button" onClick={() => setIsHistoryOpen(true)}>
				<ListBulletIcon className="size-6" aria-hidden="true" />
				<span className="sr-only">Open history</span>
			</Button>

			<SidePanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} direction="right">
				<ul className="flex flex-col-reverse gap-0.5">
					{recipes?.map((recipe, index) => (
						<li key={`history-item-${index}`}>
							<HistoryItem currentIndex={index} recipe={recipe} />
						</li>
					))}
				</ul>
			</SidePanel>
		</>
	);
};

export default History;
