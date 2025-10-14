import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Button } from "../../buttons";

import type { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
	isOpen: boolean;
	close: () => void;
}

const Modal: FC<Props> = ({ isOpen, close, children }) => {
	return (
		<Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
			<div className="fixed inset-0 z-10 w-screen overflow-hidden bg-black/20 backdrop-blur-xs">
				<div className="flex h-full items-center justify-center">
					<DialogPanel
						transition
						className="card__material data-closed:transform-[scale(95%)] flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden duration-400 ease-out data-closed:opacity-0"
					>
						<div className="flex">
							<Button onClick={close} variant="icon" square className="ml-auto">
								<span className="sr-only">Close</span>
								<XMarkIcon className="size-5" aria-hidden="true" />
							</Button>
						</div>

						<div className="!pt-0 overflow-y-auto overscroll-contain p-8">{children}</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
};

export default Modal;
