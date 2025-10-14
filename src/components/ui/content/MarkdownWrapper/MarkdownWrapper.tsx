import Markdown from "react-markdown";

import { config } from "./config";

import type { FC } from "react";

interface Props {
	children: string;
}

const MarkdownWrapper: FC<Props> = ({ children }) => {
	return <Markdown components={config}>{children}</Markdown>;
};

export default MarkdownWrapper;
