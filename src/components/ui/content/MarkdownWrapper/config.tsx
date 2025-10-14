import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import type { Components } from "react-markdown";
import type { ComponentProps } from "react";

type CodePropsLite = ComponentProps<"code"> & { inline?: boolean; node?: unknown };

export const config: Components = {
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
