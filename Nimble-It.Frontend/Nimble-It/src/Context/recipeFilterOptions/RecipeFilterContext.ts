import { createContext, Dispatch, SetStateAction } from "react";

export const RecipeFilterContext = createContext<
  RecipeFilterContextInterface | undefined
>(undefined);

interface RecipeFilterContextInterface {
  cookablePage: number;
  notCookablePage: number;
  filteredPage: number;
  amountPerPage: number;
  selectedTags: string[];
  isFavorite: boolean;
  setCookablePage: Dispatch<SetStateAction<number>>;
  setNotCookablePage: Dispatch<SetStateAction<number>>;
  setFilteredPage: Dispatch<SetStateAction<number>>;
  setAmountPerPage: Dispatch<SetStateAction<number>>;
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
  setIsFavorite: Dispatch<SetStateAction<boolean>>;
}
