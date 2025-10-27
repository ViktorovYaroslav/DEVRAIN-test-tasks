import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/buttons";
import { Spinner } from "@/components/ui/loaders";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { setToBase64Storage, getFromBase64Storage } from "@/utils/helpers/files/base64Storage";

import type { FC } from "react";

interface Props {
	file: File;
	index: number;
	onRemove?: (index: number) => void;
}

const File: FC<Props> = ({ file, index, onRemove }) => {
	const [data, setData] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const fetchData = async () => {
			await setToBase64Storage(file);
			if (!active) return;

			const base64Data = getFromBase64Storage(file);
			setData(base64Data ?? null);
		};

		fetchData();

		return () => {
			active = false;
		};
	}, [file]);

	const handleRemove = () => {
		onRemove?.(index);
	};

	const previewSrc = useMemo(() => {
		if (!data) {
			return null;
		}

		return `data:${file.type || "application/octet-stream"};base64,${data}`;
	}, [data, file.type]);

	return (
		<div className="relative h-12 w-auto">
			{previewSrc ? (
				<img src={previewSrc} alt={file.name} className="size-full rounded-md object-cover" />
			) : (
				<div className="flex size-12 items-center justify-center">
					<Spinner />
				</div>
			)}

			<Button
				type="button"
				className="!absolute -right-1 -top-1 !h-5 !w-5 !rounded-full !p-0"
				size="sm"
				variant="secondary"
				square
				onClick={handleRemove}
			>
				<XMarkIcon className="size-3" />
			</Button>
		</div>
	);
};

export default File;
