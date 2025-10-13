import { useState } from "react";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useForm } from "@tanstack/react-form";

import { TextArea } from "@/components/ui/inputs/TextArea";
import { Button, ButtonGroup } from "@/components/ui/buttons";

import { MODES } from "./constants/modes";
import { CHAT_FORM_VALIDATION_SCHEMA } from "./constants/validationSchema";
import { CHAT_FORM_INITIAL_VALUES } from "./constants/initial";
//import { fetchRecipeIngredients, fetchRecipeInstructions } from "@/api/task2/endpoints";

import type { FC } from "react";

const ChatForm: FC = () => {
	const [_, setSelectedOption] = useState(MODES[0].option);

	const { Field, handleSubmit } = useForm({
		defaultValues: CHAT_FORM_INITIAL_VALUES,
		validators: {
			onChange: CHAT_FORM_VALIDATION_SCHEMA,
		},
		onSubmit: async (values) => {
			console.log(values);
		},
	});

	return (
		<div className="w-full max-w-3xl space-y-3">
			<h1 className="text-center font-light text-2xl">What do you want to cook today?</h1>

			<form
				className="card__material flex w-full items-end gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();

					handleSubmit();
				}}
			>
				<div className="grow">
					<Field
						name="message"
						children={(field) => (
							<TextArea
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="I need a recipe with chicken, rice and broccoli"
								id="task2-chat-form"
								label="message"
								hiddenLabel
								minRows={1}
								maxRows={8}
								className="!py-2 resize-none"
							/>
						)}
					/>
				</div>
				<Button type="submit" className="!text-white" square>
					<PaperAirplaneIcon className="size-5" />
				</Button>
			</form>

			<div className="ml-[calc(1.5rem+1px)] flex items-center gap-3">
				<p className="text-muted-foreground text-sm">Mode:</p>
				<ButtonGroup items={MODES} onChange={setSelectedOption} />
			</div>
		</div>
	);
};

export default ChatForm;
