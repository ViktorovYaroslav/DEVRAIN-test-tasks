import { Suspense } from "react";

import Markdown from "react-markdown";

import { Spinner } from "../../loaders";

import { config } from "./config";

import type { FC } from "react";

interface Props {
	children: string;
}

const MarkdownWrapper: FC<Props> = ({ children }) => {
	return (
		<Suspense fallback={<Spinner />}>
			<div className="markdown-wrapper">
				<Markdown components={config}>{children}</Markdown>
			</div>
		</Suspense>
	);
};

export default MarkdownWrapper;
