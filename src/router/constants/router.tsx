import { createBrowserRouter } from "react-router";
import { lazy } from "react";

import { AppLayout } from "@/components/layouts";

import { TASKS_PATH, TASK_02_PATH, TASK_03_PATH, TASK_04_PATH } from "./paths";

const Task02Page = lazy(() => import("@/pages/tasks/02/Task02Page"));
const Task03Page = lazy(() => import("@/pages/tasks/03/Task03Page"));
const Task04Page = lazy(() => import("@/pages/tasks/04/Task04Page"));

const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		children: [
			{
				path: `/${TASKS_PATH}/${TASK_02_PATH}`,
				element: <Task02Page />,
			},
			{
				path: `/${TASKS_PATH}/${TASK_03_PATH}`,
				element: <Task03Page />,
			},
			{
				path: `/${TASKS_PATH}/${TASK_04_PATH}`,
				element: <Task04Page />,
			},
		],
	},
]);

export default router;
