import { ChatForm, TaskSummary } from "@/features/tasks/02";
import { RecipeView } from "@/features/tasks/_components";
import { History } from "@/components/ui/content";
import { RecipeProvider } from "@/context/recipe";

import type { FC } from "react";

const Task02Page: FC = () => {
	return (
		<RecipeProvider task="02">
			<RecipeView />
			<ChatForm />
			<div className="fixed top-4 right-4 flex w-full max-w-xs flex-col gap-4">
				<TaskSummary />
				<History />
			</div>
		</RecipeProvider>
	);
};

export default Task02Page;
