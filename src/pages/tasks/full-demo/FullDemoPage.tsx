import { ChatForm } from "@/features/tasks/full-demo";
import { FullDemoChatView } from "@/features/tasks/_components";

import { ChatProvider } from "@/context/chat";

import type { FC } from "react";

const FullDemoPage: FC = () => {
	return (
		<ChatProvider chatId="full-demo-chat">
			<FullDemoChatView />
			<ChatForm />
		</ChatProvider>
	);
};

export default FullDemoPage;
