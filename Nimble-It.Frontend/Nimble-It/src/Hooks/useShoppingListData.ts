import { useQuery } from "@tanstack/react-query";
import { GetAllShoppingList } from "../Api/apiCallsShoppingList";
import { AxiosError } from "axios";

export function useShoppingListData() {
  const { isPending, data, error, isError } =
    useQuery<ShoppingListItemsContract>({
      queryKey: ["shoppinglist"],
      queryFn: GetAllShoppingList,
      retry: (failureCount, error) => {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return false;
        }
        return failureCount < 1;
      },
      staleTime: 5 * 60 * 1000,
    });

  return {
    isPending,
    data,
    error,
    isError,
  };
}
