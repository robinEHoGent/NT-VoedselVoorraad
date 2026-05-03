import SearchButton from "@/Components/buttons/SearchButton";
import { ListFilter, X } from "lucide-react";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import LinkButton from "@/Components/buttons/LinkButton";
import RecipeSection from "@/Components/recipeBook/RecipeSection";
import { AxiosError } from "axios";
import NotFound from "@/UI/NotFound";
import ErrorMessage from "@/UI/ErrorMessage";
import Loading from "@/UI/Loading";
import useRecipeFilter from "@/Hooks/useRecipeFilter";
import { useRecipeQueries } from "@/Hooks/useRecipeQueries";
import RecipeFilterPopup from "@/Components/pop-ups/RecipeFilterPopup";

function RecipeBookPage() {
  const [search, setSearch] = useState<string>("");
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [filterState, setFilterState] = useState<boolean>(false);

  const {
    cookablePage,
    notCookablePage,
    filteredPage,
    amountPerPage,
    selectedTags,
    isFavorite,
    setCookablePage,
    setNotCookablePage,
    setFilteredPage,
  } = useRecipeFilter();

  const {
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
  } = useRecipeQueries({
    cookablePage,
    notCookablePage,
    filteredPage,
    amountPerPage,
    searchTerm: search || undefined,
    selectedTags: selectedTags.length > 0 ? selectedTags : undefined,
    isFavorite: isFavorite || undefined,
  });

  const handleFilterState = () => {
    setFilterState((prev) => !prev);
  };

  useGSAP(() => {
    if (!filterContainerRef.current) return;

    if (filterState) {
      gsap.to(filterContainerRef.current, {
        x: "-50%",
        y: "35%",
        left: "50%",
        top: "0",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(filterContainerRef.current, {
        x: "0%",
        y: "35%",
        left: "100%",
        top: "0",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [filterState]);

  useGSAP(() => {
    if (containerRef.current && (cookable || notCookable)) {
      gsap.from(".recipe-section", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.2,
        ease: "power2.out",
      });
    }
  }, [cookable, notCookable]);

  const hasError = isCookableError || isNotCookableError || isFilteredError;
  const firstError = (
    isCookableError
      ? cookableError
      : isNotCookableError
        ? notCookableError
        : filteredError
  ) as Error | null;
  const isLoading =
    isLoadingCookable || isLoadingNotCookable || isLoadingFiltered;

  if (hasError && firstError) {
    if (
      firstError instanceof AxiosError &&
      firstError.response?.status === 404
    ) {
      return <NotFound />;
    }
    return <ErrorMessage error={firstError} title="Error loading recipes" />;
  }

  const totalCookablePages = totalCookableRecipes
    ? Math.ceil(totalCookableRecipes.count / amountPerPage)
    : 0;
  const totalNotCookablePages = totalNotCookableRecipes
    ? Math.ceil(totalNotCookableRecipes.count / amountPerPage)
    : 0;
  const totalFilteredPages = totalFilteredRecipes
    ? Math.ceil(totalFilteredRecipes / amountPerPage)
    : 0;

  return (
    <section ref={containerRef} className="flex flex-col gap-5 px-5">
      {/* search & filter section */}
      <SearchButton search={search} setSearch={setSearch} />
      <div className="flex items-start justify-between gap-5">
        <div className="bg-primary border-bg text-customWhite flex aspect-square h-12 cursor-pointer items-center justify-center rounded-full border-2">
          {!filterState ? (
            <ListFilter onClick={handleFilterState} />
          ) : (
            <X onClick={handleFilterState} />
          )}
        </div>
        <LinkButton
          to="/recipe/create"
          className="bg-primary! text-customWhite!"
        >
          Add Recipe
        </LinkButton>
      </div>
      <div
        ref={filterContainerRef}
        className="bg-bg border-primary fixed left-full z-50 h-3/5 w-4/5 rounded-lg border-2 p-5 shadow-lg md:w-1/2 lg:w-1/3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl">Filters</h3>
          <X className="cursor-pointer" onClick={handleFilterState} size={24} />
        </div>

        {/* Filter content goes here */}
        <RecipeFilterPopup />
      </div>

      {/* recipies */}
      {isLoading ? (
        <Loading />
      ) : hasActiveFilters && filteredRecipes ? (
        <RecipeSection
          title="filtered recipes"
          recipes={filteredRecipes}
          currentPage={filteredPage}
          totalPages={totalFilteredPages}
          onPageChange={setFilteredPage}
        />
      ) : (
        <>
          <RecipeSection
            title="cookable"
            recipes={cookable}
            currentPage={cookablePage}
            totalPages={totalCookablePages}
            onPageChange={setCookablePage}
          />

          <RecipeSection
            title="not cookable"
            recipes={notCookable}
            currentPage={notCookablePage}
            totalPages={totalNotCookablePages}
            onPageChange={setNotCookablePage}
          />
        </>
      )}
    </section>
  );
}

export default RecipeBookPage;
