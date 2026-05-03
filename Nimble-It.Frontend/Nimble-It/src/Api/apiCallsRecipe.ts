import apiClient from "./apiClient";

export async function GetCountTotalRecipes(
  cookable: "true" | "false",
): Promise<CountCookable> {
  const response = await apiClient.get<CountCookable>(
    `recipe/Cookable/${cookable}`,
  );
  return response.data;
}

export async function GetCountFilteredRecipes(
  name?: string,
  tags?: string[],
  favorite?: boolean,
): Promise<number> {
  const response = await apiClient.get<number>("recipe", {
    params: {
      name,
      tag: tags,
      favorite,
      countOnly: true,
    },
  });
  return response.data;
}

export async function GetAllRecipes(
  page: number,
  amountPerPage: number,
  name?: string,
  tags?: string[],
  favorite?: boolean,
  isCookable?: boolean,
): Promise<RecipesContract[]> {
  const response = await apiClient.get<RecipesContract[]>("recipe", {
    params: {
      page,
      amountPage: amountPerPage,
      name,
      tag: tags,
      favorite,
      isCookable,
    },
  });
  return response.data;
}

export async function GetRecipeById(
  recipeId: number,
): Promise<RecipeFullInfoContract> {
  const response = await apiClient.get<RecipeFullInfoContract>(
    `recipe/${recipeId}`,
  );
  return response.data;
}

interface CountCookable {
  count: number;
}

export async function GetLastCookedRecipes(
  amountPage: number,
): Promise<RecipesContract[]> {
  const response = await apiClient.get<RecipesContract[]>(
    "recipe/Last-cooked",
    {
      params: {
        amountPage: amountPage,
      },
    },
  );
  return response.data;
}

export async function CreateRecipe(
  request: RecipeFormValues,
): Promise<RecipesContract> {
  const formData = new FormData();

  formData.append("name", request.name);
  formData.append("description", request.description);
  formData.append("servingSize", request.servingSize.toString());
  formData.append("complexity", request.complexity.toString());
  formData.append("prepareTime", request.prepareTime.toString());

  if (request.image) {
    formData.append("image", request.image);
  }

  request.tags.forEach((tagId) => formData.append("tags", tagId.toString()));

  request.recipeParts.forEach((part, partIndex) => {
    formData.append(`recipeParts[${partIndex}].title`, part.title);
    part.products.forEach((product, productIndex) => {
      formData.append(
        `recipeParts[${partIndex}].products[${productIndex}].productId`,
        product.productId.toString(),
      );
      formData.append(
        `recipeParts[${partIndex}].products[${productIndex}].amount`,
        product.amount.toString(),
      );
    });
  });

  request.instructions.forEach((instruction, index) => {
    formData.append(`instructions[${index}].step`, instruction.step);
    formData.append(`instructions[${index}].header`, instruction.header);
    formData.append(`instructions[${index}].text`, instruction.text);
  });

  const response = await apiClient.post<RecipesContract>("recipe", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function UpdateRecipe(
  recipeId: number,
  request: RecipeFormValues,
): Promise<RecipesContract> {
  const formData = new FormData();

  formData.append("name", request.name);
  formData.append("description", request.description);
  formData.append("servingSize", request.servingSize.toString());
  formData.append("complexity", request.complexity.toString());
  formData.append("prepareTime", request.prepareTime.toString());

  if (request.image) {
    formData.append("image", request.image);
  }

  request.tags.forEach((tagId) => formData.append("tags", tagId.toString()));

  request.recipeParts.forEach((part, partIndex) => {
    formData.append(`recipeParts[${partIndex}].title`, part.title);
    part.products.forEach((product, productIndex) => {
      formData.append(
        `recipeParts[${partIndex}].products[${productIndex}].productId`,
        product.productId.toString(),
      );
      formData.append(
        `recipeParts[${partIndex}].products[${productIndex}].amount`,
        product.amount.toString(),
      );
    });
  });

  request.instructions.forEach((instruction, index) => {
    formData.append(`instructions[${index}].step`, instruction.step);
    formData.append(`instructions[${index}].header`, instruction.header);
    formData.append(`instructions[${index}].text`, instruction.text);
  });

  const response = await apiClient.put<RecipesContract>(
    `recipe/${recipeId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function UpdateLastCooked(recipeId: number): Promise<void> {
  await apiClient.patch(`recipe/${recipeId}/last-cooked`);
}

export async function ToggleFavorite(recipeId: number): Promise<void> {
  await apiClient.patch(`recipe/${recipeId}/favorite`);
}

export async function DeleteRecipe(recipeId: number): Promise<void> {
  await apiClient.delete(`recipe/${recipeId}`);
}
