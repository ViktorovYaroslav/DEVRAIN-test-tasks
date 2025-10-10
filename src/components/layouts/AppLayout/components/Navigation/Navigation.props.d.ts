import type { HeroIcon } from "@/types/elements/heroicons";
import type { LinkProps } from "react-router";

export interface NavigationLink extends LinkProps {
	type: "link";
	label: string;
	to: string;
	Icon?: HeroIcon;
}

export interface NavigationHeading {
	type: "heading";
	label: string;
}

export type NavigationItem = NavigationLink | NavigationHeading;
