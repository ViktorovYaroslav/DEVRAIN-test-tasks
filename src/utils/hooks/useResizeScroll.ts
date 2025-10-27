import { useEffect, useRef } from "react";

import type { RefObject } from "react";

export const useResizeScroll = (
	containerRef: RefObject<HTMLElement | null>,
	contentRef: RefObject<HTMLElement | null>,
	history: Array<unknown>
) => {
	const lastHeightRef = useRef<number>(0);
	const lastMessageCountRef = useRef<number>(0);

	useEffect(() => {
		const container = containerRef.current;
		const content = contentRef.current;
		if (!container || !content) return;

		const scrollToBottom = () => {
			container.scrollTop = container.scrollHeight;
		};

		const observer = new ResizeObserver(() => {
			const currentHeight = content.getBoundingClientRect().height;
			const previousHeight = lastHeightRef.current;
			const previousCount = lastMessageCountRef.current;
			const currentCount = history?.length ?? 0;

			lastHeightRef.current = currentHeight;
			lastMessageCountRef.current = currentCount;

			const isNewMessage = currentCount > previousCount;
			if (isNewMessage) {
				scrollToBottom();
				return;
			}

			const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 48;
			const heightGrew = currentHeight > previousHeight;
			if (heightGrew && isNearBottom) {
				scrollToBottom();
			}
		});

		observer.observe(content);

		return () => observer.disconnect();
	}, [history?.length]);
};
