import { RECIPE_ASSISTANT_TASK2_INGREDIENTS_URL, RECIPE_ASSISTANT_TASK2_INSTRUCTIONS_URL } from "./urls";

export const fetchRecipeInstructions = async (title: string) => {
	const response = await fetch(RECIPE_ASSISTANT_TASK2_INSTRUCTIONS_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title }),
	});

	if (!response.ok) {
		throw new Error("Failed to fetch recipe instructions");
	}

	return response.json();
};

export const fetchRecipeIngredients = async (title: string) => {
	const response = await fetch(RECIPE_ASSISTANT_TASK2_INGREDIENTS_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title }),
	});

	if (!response.ok) {
		throw new Error("Failed to fetch recipe ingredients");
	}

	return response.json();
};
