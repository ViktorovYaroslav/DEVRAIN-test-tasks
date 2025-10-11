import { Link, useLocation } from "react-router";

import clsx from "clsx";

import type { FC } from "react";
import type { NavigationLink as NavigationLinkProps } from "../Navigation.props";

const NavigationLink: FC<NavigationLinkProps> = ({ to, label, Icon, ...props }) => {
	const { pathname } = useLocation();

	const isCurrentPath = pathname === to;

	return (
		<Link
			to={to}
			{...props}
			className={clsx(
				"!flex group items-center gap-2 rounded-md px-3 py-2 font-medium uppercase hover:bg-primary-50 hover:text-primary-600",
				{
					"bg-primary-50 text-gray-900/70": isCurrentPath,
				}
			)}
		>
			{Icon && (
				<Icon
					className={clsx("group-hover:!text-primary-600 size-5", {
						"!text-primary-600": isCurrentPath,
					})}
				/>
			)}
			<span>{label}</span>
		</Link>
	);
};

export default NavigationLink;
