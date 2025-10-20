import { ButtonGroup } from "@/components/ui/buttons";

import { VIEW_MODES } from "./constants/modes";

import type { FC, SetStateAction, Dispatch } from "react";

interface Props {
	onChange: Dispatch<SetStateAction<string>>;
}

const ViewMode: FC<Props> = ({ onChange }) => {
	return <ButtonGroup items={VIEW_MODES} onChange={onChange} />;
};

export default ViewMode;
