import clsx from "clsx";
import { Transition } from "@headlessui/react";

import type { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
	isOpen: boolean;
	onClose: () => void;
	direction?: "left" | "right";
}

const SidePanel: FC<Props> = ({ isOpen, onClose, direction = "left", children }) => {
	return (
		<Transition
			as="div"
			className="relative z-10"
			show={isOpen}
			enter="transition duration-200 ease-out"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition duration-200 ease-out"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div className="fixed inset-0 z-1">
				<button type="button" className="absolute inset-0 bg-gray-900/25" onClick={onClose} />
				<div
					className={clsx(
						"h-full w-3xs space-y-8 border-gray-100 border-r bg-white p-4",
						"absolute top-0",
						"transition duration-200 ease-out",
						{
							"left-0": direction === "left",
							"right-0": direction === "right",
						},
						{
							"translate-x-0": isOpen,
							"-translate-x-4": !isOpen && direction === "left",
							"translate-x-4": !isOpen && direction === "right",
						}
					)}
				>
					{children}
				</div>
			</div>
		</Transition>
	);
};

export default SidePanel;
