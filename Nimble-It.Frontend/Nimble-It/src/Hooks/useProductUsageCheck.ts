import { useQuery } from "@tanstack/react-query";
import { GetAllInventory } from "../Api/apiCallsInventory";

export function useProductUsageCheck() {
  // delete mag altijd doorgaan -> geen checks op errors
  const { data } = useQuery<InventoryDataContract>({
    queryKey: ["inventory"],
    queryFn: GetAllInventory,
    staleTime: 5 * 60 * 1000,
  });

  function isProductUsed(productId: number): boolean {
    if (!data) return false;

    return data.categories.some((category) =>
      category.products.some(
        (p) => p.productId === productId && p.inventory.length > 0,
      ),
    );
  }

  return { isProductUsed };
}
