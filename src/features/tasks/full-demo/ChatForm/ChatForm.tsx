import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useForm } from "@tanstack/react-form";
import { Transition } from "@headlessui/react";

import { TextArea, FileInput } from "@/components/ui/inputs";
import { Button } from "@/components/ui/buttons";
import { SparklesLoader } from "@/components/ui/loaders";

import { CHAT_FORM_VALIDATION_SCHEMA } from "./constants/validationSchema";
import { CHAT_FORM_INITIAL_VALUES } from "./constants/initial";
import { tryCatch, readFileAsBase64 } from "@/utils/helpers/promises";
import { fetchChatResponse } from "@/api/tasks/full-demo/endpoints";
import { sendOnEnter } from "@/utils/helpers/form/sendOnEnter";
import { useChat } from "@/context/chat/hooks";
import { CHAT_TEXTAREA_PLACEHOLDERS } from "@/constants/options/placeholders";
import { VALID_IMAGE_MIME_TYPES } from "./constants/mime";

import type { FC } from "react";
import type { FullDemoUserMessage } from "@/types/query/full-demo/types";

const ChatForm: FC = () => {
	const {
		query: { data: history },
		isSending: recipesLoading,
		setIsSending,
		appendMessage,
	} = useChat();

	const { Field, Subscribe, handleSubmit, reset } = useForm({
		defaultValues: CHAT_FORM_INITIAL_VALUES,
		validators: {
			onChange: CHAT_FORM_VALIDATION_SCHEMA,
		},
		onSubmit: async ({ value }) => {
			setIsSending(true);

			const images = value.images.length
				? await Promise.all(
						value.images.map(async (file) => ({
							data: await readFileAsBase64(file),
							mediaType: file.type,
						}))
					)
				: undefined;

			const userMessage: FullDemoUserMessage = {
				role: "user",
				content: value.message,
				images,
			};

			appendMessage(userMessage);
			reset();

			const [data, error] = await tryCatch(fetchChatResponse([...(history ?? []), userMessage]));

			if (error) {
				console.error(error);
				return;
			}

			appendMessage(data);
		},
	});

	return (
		<div className="relative w-full max-w-3xl space-y-3">
			<Transition
				show={!recipesLoading && !history?.length}
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

			<Transition
				show={recipesLoading}
				as="div"
				className="-top-8 -left-9 absolute flex items-center"
				enter="transition-opacity duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="scale-[25%]">
					<SparklesLoader />
				</div>

				<p className="-ml-6 text-sm">Generating...</p>
			</Transition>

			<form
				className="card__material flex w-full items-end gap-2"
				onKeyDown={sendOnEnter}
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();

					handleSubmit().finally(() => {
						setIsSending(false);
					});
				}}
			>
				<Field
					name="images"
					children={({ name, handleBlur, handleChange }) => (
						<FileInput
							name={name}
							id={name}
							onBlur={handleBlur}
							onChange={(event) => {
								handleChange(Array.from(event.target.files ?? []));
							}}
							Icon={PhotoIcon}
							className="px-0"
							multiple
							accept={VALID_IMAGE_MIME_TYPES.join(",")}
							label="upload images"
						/>
					)}
				/>

				<div className="grow">
					<Field
						name="message"
						children={(field) => (
							<TextArea
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={CHAT_TEXTAREA_PLACEHOLDERS.instruction}
								id="task-chat-form"
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
							loading={isSubmitting || recipesLoading}
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
		</div>
	);
};

export default ChatForm;
