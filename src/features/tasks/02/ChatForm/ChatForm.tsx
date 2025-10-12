import { useState } from "react";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

import { TextArea } from "@/components/ui/inputs/TextArea";
import { Button, ButtonGroup } from "@/components/ui/buttons";

import { MODES } from "./constants/modes";

import type { FC } from "react";

const ChatForm: FC = () => {
	const [_, setSelectedOption] = useState(MODES[0].option);

	return (
		<div className="w-full max-w-3xl space-y-3">
			<h1 className="text-center font-light text-2xl">What do you want to cook today?</h1>

			<form className="card__material flex w-full items-end gap-2">
				<div className="grow">
					<TextArea
						placeholder="I need a recipe with chicken, rice and broccoli"
						id="task2-chat-form"
						label="message"
						hiddenLabel
						minRows={1}
						maxRows={8}
						className="!py-2 resize-none"
					/>
				</div>
				<Button type="submit" className="!text-white" square>
					<PaperAirplaneIcon className="size-5" />
				</Button>
			</form>

			<div className="ml-6 flex items-center gap-3">
				<p className="text-muted-foreground text-sm">Mode:</p>
				<ButtonGroup items={MODES} onChange={setSelectedOption} />
			</div>
		</div>
	);
};

export default ChatForm;
