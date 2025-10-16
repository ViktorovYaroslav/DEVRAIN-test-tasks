import type { Option } from "@/types/options";
import type { ChatMode } from "@/types/query/tasks/modes";

export const MODES: Option<ChatMode>[] = [
	{
		label: "Recommend",
		option: "recommend",
	},
	{
		label: "Instruction",
		option: "instruction",
	},
	{
		label: "Ingredients",
		option: "ingredients",
	},
];
