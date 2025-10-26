import { File as FilePreview } from "./components";

import type { FC } from "react";

interface Props {
	files: File[];
	onRemove?: (index: number) => void;
}

const FilesList: FC<Props> = ({ files, onRemove }) => {
	return (
		<ul className="flex gap-2 overflow-x-auto py-1">
			{files.map((file, index) => (
				<li key={index} className="relative shrink-0">
					<FilePreview file={file} index={index} onRemove={onRemove} />
				</li>
			))}
		</ul>
	);
};

export default FilesList;
