import { ChatForm, TaskSummary } from "@/features/tasks/03";
import { RecipeView } from "@/features/tasks/_components";
import { History } from "@/components/ui/content";
import { RecipeProvider } from "@/context/recipe";

import type { FC } from "react";

const Task03Page: FC = () => {
	return (
		<RecipeProvider task="03">
			<RecipeView />
			<ChatForm />
			<div className="!w-fit fixed top-4 right-4 flex max-w-xs items-center gap-4 md:flex-col md:items-start">
				<TaskSummary />
				<History />
			</div>
		</RecipeProvider>
	);
};

export default Task03Page;
