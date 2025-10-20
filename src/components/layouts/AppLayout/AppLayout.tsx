import { Outlet } from "react-router";

import { DevRainLogo } from "@/components/ui/logos";
import { Navigation } from "./components";

import type { FC } from "react";

const AppLayout: FC = () => {
	return (
		<div className="flex min-h-screen bg-gray-50">
			<div className="basis-3xs space-y-8 border-gray-100 border-r bg-white p-4">
				<DevRainLogo />
				<Navigation />
			</div>
			<div className="h-screen max-h-screen grow overflow-hidden p-4">
				<div className="relative flex size-full flex-col items-center justify-center gap-4">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AppLayout;
