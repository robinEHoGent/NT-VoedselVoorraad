import { RecipeFilterContext } from "@/Context/recipeFilterOptions/RecipeFilterContext";
import { useContext } from "react";

const useRecipeFilter = () => {
  const context = useContext(RecipeFilterContext);

  if (!context)
    throw new Error(
      "useRecipeFilter must be used within a RecipeFilterProvider",
    );

  return context;
};

export default useRecipeFilter;
