import type { FullDemoMessage, FullDemoUserMessage } from "./types";

export const isFullDemoUserMessage = (message: FullDemoMessage): message is FullDemoUserMessage => {
	return message.role === "user";
};
