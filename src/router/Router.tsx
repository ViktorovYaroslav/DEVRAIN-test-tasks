import { RouterProvider } from "react-router";

import router from "./constants/router";

import type { FC } from "react";

export const Router: FC = () => {
	return <RouterProvider router={router} />;
};
