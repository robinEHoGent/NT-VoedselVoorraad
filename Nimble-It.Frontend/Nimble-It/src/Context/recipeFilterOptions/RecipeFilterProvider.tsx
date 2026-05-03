import { PropsWithChildren, useState, useEffect } from "react";
import { RecipeFilterContext } from "./RecipeFilterContext";

const STORAGE_KEY = "recipeAmountPerPage";

function RecipeFilterProvider({ children }: PropsWithChildren) {
  const [cookablePage, setCookablePage] = useState<number>(1);
  const [notCookablePage, setNotCookablePage] = useState<number>(1);
  const [filteredPage, setFilteredPage] = useState<number>(1);
  const [amountPerPage, setAmountPerPage] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored) : 4;
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, amountPerPage.toString());
  }, [amountPerPage]);

  return (
    <RecipeFilterContext.Provider
      value={{
        cookablePage,
        notCookablePage,
        filteredPage,
        amountPerPage,
        selectedTags,
        isFavorite,
        setAmountPerPage,
        setCookablePage,
        setNotCookablePage,
        setFilteredPage,
        setSelectedTags,
        setIsFavorite,
      }}
    >
      {children}
    </RecipeFilterContext.Provider>
  );
}

export default RecipeFilterProvider;
