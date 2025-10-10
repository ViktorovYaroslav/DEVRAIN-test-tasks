import type { FC } from "react";
import type { NavigationHeading as NavigationHeadingProps } from "../Navigation.props";

const NavigationHeading: FC<NavigationHeadingProps> = ({ label }) => {
	return (
		<div className="!flex items-center gap-4 py-2 font-medium text-xs">
			<span>{label}</span>
			<div className="h-px flex-1 bg-gray-100" />
		</div>
	);
};

export default NavigationHeading;
