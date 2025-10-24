import clsx from "clsx";

import { MarkdownWrapper } from "@/components/ui/content";

import type { FC } from "react";
import type { FullDemoImage } from "@/types/query/full-demo/types";

interface Props {
	content: string;
	images?: FullDemoImage[];
}

const UserMessage: FC<Props> = ({ content, images }) => {
	return (
		<article className="card__material ml-auto flex max-w-1/2 flex-col gap-3">
			{content && <MarkdownWrapper>{content}</MarkdownWrapper>}
			{images && images.length > 0 && (
				<ul className="flex flex-wrap justify-end gap-2">
					{images.map(({ data, mediaType }, index) => (
						<li key={`user-image-${index}`} className="shadow-sm">
							<img
								src={`data:${mediaType};base64,${data}`}
								alt={`user upload ${index + 1}`}
								className={clsx("max-h-36 rounded-md border border-white/20 object-cover", {
									"w-36": !mediaType.startsWith("image/svg"),
								})}
							/>
						</li>
					))}
				</ul>
			)}
		</article>
	);
};

export default UserMessage;
