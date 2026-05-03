import { Star, Tag, X } from "lucide-react";
import useRecipeFilter from "@/Hooks/useRecipeFilter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetAllTags } from "@/Api/apiCallsTags";
import { AxiosError } from "axios";
import Loading from "@/UI/Loading";
import ErrorMessage from "@/UI/ErrorMessage";
import { useEffect } from "react";

function RecipeFilterPopup() {
  const {
    amountPerPage,
    selectedTags,
    isFavorite,
    setAmountPerPage,
    setCookablePage,
    setNotCookablePage,
    setFilteredPage,
    setSelectedTags,
    setIsFavorite,
  } = useRecipeFilter();

  const { isLoading, data, error, isError } = useQuery({
    queryKey: ["tags"],
    queryFn: GetAllTags,
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();

  const amountOptions = ["4", "8", "16", "32", "max"];

  useEffect(() => {
    setCookablePage(1);
    setNotCookablePage(1);
    setFilteredPage(1);
  }, [
    selectedTags,
    isFavorite,
    setCookablePage,
    setNotCookablePage,
    setFilteredPage,
  ]);

  const handleClearFilters = () => {
    setSelectedTags([]);
    setIsFavorite(false);
  };

  const handleAmountPerPageChange = (amount: string) => {
    const newAmount = amount === "max" ? 999 : parseInt(amount);
    setAmountPerPage(newAmount);
    queryClient.invalidateQueries({ queryKey: ["recipe-cookable"] });
    queryClient.invalidateQueries({ queryKey: ["recipe-not-cookable"] });
    queryClient.invalidateQueries({ queryKey: ["filtered-recipes"] });
  };

  const hasActiveFilters = selectedTags.length > 0 || isFavorite;

  if (isLoading) {
    return <Loading />;
  }

  if (isError && error) {
    return <ErrorMessage error={error as Error} title="Error loading tags" />;
  }

  return (
    <div className="mt-3 flex max-h-[calc(100%-4rem)] flex-col gap-4 overflow-y-auto pr-2 md:gap-6">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="border-primary text-primary hover:bg-primary hover:text-customWhite flex items-center justify-center gap-2 rounded-full border-2 px-4 py-2 text-sm transition-colors md:text-base"
        >
          <X size={16} className="md:h-[18px] md:w-[18px]" />
          Clear all filters
        </button>
      )}

      {/* Tags Filter */}
      <div>
        <label className="mb-3 flex items-center gap-2 text-sm font-medium md:text-base">
          <Tag size={16} className="md:h-[18px] md:w-[18px]" />
          Filter by tags
        </label>
        <div className="flex flex-wrap gap-2">
          {data &&
            data.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  setSelectedTags((prev) =>
                    prev.includes(tag.name)
                      ? prev.filter((t) => t !== tag.name)
                      : [...prev, tag.name],
                  );
                }}
                className={`cursor-pointer rounded-full border-2 px-3 py-2 text-xs transition-colors md:px-4 md:text-sm ${
                  selectedTags.includes(tag.name)
                    ? "bg-primary text-customWhite border-primary"
                    : "bg-customWhite border-customGrayLight hover:border-primary"
                }`}
              >
                {tag.name}
              </button>
            ))}
        </div>
      </div>

      {/* Favorite Filter */}
      <div>
        <label className="mb-3 flex items-center gap-2 text-sm font-medium md:text-base">
          <Star size={16} className="md:h-[18px] md:w-[18px]" />
          Show only favorites
        </label>
        <button
          onClick={() => setIsFavorite((prev) => !prev)}
          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 px-4 py-3 text-sm transition-colors md:w-auto md:px-5 md:text-base ${
            isFavorite
              ? "bg-primary text-customWhite border-primary"
              : "bg-customWhite border-customGrayLight hover:border-primary"
          }`}
        >
          <Star
            size={16}
            className="md:h-[18px] md:w-[18px]"
            fill={isFavorite ? "currentColor" : "none"}
          />
          {isFavorite ? "Favorites only" : "All recipes"}
        </button>
      </div>

      {/* Amount per page */}
      <div className="pb-2">
        <label className="mb-3 block text-sm font-medium md:text-base">
          Items per page
        </label>
        <div className="flex flex-wrap gap-2">
          {amountOptions.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountPerPageChange(amount)}
              className={`min-w-12 cursor-pointer rounded-full border-2 px-4 py-2 text-sm transition-colors md:min-w-14 md:px-5 ${
                amountPerPage === (amount === "max" ? 999 : parseInt(amount))
                  ? "bg-primary text-customWhite border-primary"
                  : "bg-customWhite border-customGrayLight hover:border-primary"
              }`}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecipeFilterPopup;
