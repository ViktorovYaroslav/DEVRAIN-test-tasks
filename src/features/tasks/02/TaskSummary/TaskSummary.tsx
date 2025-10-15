import { useState } from "react";

import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { MarkdownWrapper } from "@/components/ui/content";

import { Button } from "@/components/ui/buttons";
import { Modal } from "@/components/ui/dialogs";

import { Task02Summary } from "./task02Summary";

import type { FC } from "react";

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
					<MarkdownWrapper>{Task02Summary}</MarkdownWrapper>
				</div>
			</Modal>
		</>
	);
};

export default TaskSummary;
