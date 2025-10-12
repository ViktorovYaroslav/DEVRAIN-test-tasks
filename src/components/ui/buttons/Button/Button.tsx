import { Link as RouterLink } from "react-router";

import { Spinner } from "@/components/ui/loaders";

import { getClasses } from "./helpers/getClasses";

import type { FC } from "react";
import type { ButtonVariantProps, LinkVariantProps } from "./Button.props";

const Button: FC<ButtonVariantProps | LinkVariantProps> = ({
	as = "button",
	variant = "primary",
	size = "md",
	square = false,
	...props
}) => {
	if (as === "button") {
		const {
			className,
			children,
			loading,
			loadingText = "Loading...",
			spinnerProps,
			type = "button",
			...restButton
		} = props as ButtonVariantProps;

		return (
			<button type={type} className={getClasses({ variant, size, square }, className)} {...restButton}>
				{loading ? (
					<span className="flex items-center gap-2">
						<Spinner variant="secondary" size="sm" {...spinnerProps} />
						{variant !== "icon" && loadingText}
					</span>
				) : (
					children
				)}
			</button>
		);
	}

	if (as === "Link") {
		const { className, children, ...linkRest } = props as LinkVariantProps;

		return (
			<RouterLink className={getClasses({ variant, size, square }, className)} {...linkRest}>
				{children}
			</RouterLink>
		);
	}

	return <></>;
};

export default Button;
