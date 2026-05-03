import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { GetAllInventory } from "../Api/apiCallsInventory";
import { AxiosError } from "axios";

export function useInventoryData(options: UseInventoryDataOptions = {}) {
  const { filterExpiringSoon = false, searchTerm = "" } = options;

  const { isPending, data, error, isError } = useQuery<InventoryDataContract>({
    queryKey: ["inventory"],
    queryFn: GetAllInventory,
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { filteredData, expiringCount } = useMemo(() => {
    if (!data) return { filteredData: null, expiringCount: 0 };

    const today = new Date();
    let count = 0;

    const filteredCategories = data.categories
      .map((category) => {
        const notificationDays = category.notificationTime;
        const notificationDate = new Date(today);
        notificationDate.setDate(today.getDate() + notificationDays);

        const filteredProducts = category.products
          .map((product) => {
            const expiringItems = product.inventory.filter((item) => {
              const expiryDate = new Date(item.expiryDate);
              const isExpiringSoon = expiryDate <= notificationDate;
              item.isExpiringSoon = isExpiringSoon;
              if (isExpiringSoon) count++;
              return isExpiringSoon;
            });

            if (filterExpiringSoon) {
              // Only include products with expiring or expired items
              return expiringItems.length > 0
                ? { ...product, inventory: expiringItems }
                : null;
            }
            // Include all products
            return product;
          })
          .filter(
            (product): product is ProductContractWithInventory =>
              product !== null,
          );

        if (filterExpiringSoon) {
          // Only include categories with products that have expiring or expired items
          return filteredProducts.length > 0
            ? { ...category, products: filteredProducts }
            : null;
        }
        // Include all categories
        return { ...category, products: filteredProducts };
      })
      .filter(
        (category): category is CategoryContractWithProducts =>
          category !== null,
      );

    //* Apply search filter if searchTerm is provided
    const search = searchTerm.toLowerCase().trim();
    const searchFilteredCategories = search
      ? filteredCategories
          .map((category) => ({
            ...category,
            products: category.products.filter((product) => {
              const productMatches = product.productName
                .toLowerCase()
                .includes(search);
              const categoryMatches = category.categoryName
                .toLowerCase()
                .includes(search);
              const storageMatches = product.inventory.some((item) =>
                item.storageTypeName.toLowerCase().includes(search),
              );
              return productMatches || categoryMatches || storageMatches;
            }),
          }))
          .filter((category) => category.products.length > 0)
      : filteredCategories;

    return {
      filteredData: {
        ...data,
        categories: searchFilteredCategories,
      },
      expiringCount: count,
    };
  }, [data, filterExpiringSoon, searchTerm]);

  return {
    isPending,
    data: filteredData,
    error,
    isError,
    expiringCount,
  };
}

interface UseInventoryDataOptions {
  filterExpiringSoon?: boolean;
  searchTerm?: string;
}
