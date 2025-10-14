import { useState } from "react";

import Markdown from "react-markdown";
import type { Components } from "react-markdown";
import type { ComponentProps } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/buttons";
import { Modal } from "@/components/ui/dialogs";

import { Task02Summary } from "./task02Summary";

import type { FC } from "react";

type CodePropsLite = ComponentProps<"code"> & { inline?: boolean; node?: unknown };

const markdownComponents: Components = {
	code: ({ inline, className, children, ...props }: CodePropsLite) => {
		const match = /language-(\w+)/.exec(className || "");
		const codeText = String(children ?? "").replace(/\n$/, "");
		if (!inline && match) {
			return (
				<SyntaxHighlighter
					PreTag="div"
					language={match[1].toLowerCase()}
					style={vscDarkPlus}
					wrapLongLines
					customStyle={{ margin: 0, borderRadius: 12 }}
				>
					{codeText}
				</SyntaxHighlighter>
			);
		}
		return (
			<code className={className} {...props}>
				{children}
			</code>
		);
	},
};

export const TaskSummary: FC = () => {
	const [isOpen, setIsOpen] = useState(!false);

	return (
		<>
			<Button onClick={() => setIsOpen(true)} variant="secondary">
				Task Summary
			</Button>

			<Modal isOpen={isOpen} close={() => setIsOpen(false)}>
				<div className="content">
					<Markdown components={markdownComponents}>{Task02Summary}</Markdown>
				</div>
			</Modal>
		</>
	);
};

export default TaskSummary;
