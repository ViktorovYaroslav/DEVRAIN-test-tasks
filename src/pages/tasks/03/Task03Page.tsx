import { ChatForm, RecipeView, TaskSummary } from "@/features/tasks/03";
import { History } from "@/components/ui/content";
import { RecipeProvider } from "@/context/activeRecipeIndex";

import type { FC } from "react";

const Task03Page: FC = () => {
	return (
		<div className="relative flex size-full flex-col items-center justify-center">
			<RecipeProvider>
				<RecipeView />
				<ChatForm />
				<div className="fixed top-4 right-4 flex w-full max-w-xs flex-col gap-4">
					<TaskSummary />
					<History />
				</div>
			</RecipeProvider>
		</div>
	);
};

export default Task03Page;
