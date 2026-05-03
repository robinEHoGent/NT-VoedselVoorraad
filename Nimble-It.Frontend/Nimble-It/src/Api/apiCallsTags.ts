import apiClient from "./apiClient";

export const GetAllTags = async (): Promise<TagsContract[]> => {
  const response = await apiClient.get<TagsContract[]>("tags");
  return response.data;
};

export const GetTagById = async (id: number): Promise<TagsContract> => {
  const response = await apiClient.get<TagsContract>(`tags/${id}`);
  return response.data;
};

export const CreateTag = async (
  request: TagRequestContract,
): Promise<TagsContract> => {
  const response = await apiClient.post<TagsContract>("tags", request);
  return response.data;
};