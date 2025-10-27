import { useState } from "react";
import { Outlet } from "react-router";

import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

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
			<div className="relative h-screen max-h-screen grow overflow-hidden px-12 py-4 md:px-4">
				<Transition
					as="div"
					className="relative z-10"
					show={isMobileNavOpen}
					enter="transition-opacity duration-200 ease-out"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity duration-200 ease-out"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<MobileNavigation isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
				</Transition>

				<div className="fixed top-4 left-2 block md:hidden">
					<Button variant="icon" square onClick={() => setIsMobileNavOpen((prev) => !prev)}>
						<Bars3BottomLeftIcon className="size-6" aria-hidden="true" />
						<span className="sr-only">Toggle navigation</span>
					</Button>
				</div>
				<div className="relative flex size-full flex-col items-center justify-center gap-4">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AppLayout;
