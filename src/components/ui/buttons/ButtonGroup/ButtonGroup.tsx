import clsx from "clsx";
import { Tab, TabGroup, TabList } from "@headlessui/react";

import type { Option } from "@/types/options";
import type { Dispatch, SetStateAction } from "react";

interface Props<T = string> {
	items: Option<T>[];
	onChange: Dispatch<SetStateAction<T>>;
	className?: string;
	listClassName?: string;
	maxColumns?: number;
}

const ButtonGroup = <T = string>({ items, onChange, className, listClassName, maxColumns = 2 }: Props<T>) => {
	const columnCount = Math.max(1, Math.min(items.length, maxColumns));

	return (
		<TabGroup className={clsx("w-full sm:w-fit", className)}>
			<TabList
				className={clsx(
					"grid w-full gap-1 rounded-lg border border-gray-100 bg-white p-0.5 sm:inline-flex sm:w-fit",
					listClassName
				)}
				style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
			>
				{items.map(({ label, option }) => (
					<Tab
						key={String(option)}
						onClick={() => onChange(option)}
						className="rounded-md px-3 py-1 text-center text-gray-900 text-sm focus:not-data-focus:outline-none data-selected:data-hover:bg-primary-50 data-hover:bg-primary-50 data-selected:bg-primary-50 data-hover:text-gray-900/80 data-selected:text-gray-900/80 data-focus:outline data-focus:outline-white"
					>
						{label}
					</Tab>
				))}
			</TabList>
		</TabGroup>
	);
};

export default ButtonGroup;
