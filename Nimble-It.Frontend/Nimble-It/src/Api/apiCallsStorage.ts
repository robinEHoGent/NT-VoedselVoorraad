import apiClient from "./apiClient";

export async function GetAllStorageTypes(): Promise<StorageTypeContract[]> {
  const response = await apiClient.get<StorageTypeContract[]>("storagetypes");
  return response.data;
}

export async function AddStorageType(
  storageType: StorageTypeRequest,
): Promise<StorageTypeContract> {
  const response = await apiClient.post<StorageTypeContract>(
    "storagetypes",
    storageType,
  );

  return response.data;
}
