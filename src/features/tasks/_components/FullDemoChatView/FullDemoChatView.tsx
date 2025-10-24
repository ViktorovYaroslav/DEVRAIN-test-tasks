import { Fragment, useMemo, useRef, useEffect } from "react";

import clsx from "clsx";
import { v1 } from "uuid";

import { UserMessage, AssistantMessage } from "./components";

import { useChat } from "@/context/chat/hooks";
import type { FullDemoChatResponse, FullDemoMessage } from "@/types/query/full-demo/types";

import type { FC } from "react";

const FullDemoChatView: FC = () => {
	const {
		query: { data: history },
	} = useChat();

	const parsedHistory = useMemo(() => {
		return (history ?? []).map((message) => message as FullDemoMessage);
	}, [history]);

	const parseAssistantContent = (raw: string): FullDemoChatResponse => {
		try {
			const parsed = JSON.parse(raw) as FullDemoChatResponse;
			if (parsed && typeof parsed === "object" && "response_type" in parsed) {
				return parsed;
			}
		} catch {
			// Swallow parsing errors and fall back to markdown rendering
		}
		return {
			response_type: "markdown",
			data: raw,
		};
	};

	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		const content = contentRef.current;
		if (!container || !content) return;

		const observer = new ResizeObserver(() => {
			container.scrollTop = container.scrollHeight;
		});

		observer.observe(content);

		return () => observer.disconnect();
	}, []);

	return (
		<div
			className={clsx("relative min-h-0 w-full max-w-3xl opacity-0 transition-all duration-400 ease-out", {
				"min-h-0 shrink grow opacity-100": parsedHistory.length > 0,
			})}
		>
			<div ref={containerRef} className="h-full min-h-0 overflow-auto scroll-smooth">
				<div ref={contentRef} className="flex flex-col gap-16">
					{parsedHistory.map((message) => {
						const key = v1();
						if (message.role === "user") {
							return (
								<Fragment key={key}>
									<UserMessage content={message.content} images={message.images} />
								</Fragment>
							);
						}
						const assistantContent = parseAssistantContent(message.content);
						return (
							<Fragment key={key}>
								<AssistantMessage content={assistantContent} />
							</Fragment>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default FullDemoChatView;
