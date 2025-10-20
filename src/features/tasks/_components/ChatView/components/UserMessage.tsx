import type { FC } from "react";

interface Props {
	content: string;
}

const UserMessage: FC<Props> = ({ content }) => {
	return <div className="card__material ml-auto max-w-1/2">{content}</div>;
};

export default UserMessage;
