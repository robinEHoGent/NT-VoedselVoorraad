import apiClient from "./apiClient";

export async function GetAllCategories(): Promise<
  CategoryContractWithProducts[]
> {
  const response =
    await apiClient.get<CategoryContractWithProducts[]>("categories");
  return response.data;
}

export async function GetAllCategoriesSimple(): Promise<CategoryContract[]> {
  const response = await apiClient.get<CategoryContract[]>("categories/simple");
  return response.data;
}

export async function AddCategory(
  category: CategoryRequestContract,
): Promise<CategoryContract> {
  const response = await apiClient.post<CategoryContract>(
    "categories",
    category,
  );

  return response.data;
}
