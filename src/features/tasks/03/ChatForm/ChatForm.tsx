import { useState } from "react";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useForm } from "@tanstack/react-form";
import { Transition } from "@headlessui/react";

import { TextArea } from "@/components/ui/inputs/TextArea";
import { Button, ButtonGroup } from "@/components/ui/buttons";

import { MODES } from "./constants/modes";
import { CHAT_FORM_VALIDATION_SCHEMA } from "./constants/validationSchema";
import { CHAT_FORM_INITIAL_VALUES } from "./constants/initial";
import { tryCatch } from "@/utils/helpers/promises/tryCatch";
import { fetchRecipeIngredients, fetchRecipeInstructions, fetchRecipeRecommendations } from "@/api/tasks/03/endpoints";
import { sendOnEnter } from "@/utils/helpers/form/sendOnEnter";
import { useRecipes } from "@/context/activeRecipeIndex/hooks";
import { CHAT_TEXTAREA_PLACEHOLDERS } from "@/constants/options/placeholders";

import type { FC } from "react";
import type { RecipeItem03 } from "@/types/query/tasks/response";

const ChatForm: FC = () => {
	const [mode, setMode] = useState(MODES[0].option);

	const {
		query: { data: recipes },
		recipesLoading,
		setActiveRecipeIndex,
		setNewRecipe,
		setRecipesLoading,
	} = useRecipes();

	const { Field, Subscribe, handleSubmit, reset } = useForm({
		defaultValues: CHAT_FORM_INITIAL_VALUES,
		validators: {
			onChange: CHAT_FORM_VALIDATION_SCHEMA,
		},
		onSubmit: async ({ value }) => {
			setRecipesLoading(true);

			let callback = async (): Promise<RecipeItem03 | null> => null;

			if (mode === "instruction") callback = () => fetchRecipeInstructions(value.message);
			if (mode === "ingredients") callback = () => fetchRecipeIngredients(value.message);
			if (mode === "recommend") callback = () => fetchRecipeRecommendations(value.message);

			const [data, error] = await tryCatch(callback());

			if (error) {
				console.error(error);
				return;
			}

			reset();

			if (data) {
				setNewRecipe(data);
				setActiveRecipeIndex(recipes ? recipes.length : 0);
			}
		},
	});

	return (
		<div className="relative w-full max-w-3xl space-y-3">
			<Transition
				show={!recipesLoading && !recipes}
				enter="transition-opacity duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<h1 className="-top-10 -translate-x-1/2 absolute left-1/2 w-max text-center font-light text-2xl">
					What do you want to cook today?
				</h1>
			</Transition>

			<form
				className="card__material flex w-full items-end gap-2"
				onKeyDown={sendOnEnter}
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();

					handleSubmit().finally(() => {
						setRecipesLoading(false);
					});
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
								placeholder={CHAT_TEXTAREA_PLACEHOLDERS[mode]}
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

				<Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.isPristine]}>
					{([canSubmit, isSubmitting, isPristine]) => (
						<Button
							type="submit"
							className="!text-white"
							square
							disabled={isPristine || !canSubmit || isSubmitting}
							loading={isSubmitting}
							loadingText=""
							spinnerProps={{
								size: "md",
							}}
						>
							<PaperAirplaneIcon className="size-5" />
						</Button>
					)}
				</Subscribe>
			</form>

			<div className="ml-[calc(1.5rem+1px)] flex items-center gap-3">
				<p className="text-muted-foreground text-sm">Mode:</p>
				<ButtonGroup items={MODES} onChange={setMode} />
			</div>
		</div>
	);
};

export default ChatForm;
