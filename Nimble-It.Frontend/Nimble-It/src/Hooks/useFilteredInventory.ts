import { useMemo } from "react";

export const useFilteredInventory = (
  data: InventoryDataContract | undefined,
  alfabetSort: boolean,
  categoryDateFilters: Record<number, boolean>,
) => {
  const filteredData = useMemo(() => {
    if (!data || !data.categories) return { categories: [] };

    const sortedCategories = data.categories.map((category) => {
      const dateFilter = categoryDateFilters[category.categoryId] ?? true;

      const sortedProducts = [...category.products].map((product) => {
        // ? Sort inventory items by date if filter is false
        const sortedInventory = !dateFilter
          ? [...product.inventory].sort((a, b) => {
              const dateA = new Date(a.expiryDate).getTime();
              const dateB = new Date(b.expiryDate).getTime();
              return dateA - dateB; // Oldest first
            })
          : [...product.inventory];

        return { ...product, inventory: sortedInventory };
      });

      // ? Sort products by date if filter is false
      if (!dateFilter) {
        sortedProducts.sort((a, b) => {
          const earliestA = Math.min(
            ...a.inventory.map((item) => new Date(item.expiryDate).getTime()),
          );
          const earliestB = Math.min(
            ...b.inventory.map((item) => new Date(item.expiryDate).getTime()),
          );
          return earliestA - earliestB; // ? Oldest first
        });
      } else {
        // ? Only sort alphabetically if date sorting is off
        sortedProducts.sort((a, b) => {
          const comparison = a.productName.localeCompare(b.productName);
          return alfabetSort ? comparison : -comparison;
        });
      }

      return { ...category, products: sortedProducts };
    });

    return { categories: sortedCategories };
  }, [data, alfabetSort, categoryDateFilters]);

  return filteredData;
};
