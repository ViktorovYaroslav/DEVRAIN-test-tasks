import { useState, useEffect } from "react";

import { fetchImageByKeyword } from "@/api/unsplash/endpoints";

import type { FC } from "react";
import type { Ingredient as IngredientType } from "@/types/query/tasks/response";
import type { UnsplashPhoto } from "@/api/unsplash/types";

interface Props extends IngredientType {}

const Ingredient: FC<Props> = ({ name, quantity, unit }) => {
	const [image, setImage] = useState<UnsplashPhoto | null>(null);

	useEffect(() => {
		const fetchImage = async () => {
			const img = await fetchImageByKeyword(name);
			setImage(img);
		};
		fetchImage();
	}, [name]);

	return (
		<div className="card__material !p-0 flex min-h-[5.125rem] overflow-hidden">
			{image && (
				<img
					src={image.urls.small || image.urls.regular}
					alt={image.alt_description ?? name}
					className="aspect-square h-20 w-auto rounded-2xl object-cover"
				/>
			)}

			<div className="p-4">
				<h3 className="text-lg">{name}</h3>

				{(quantity || unit) && (
					<p className="text-gray-500 text-sm">
						{quantity} {unit}
					</p>
				)}
			</div>
		</div>
	);
};

export default Ingredient;
