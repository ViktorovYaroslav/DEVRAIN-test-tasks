import { Suspense } from "react";

import { createBrowserRouter } from "react-router";
import { lazy } from "react";

import { AppLayout } from "@/components/layouts";
import { Spinner } from "@/components/ui/loaders";

import { TASKS_PATH, TASK_02_PATH, TASK_03_PATH, TASK_04_PATH } from "./paths";

const Task02Page = lazy(() => import("@/pages/tasks/02/Task02Page"));
const Task03Page = lazy(() => import("@/pages/tasks/03/Task03Page"));
const Task04Page = lazy(() => import("@/pages/tasks/04/Task04Page"));
const FullDemoPage = lazy(() => import("@/pages/tasks/full-demo/FullDemoPage"));

const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		children: [
			{
				index: true,
				element: (
					<Suspense fallback={<Spinner />}>
						<FullDemoPage />
					</Suspense>
				),
			},
			{
				path: `/${TASKS_PATH}/${TASK_02_PATH}`,
				element: (
					<Suspense fallback={<Spinner />}>
						<Task02Page />
					</Suspense>
				),
			},
			{
				path: `/${TASKS_PATH}/${TASK_03_PATH}`,
				element: (
					<Suspense fallback={<Spinner />}>
						<Task03Page />
					</Suspense>
				),
			},
			{
				path: `/${TASKS_PATH}/${TASK_04_PATH}`,
				element: (
					<Suspense fallback={<Spinner />}>
						<Task04Page />
					</Suspense>
				),
			},
		],
	},
]);

export default router;
