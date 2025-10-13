import type { KeyboardEvent } from "react";

export const sendOnEnter = (e: KeyboardEvent<HTMLFormElement>) => {
	if (e.key !== "Enter") return;
	if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;

	const target = e.target as HTMLElement;

	if (target.tagName !== "TEXTAREA") return;

	e.preventDefault();
	e.currentTarget.requestSubmit();
};
