import { toast } from "react-toastify";

import type { FullDemoChatResponse } from "@/types/query/full-demo/types";

const parseAssistantContent = (raw: string): FullDemoChatResponse => {
	try {
		const parsed = JSON.parse(raw) as FullDemoChatResponse;
		if (parsed && typeof parsed === "object" && "response_type" in parsed) {
			return parsed;
		}
	} catch {
		toast.error("Failed to parse assistant message content. Displaying as markdown.");
	}
	return {
		response_type: "markdown",
		data: raw,
	};
};

export default parseAssistantContent;
