import { DocumentIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import type { FC, InputHTMLAttributes } from "react";
import type { HeroIcon } from "@/types/elements/heroicons";
import type { ClassValue } from "clsx";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
	label: string;

	Icon?: HeroIcon;
	className?: ClassValue;
}

const FileInput: FC<Props> = (props) => {
	const { id, className, label, ...rest } = props;

	const Icon = props.Icon || DocumentIcon;

	return (
		<label
			htmlFor={id}
			className={clsx(
				"flex cursor-pointer items-center justify-center rounded-md p-2 text-center hover:text-primary-600",
				className
			)}
		>
			<input type="file" hidden id={id} {...rest} />
			<Icon className="size-5" aria-hidden="true" />
			<span className="sr-only">{label}</span>
		</label>
	);
};

export default FileInput;
