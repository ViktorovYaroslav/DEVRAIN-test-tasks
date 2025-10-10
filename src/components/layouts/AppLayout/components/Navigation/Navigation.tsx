import { NavigationLink, NavigationHeading } from "./components";

import { NAVIGATION_ITEMS } from "./constants/navigation";

import type { FC } from "react";

const Navigation: FC = () => {
	return (
		<nav>
			<ul className="space-y-0.5">
				{NAVIGATION_ITEMS.map((item, index) => (
					<li key={index}>
						{item.type === "link" && <NavigationLink {...item} />}
						{item.type === "heading" && <NavigationHeading {...item} />}
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Navigation;
