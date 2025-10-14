import { Dialog, DialogPanel } from "@headlessui/react";

import type { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
	isOpen: boolean;
	close: () => void;
}

const Modal: FC<Props> = ({ isOpen, close, children }) => {
	return (
		<Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
			<div className="fixed inset-0 z-10 w-screen overflow-hidden bg-black/20 backdrop-blur-xs">
				<div className="flex h-full items-center justify-center p-4">
					<DialogPanel
						transition
						className="card__material !p-0 data-closed:transform-[scale(95%)] w-full max-w-3xl overflow-hidden duration-300 ease-out data-closed:opacity-0"
					>
						<div className="max-h-[90vh] overflow-y-auto overscroll-contain p-12">{children}</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
};

export default Modal;
