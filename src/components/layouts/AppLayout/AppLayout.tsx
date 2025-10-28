import { useState } from "react";
import { Outlet } from "react-router";

import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/buttons";
import { DevRainLogo } from "@/components/ui/logos";
import { Navigation, MobileNavigation } from "./components";

import type { FC } from "react";

const AppLayout: FC = () => {
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

	return (
		<div className="flex min-h-screen bg-gray-50">
			<div className="hidden basis-3xs space-y-8 border-gray-100 border-r bg-white p-4 md:block">
				<DevRainLogo />
				<Navigation />
			</div>
			<div className="relative h-screen max-h-screen grow overflow-hidden px-4 xs:px-8 py-4">
				<div className="flex h-full flex-col">
					<div className="pb-4 md:hidden">
						<Button className="pl-0" variant="icon" square onClick={() => setIsMobileNavOpen((prev) => !prev)}>
							<Bars3BottomLeftIcon className="size-6" aria-hidden="true" />
							<span className="sr-only">Toggle navigation</span>
						</Button>
					</div>

					<MobileNavigation isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

					<div className="relative mt-0 flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden md:mt-14 2xl:mt-0">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppLayout;
