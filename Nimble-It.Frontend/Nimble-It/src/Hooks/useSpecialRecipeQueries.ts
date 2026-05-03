import { useQuery } from "@tanstack/react-query";
import { GetAllRecipes, GetLastCookedRecipes } from "@/Api/apiCallsRecipe";
import { AxiosError } from "axios";

interface UseSpecialRecipeQueries {
  filteredPage: number;
  amountPage: number;
  searchTerm?: string;
  selectedTags?: string[];
  isFavorite?: boolean;
}

export const useSpecialRecipeQueries = ({
  filteredPage,
  amountPage,
  searchTerm,
  selectedTags,
  isFavorite,
}: UseSpecialRecipeQueries) => {
  const retryConfig = (failureCount: number, error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return false;
    }
    return failureCount < 1;
  };

  const {
    isLoading: isLoadingFavorites,
    data: favorite,
    error: favoriteError,
    isError: isFavoriteError,
  } = useQuery({
    queryKey: [
      "favorite-recipes",
      filteredPage,
      amountPage,
      searchTerm,
      selectedTags,
      isFavorite,
    ],
    queryFn: () =>
      GetAllRecipes(
        filteredPage,
        amountPage,
        undefined,
        undefined,
        true,
        undefined,
      ),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  const {
    isLoading: isLoadingLastCooked,
    data: lastCooked,
    error: lastCookedError,
    isError: isLastCookedError,
  } = useQuery({
    queryKey: ["last-cooked", amountPage],
    queryFn: () => GetLastCookedRecipes(amountPage),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  return {
    isLoadingFavorites,
    favorite,
    favoriteError,
    isFavoriteError,
    isLoadingLastCooked,
    lastCooked,
    lastCookedError,
    isLastCookedError,
  };
};
