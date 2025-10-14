import { ChatForm, RecipeView, History } from "@/features/tasks/02";
import { RecipeProvider } from "@/features/tasks/02/context/activeRecipeIndex";

import type { FC } from "react";

const Task02Page: FC = () => {
	return (
		<div className="relative flex size-full flex-col items-center justify-center">
			<RecipeProvider>
				<RecipeView />
				<ChatForm />
				<History />
			</RecipeProvider>
		</div>
	);
};

export default Task02Page;
