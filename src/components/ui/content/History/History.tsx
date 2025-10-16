import { Transition } from "@headlessui/react";

import { HistoryItem } from "./components";

import { useRecipes } from "@/context/activeRecipeIndex/hooks";

import type { FC } from "react";

const History: FC = () => {
	const {
		query: { data: recipes },
	} = useRecipes();

	return (
		<Transition
			show={(recipes?.length ?? 0) > 1}
			enter="transition-opacity duration-400 ease-out"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-400 ease-out"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div className="card__material">
				<ul className="flex flex-col-reverse gap-0.5">
					{recipes?.map((recipe, index) => (
						<li key={`history-item-${index}`}>
							<HistoryItem currentIndex={index} recipe={recipe} />
						</li>
					))}
				</ul>
			</div>
		</Transition>
	);
};

export default History;
