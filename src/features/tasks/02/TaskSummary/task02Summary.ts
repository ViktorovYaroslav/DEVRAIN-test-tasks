//instructions output: {{"title": string, "recipe": string, "steps": [string], "notes": [string]}}
export const Task02Summary = `
## Task 02 Summary + DEMO

1. As a **main LLM** were choosing \`claude-3-5-haiku-latest\`
2. **Why this model?** 

Because it has a good balance between performance and cost. 

It is capable of understanding and generating human-like text, which is essential for this chat application. 

Additionally, it is optimized for conversational tasks, making it suitable for our use case.

3. Prompt **How to cook X?** and **What ingredients do I need for X?**

Implemented as python endpoints, text of prompt is in \`backend/apps/task2/prompts.py\`. 

\`COOK_INSTR_USER\` and \`COOK_INSTR_SYSTEM\` variables.

4. **Outputs**

\`\`\`json

// def cooking_instructions "How to cook Grilled Chicken with Rice and Broccoli?"
{
   "title": "Grilled Chicken with Rice and Broccoli",
   "recipe": "This delicious and healthy meal features tender grilled chicken breasts served with fluffy rice and steamed broccoli. Perfect for a quick weeknight dinner or meal prep for the week.",
   "steps": [
      "Marinate the chicken breasts with olive oil, lemon juice, minced garlic, salt, and pepper. Let it sit for at least 30 minutes.",
      "Preheat the grill to medium-high heat. Grill the chicken for about 6-7 minutes on each side or until fully cooked.",
      "While the chicken is grilling, cook the rice according to package instructions.",
      "Steam the broccoli until tender but still crisp, about 4-5 minutes.",
      "Serve the grilled chicken over a bed of rice with steamed broccoli on the side."
   ],
   "notes": [
      "You can add some herbs like thyme or rosemary to the marinade for extra flavor.",
      "Make sure to let the chicken rest for a few minutes after grilling to retain its juices.",
      "Feel free to substitute broccoli with other vegetables like asparagus or green beans."
   ]
}

// def required_ingredients "What ingredients do I need for Grilled Chicken with Rice and Broccoli?"
{
   "title": "Grilled Chicken with Rice and Broccoli",
   "ingredients": [
      { "name": "chicken breasts", "quantity": "2", "unit": "pieces" },
      { "name": "olive oil", "quantity": "2", "unit": "tablespoons" },
      { "name": "lemon juice", "quantity": "1", "unit": "tablespoon" },
      { "name": "garlic", "quantity": "2", "unit": "cloves, minced" },
      { "name": "salt", "quantity": "to taste", "unit": "" },
      { "name": "black pepper", "quantity": "to taste", "unit": "" },
      { "name": "rice", "quantity": "1", "unit": "cup" },
      { "name": "broccoli", "quantity": "1", "unit": "head" }
   ]
}

\`\`\`

`;
