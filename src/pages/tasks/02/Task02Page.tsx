import { ChatForm, TaskSummary } from "@/features/tasks/02";
import { RecipeView } from "@/features/tasks/_components";
import { History } from "@/components/ui/content";
import { RecipeProvider } from "@/context/activeRecipeIndex";

import type { FC } from "react";

const Task02Page: FC = () => {
	return (
		<div className="relative flex size-full flex-col items-center justify-end gap-4">
			<RecipeProvider task="02">
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

export default Task02Page;
