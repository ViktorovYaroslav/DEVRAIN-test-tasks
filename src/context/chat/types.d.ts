import type { Dispatch, SetStateAction } from "react";
import type { UseQueryResult } from "@tanstack/react-query";

import type { Message } from "@/types/query/tasks/response";

export interface ChatContextType {
	history: Message[];
	query: UseQueryResult<Message[]>;
	isSending: boolean;
	setIsSending: Dispatch<SetStateAction<boolean>>;
	appendMessage: (message: Message) => void;
	replaceHistory: (messages: Message[]) => void;
	resetHistory: () => void;
}
