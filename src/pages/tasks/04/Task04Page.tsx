import { ChatForm, TaskSummary } from "@/features/tasks/04";
import { ChatView } from "@/features/tasks/_components";

import { ChatProvider } from "@/context/chat";

import type { FC } from "react";

const Task04Page: FC = () => {
	return (
		<ChatProvider chatId="task-04-chat">
			<ChatView />
			<ChatForm />
			<div className="!w-fit fixed top-4 right-4 flex max-w-xs flex-col gap-4">
				<TaskSummary />
			</div>
		</ChatProvider>
	);
};

export default Task04Page;
