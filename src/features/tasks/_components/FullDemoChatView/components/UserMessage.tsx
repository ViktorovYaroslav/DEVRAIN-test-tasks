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
			{images && images.length > 0 && (
				<ul className="-mx-3 -mt-3 flex flex-wrap gap-0.5 overflow-hidden rounded-xl">
					{images.map(({ data, mediaType }, index) => (
						<li key={`user-image-${index}`} className="overflow-hidden bg-gray-50/80">
							<img
								src={`data:${mediaType};base64,${data}`}
								alt={`user upload ${index + 1}`}
								className="max-h-24 w-auto object-cover"
							/>
						</li>
					))}
				</ul>
			)}

			{content && <MarkdownWrapper>{content}</MarkdownWrapper>}
		</article>
	);
};

export default UserMessage;
