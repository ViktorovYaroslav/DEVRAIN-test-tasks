import type { FC, ReactNode } from "react";

interface Props {
	steps: ReactNode[];
}

const Steps: FC<Props> = ({ steps }) => {
	return (
		<ol className="relative ml-4 space-y-6 border-gray-200 border-s">
			{steps.map((step, index) => (
				<li key={index} className="ml-6">
					<span className="-start-4 -translate-y-1 absolute flex size-8 items-center justify-center rounded-full bg-primary-700 text-sm text-white">
						{index + 1}
					</span>
					<div>{step}</div>
				</li>
			))}
		</ol>
	);
};

export default Steps;
