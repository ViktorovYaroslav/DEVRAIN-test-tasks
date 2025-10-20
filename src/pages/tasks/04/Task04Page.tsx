import { ChatForm, TaskSummary } from "@/features/tasks/03";

import type { FC } from "react";

const Task04Page: FC = () => {
	return (
		<>
			<ChatForm />
			<div className="fixed top-4 right-4 flex w-full max-w-xs flex-col gap-4">
				<TaskSummary />
			</div>
		</>
	);
};

export default Task04Page;
