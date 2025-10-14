import { clsx } from "clsx";

import type { CommonProps, StyleOptions } from "../Button.props";

type Options = {
	isLink?: boolean;
} & StyleOptions;

type GetClasses = (options: Options, className?: CommonProps["className"]) => string;

export const getClasses: GetClasses = (options, className?: CommonProps["className"]) => {
	const { variant, size, square, isLink }: Options = {
		variant: "primary",
		size: "md",
		square: false,
		...options,
	};

	return clsx(
		"relative !inline-flex items-center justify-center gap-2",
		"rounded-md border-none",
		"text-base font-medium",
		"transition duration-200 ease-in-out cursor-pointer",
		"focus:outline-offset-4 focus:outline-primary-600 dark:focus:outline-primary-300",
		"disabled:opacity-50 disabled:cursor-default",
		{
			"aspect-square": square,
			"py-1 px-2": size === "sm" && !square,
			"py-1.5 px-4": size === "md" && !square,
			"py-3 px-6": size === "lg" && !square,
			"p-1": size === "sm" && square,
			"p-2": size === "md" && square,
			"p-3": size === "lg" && square,
			"!p-0": variant === "link",
		},
		{
			"bg-primary-700 text-white enabled:hover:bg-primary-800": variant === "primary",
			"bg-primary-700 text-white hover:bg-primary-800 ": variant === "primary" && isLink,

			"bg-white enabled:hover:bg-primary-50 enabled:hover:text-primary-600 text-gray-900 ring ring-inset ring-gray-100":
				variant === "secondary",
			"bg-white hover:bg-primary-50 hover:text-primary-600 text-gray-900 ring ring-inset ring-gray-100":
				variant === "secondary" && isLink,

			"bg-transparent text-gray-500 enabled:hover:text-gray-700": variant === "icon",
			"bg-transparent text-gray-500 hover:text-gray-700": variant === "icon" && isLink,

			"bg-red-700 text-white enabled:hover:bg-red-800 focus:outline-red-700 dark:focus:outline-red-300":
				variant === "danger",
			"bg-red-700 text-white hover:bg-red-800 focus:outline-red-700 dark:focus:outline-red-300":
				variant === "danger" && isLink,

			"font-semibold text-primary-600 enabled:hover:text-primary-800": variant === "link",
			"font-semibold text-primary-600 hover:text-primary-800": variant === "link" && isLink,
		},
		className
	);
};
