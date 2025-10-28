import type { FC } from "react";

interface Props {
	title: string;
}

const ChatTitle: FC<Props> = ({ title }) => {
	return (
		<h1 className="-top-10 -translate-x-1/2 absolute left-1/2 w-max text-center font-light text-base xs:text-2xl">
			{title}
		</h1>
	);
};

export default ChatTitle;
