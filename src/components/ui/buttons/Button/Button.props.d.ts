import type { SpinnerProps } from "@/components/ui/loaders/Spinner";
import type { ClassValue } from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import type { PropsWithChildren } from "react";
import type { Link as RouterLink } from "react-router";

interface StyleOptions {
	variant?: "primary" | "secondary" | "danger" | "icon" | "link";
	size?: "sm" | "md" | "lg";
	square?: boolean;
}

export interface CommonProps extends StyleOptions, PropsWithChildren {
	className?: ClassValue;
}

type ButtonOnlyProps = {
	loading?: boolean;
	loadingText?: string;
	spinnerProps?: SpinnerProps;
};

type NativeButtonProps = ComponentPropsWithoutRef<"button"> & CommonProps & ButtonOnlyProps;
type RouterLinkOwnProps = ComponentPropsWithoutRef<typeof RouterLink> & CommonProps;

export type ButtonVariantProps = { as?: "button" } & NativeButtonProps;
export type LinkVariantProps = { as: "Link" } & RouterLinkOwnProps;
