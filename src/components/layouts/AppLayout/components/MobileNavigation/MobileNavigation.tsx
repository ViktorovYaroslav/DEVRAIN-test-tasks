import { XMarkIcon } from "@heroicons/react/24/outline";

import { SidePanel } from "@/components/ui/dialogs";
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
		<SidePanel isOpen={isOpen} onClose={onClose}>
			<div className="flex items-center justify-between gap-4">
				<DevRainLogo />
				<Button variant="icon" square onClick={onClose}>
					<XMarkIcon className="size-6" aria-hidden="true" />
					<span className="sr-only">Close navigation</span>
				</Button>
			</div>
			<Navigation />
		</SidePanel>
	);
};

export default MobileNavigation;
