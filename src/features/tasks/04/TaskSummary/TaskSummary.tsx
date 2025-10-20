import { useState, lazy } from "react";

import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/buttons";
import { Modal } from "@/components/ui/dialogs";

import { SUMMARY } from "./summary";

import type { FC } from "react";

const MarkdownWrapper = lazy(() => import("@/components/ui/content/MarkdownWrapper/MarkdownWrapper"));

export const TaskSummary: FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsOpen(true)} className="ml-auto w-fit" variant="secondary">
				<ClipboardDocumentCheckIcon className="size-5" aria-hidden="true" />
				<span>Task Summary</span>
			</Button>

			<Modal isOpen={isOpen} close={() => setIsOpen(false)}>
				<div className="markdown-wrapper">
					<MarkdownWrapper>{SUMMARY}</MarkdownWrapper>
				</div>
			</Modal>
		</>
	);
};

export default TaskSummary;
