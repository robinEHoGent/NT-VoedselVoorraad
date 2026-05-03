import apiClient from "./apiClient";

export async function GetAllInventory(): Promise<InventoryDataContract> {
  const response = await apiClient.get<InventoryDataContract>("inventory");
  return response.data;
}

export async function UpdateStorageTypeInventory(
  inventoryId: number,
  storageTypeRequest: StorageTypeRequest,
): Promise<InventoryItemContract> {
  const response = await apiClient.put<InventoryItemContract>(
    `inventory/${inventoryId}/storage-type`,
    storageTypeRequest,
  );

  return response.data;
}

export async function UpdateAmountInventory(
  inventoryId: number,
  amount: number,
): Promise<InventoryItemContract> {
  const response = await apiClient.put<InventoryItemContract>(
    `inventory/${inventoryId}/amount`,
    amount,
  );
  return response.data;
}

export async function DeleteInventoryItem(id: number): Promise<void> {
  await apiClient.delete<CategoryContractWithProducts>(`inventory/${id}`);
}

export async function AddInventoryItem(
  inventoryItem: InventoryRequestContract,
): Promise<InventoryResponseContract> {
  const response = await apiClient.post<InventoryResponseContract>(
    "inventory",
    inventoryItem,
  );

  return response.data;
}
