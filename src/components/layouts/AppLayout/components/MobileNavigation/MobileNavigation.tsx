import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/buttons";
import { DevRainLogo } from "@/components/ui/logos";
import { Navigation } from "../../components";

import type { FC } from "react";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const MobileNavigation: FC<Props> = ({ isOpen, onClose }) => {
	return (
		<div className="fixed inset-0 z-1">
			<button type="button" className="absolute inset-0 bg-gray-900/25" onClick={onClose} />
			<div
				className={clsx(
					"h-full w-3xs space-y-8 border-gray-100 border-r bg-white p-4",
					"absolute top-0 left-0",
					"transition duration-200 ease-out",
					isOpen ? "translate-x-0" : "-translate-x-4"
				)}
			>
				<div className="flex items-center justify-between gap-4">
					<DevRainLogo />
					<Button variant="icon" square onClick={onClose}>
						<XMarkIcon className="size-6" aria-hidden="true" />
						<span className="sr-only">Close navigation</span>
					</Button>
				</div>
				<Navigation />
			</div>
		</div>
	);
};

export default MobileNavigation;
