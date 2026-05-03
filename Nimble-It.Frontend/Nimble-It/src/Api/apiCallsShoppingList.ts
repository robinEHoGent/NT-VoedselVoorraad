import apiClient from "./apiClient";

export async function GetAllShoppingList(): Promise<ShoppingListItemsContract> {
  const response =
    await apiClient.get<ShoppingListItemsContract>("shoppinglist");

  const dataWithChecked = response.data.shoppingListItems.map((item) => ({
    ...item,
    checked: false,
  }));

  return { shoppingListItems: dataWithChecked };
}



export async function DeleteShoppingListItem(
  ShoppingListItemId: number,
): Promise<void> {
  await apiClient.delete<ShoppingListItemsContract>(
    `shoppinglist/${ShoppingListItemId}`,
  );
}

export async function AddShoppingListItem(
  shoppingListItem: CreateShoppingListItem,
): Promise<ShoppingListItem> {
  const response = await apiClient.post<ShoppingListItem>(
    "shoppinglist",
    shoppingListItem,
  );

  return response.data;
}

