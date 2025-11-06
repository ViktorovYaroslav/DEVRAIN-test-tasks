import { useEffect, useRef } from "react";

import type { RefObject } from "react";

export const useResizeScroll = (
	containerRef: RefObject<HTMLElement | null>,
	contentRef: RefObject<HTMLElement | null>,
	history: Array<unknown>
) => {
	const lastHeightRef = useRef<number>(0);
	const lastMessageCountRef = useRef<number>(0);
	const shouldStickToBottomRef = useRef<boolean>(false);

	useEffect(() => {
		const container = containerRef.current;
		const content = contentRef.current;
		if (!container || !content) return;

		const scrollToBottom = () => {
			container.scrollTop = container.scrollHeight;
		};

		const handleScroll = () => {
			const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 48;
			shouldStickToBottomRef.current = isNearBottom;
		};

		container.addEventListener("scroll", handleScroll);

		const observer = new ResizeObserver(() => {
			const currentHeight = content.getBoundingClientRect().height;
			const previousHeight = lastHeightRef.current;
			const previousCount = lastMessageCountRef.current;
			const currentCount = history?.length ?? 0;
			const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 48;

			lastHeightRef.current = currentHeight;
			lastMessageCountRef.current = currentCount;

			const isNewMessage = currentCount > previousCount;
			if (isNewMessage) {
				shouldStickToBottomRef.current = true;
				scrollToBottom();
				return;
			}

			const heightGrew = currentHeight > previousHeight;
			if (heightGrew && shouldStickToBottomRef.current) {
				scrollToBottom();
				shouldStickToBottomRef.current = false;
				return;
			}

			if (heightGrew && isNearBottom) {
				scrollToBottom();
			}
		});

		observer.observe(content);

		return () => {
			container.removeEventListener("scroll", handleScroll);
			observer.disconnect();
		};
	}, [history?.length]);
};
