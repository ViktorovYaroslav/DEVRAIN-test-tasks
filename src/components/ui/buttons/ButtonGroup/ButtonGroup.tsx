import { Tab, TabGroup, TabList } from "@headlessui/react";

import type { Option } from "@/types/options";

interface Props {
	items: Option[];
	onChange: (option: string) => void;
}

const ButtonGroup = ({ items, onChange }: Props) => {
	return (
		<TabGroup className="w-fit">
			<TabList className="flex gap-1 rounded-lg border border-gray-100 bg-white p-0.5">
				{items.map(({ label, option }) => (
					<Tab
						key={option}
						onClick={() => onChange(option)}
						className="rounded-md px-3 py-1 text-gray-900 text-sm focus:not-data-focus:outline-none data-selected:data-hover:bg-primary-50 data-hover:bg-primary-50 data-selected:bg-primary-50 data-hover:text-gray-900/80 data-selected:text-gray-900/80 data-focus:outline data-focus:outline-white"
					>
						{label}
					</Tab>
				))}
			</TabList>
		</TabGroup>
	);
};

export default ButtonGroup;
