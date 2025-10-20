import { createContext, useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { FC, PropsWithChildren } from "react";
import type { Message } from "@/types/query/tasks/response";
import type { ChatContextType } from "./types";
import type { UseQueryResult } from "@tanstack/react-query";

export const ChatContext = createContext<ChatContextType>({
	query: {} as UseQueryResult<Message[]>,
	isSending: false,
	setIsSending: () => {},
	appendMessage: () => {},
	replaceHistory: () => {},
	resetHistory: () => {},
});

interface Props extends PropsWithChildren {
	chatId: string;
	initialHistory?: Message[];
}

const ChatProvider: FC<Props> = ({ children, chatId, initialHistory }) => {
	const [isSending, setIsSending] = useState(false);
	const queryKey = useMemo(() => ["chat", chatId], [chatId]);

	const query = useQuery<Message[]>({
		queryKey,
		queryFn: async () => initialHistory ?? [],
		enabled: false,
		initialData: initialHistory ?? [],
	});

	const queryClient = useQueryClient();

	const appendMessage = useCallback(
		(message: Message) => {
			queryClient.setQueryData<Message[]>(queryKey, (prev) => (prev ? [...prev, message] : [message]));
		},
		[queryClient, queryKey]
	);

	const replaceHistory = useCallback(
		(messages: Message[]) => {
			queryClient.setQueryData<Message[]>(queryKey, messages);
		},
		[queryClient, queryKey]
	);

	const resetHistory = useCallback(() => {
		queryClient.setQueryData<Message[]>(queryKey, []);
	}, [queryClient, queryKey]);

	const value = useMemo(
		() => ({
			query,
			isSending,
			setIsSending,
			appendMessage,
			replaceHistory,
			resetHistory,
		}),
		[history, query, isSending, setIsSending, appendMessage, replaceHistory, resetHistory]
	);

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
