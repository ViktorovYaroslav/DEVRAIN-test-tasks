import { ChatForm, RecipeView } from "@/features/tasks/02";

import type { FC } from "react";

const Task02Page: FC = () => {
	return (
		<div className="flex size-full flex-col items-center justify-center">
			<RecipeView />
			<ChatForm />
		</div>
	);
};

export default Task02Page;
