import { useQuery } from "@tanstack/react-query";
import {
  GetAllRecipes,
  GetCountFilteredRecipes,
  GetCountTotalRecipes,
} from "@/Api/apiCallsRecipe";
import { AxiosError } from "axios";

interface UseRecipeQueriesProps {
  cookablePage: number;
  notCookablePage: number;
  filteredPage: number;
  amountPerPage: number;
  searchTerm?: string;
  selectedTags?: string[];
  isFavorite?: boolean;
}

export const useRecipeQueries = ({
  cookablePage,
  notCookablePage,
  filteredPage,
  amountPerPage,
  searchTerm,
  selectedTags,
  isFavorite,
}: UseRecipeQueriesProps) => {
  const retryConfig = (failureCount: number, error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return false;
    }
    return failureCount < 1;
  };

  const { data: totalCookableRecipes } = useQuery({
    queryKey: ["totalCookable"],
    queryFn: () => GetCountTotalRecipes("true"),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  const { data: totalNotCookableRecipes } = useQuery({
    queryKey: ["totalNotCookable"],
    queryFn: () => GetCountTotalRecipes("false"),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  const { data: totalFilteredRecipes } = useQuery({
    queryKey: ["totalFiltered", searchTerm, selectedTags, isFavorite],
    queryFn: () =>
      GetCountFilteredRecipes(searchTerm, selectedTags, isFavorite),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  const {
    isLoading: isLoadingCookable,
    data: cookable,
    error: cookableError,
    isError: isCookableError,
  } = useQuery({
    queryKey: ["recipe-cookable", cookablePage, amountPerPage],
    queryFn: () =>
      GetAllRecipes(
        cookablePage,
        amountPerPage,
        undefined,
        undefined,
        undefined,
        true,
      ),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  const {
    isLoading: isLoadingNotCookable,
    data: notCookable,
    error: notCookableError,
    isError: isNotCookableError,
  } = useQuery({
    queryKey: ["recipe-not-cookable", notCookablePage, amountPerPage],
    queryFn: () =>
      GetAllRecipes(
        notCookablePage,
        amountPerPage,
        undefined,
        undefined,
        undefined,
        false,
      ),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  const hasActiveFilters = Boolean(
    searchTerm || (selectedTags && selectedTags.length > 0) || isFavorite,
  );

  const {
    isLoading: isLoadingFiltered,
    data: filteredRecipes,
    error: filteredError,
    isError: isFilteredError,
  } = useQuery({
    queryKey: [
      "filtered-recipes",
      filteredPage,
      amountPerPage,
      searchTerm,
      selectedTags,
      isFavorite,
    ],
    queryFn: () =>
      GetAllRecipes(
        filteredPage,
        amountPerPage,
        searchTerm,
        selectedTags,
        isFavorite,
        undefined,
      ),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
    enabled: hasActiveFilters,
  });

  return {
    totalCookableRecipes,
    totalNotCookableRecipes,
    totalFilteredRecipes,
    isLoadingCookable,
    cookable,
    cookableError,
    isCookableError,
    isLoadingNotCookable,
    notCookable,
    notCookableError,
    isNotCookableError,
    hasActiveFilters,
    isLoadingFiltered,
    filteredRecipes,
    filteredError,
    isFilteredError,
  };
};
