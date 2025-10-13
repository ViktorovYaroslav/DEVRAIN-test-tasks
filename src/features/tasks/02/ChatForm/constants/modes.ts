import type { Option } from "@/types/options";

export const MODES: Option<"instruction" | "ingredients">[] = [
	{
		label: "Instruction",
		option: "instruction",
	},
	{
		label: "Ingredients",
		option: "ingredients",
	},
];
