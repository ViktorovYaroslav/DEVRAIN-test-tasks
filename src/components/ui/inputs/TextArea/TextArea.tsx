import { isValidElement, useRef, useState } from "react";

import { clsx } from "clsx";
import TextareaAutosize from "react-textarea-autosize";

import type { ClassValue } from "clsx";
import type { FC, ReactElement } from "react";
import type { TextareaAutosizeProps } from "react-textarea-autosize";

interface Props extends Omit<TextareaAutosizeProps, "className" | "style"> {
	id: string;
	label: string;
	hiddenLabel?: boolean;
	className?: ClassValue;
	error?: string | ReactElement;
	extraLink?: ReactElement;
}

const TextArea: FC<Props> = (props) => {
	const { id, label, hiddenLabel = false, className, error, extraLink, rows = 4, ...rest } = props;

	const [focused, setFocused] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const hasValue = !!textareaRef.current?.value || (typeof rest.value === "string" && rest.value.length > 0);

	return (
		<div>
			<div className="relative h-fit">
				<label
					htmlFor={id}
					className={clsx("mb-1 pl-2 font-medium text-gray-900 text-sm transition-all duration-200 ease-out", {
						"sr-only": hiddenLabel,
					})}
				>
					{label}
				</label>

				{(extraLink || rest.maxLength) && (
					<div className="!top-0 !-translate-y-3.5 absolute right-0 flex items-center">
						{extraLink}
						{(focused || textareaRef.current?.value) && rest.maxLength && (
							<span className="text-gray-600 text-xs">
								{textareaRef.current?.value.length || 0}/{rest.maxLength}
							</span>
						)}
					</div>
				)}

				<TextareaAutosize
					id={id}
					ref={textareaRef}
					rows={rows}
					{...rest}
					className={clsx(
						"block w-full px-2 py-1.5 text-gray-900 text-sm transition-all duration-200 ease-in-out placeholder:text-gray-400 focus:border-primary-600 focus:outline-none",
						className
					)}
					onFocus={(e) => {
						setFocused(true);

						if (rest.onFocus) {
							rest.onFocus(e);
						}
					}}
					onBlur={(e) => {
						setFocused(false);

						if (rest.onBlur) {
							rest.onBlur(e);
						}
					}}
				/>
			</div>

			{error && (
				<div className="mt-2 ml-2" id={`${id}-error`}>
					{typeof error === "string" ? (
						<p className="font-medium text-red-600 text-xs">{error}</p>
					) : (
						isValidElement(error) &&
						(focused || hasValue) && <div className="font-medium text-red-600 text-xs">{error}</div>
					)}
				</div>
			)}
		</div>
	);
};

export default TextArea;
