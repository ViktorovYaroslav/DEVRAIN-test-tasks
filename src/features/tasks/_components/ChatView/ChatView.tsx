import { Fragment, useRef, useEffect } from "react";

import clsx from "clsx";
import { v1 } from "uuid";

import { UserMessage, AssistantMessage } from "./components";

import { useChat } from "@/context/chat/hooks";

import type { FC } from "react";

export const ChatView: FC = () => {
	const {
		query: { data: history },
	} = useChat();

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [history]);

	return (
		<div
			className={clsx("relative min-h-0 w-full max-w-3xl opacity-0 transition-all duration-400 ease-out", {
				"min-h-0 shrink grow opacity-100": history && history.length > 0,
			})}
		>
			<div ref={containerRef} className="h-full min-h-0 overflow-auto scroll-smooth">
				<div className="flex flex-col gap-16">
					{history?.map(({ content, role }) => (
						<Fragment key={v1()}>
							{role === "user" && <UserMessage content={content} />}
							{role === "assistant" && <AssistantMessage content={JSON.parse(content)} />}
						</Fragment>
					))}
				</div>
			</div>
		</div>
	);
};

export default ChatView;
