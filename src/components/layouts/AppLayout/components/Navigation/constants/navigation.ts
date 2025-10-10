import { TASKS_PATH, TASK_02_PATH, TASK_03_PATH, TASK_04_PATH } from "@/router/constants/paths";

import { SparklesIcon, CubeTransparentIcon, ServerIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";

import type { NavigationItem } from "../Navigation.props";

export const NAVIGATION_ITEMS: NavigationItem[] = [
	{
		type: "link",
		label: "Full Demo",
		to: "/",
		Icon: SparklesIcon,
	},
	{
		type: "heading",
		label: "Tasks",
	},
	{
		type: "link",
		label: TASK_02_PATH,
		to: `/${TASKS_PATH}/${TASK_02_PATH}`,
		Icon: RectangleGroupIcon,
	},
	{
		type: "link",
		label: TASK_03_PATH,
		to: `/${TASKS_PATH}/${TASK_03_PATH}`,
		Icon: CubeTransparentIcon,
	},
	{
		type: "link",
		label: TASK_04_PATH,
		to: `/${TASKS_PATH}/${TASK_04_PATH}`,
		Icon: ServerIcon,
	},
];
