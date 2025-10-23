export interface FullDemoImage {
	data: string;
	mediaType: string;
}

export interface FullDemoUserMessage {
	role: "user";
	content: string;
	images?: FullDemoImage[];
}

export interface FullDemoAssistantMessage {
	role: "assistant";
	content: string;
}

export type FullDemoMessage = FullDemoUserMessage | FullDemoAssistantMessage;
