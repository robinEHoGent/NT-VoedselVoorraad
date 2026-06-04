import SmallRecipeCard from "@/Components/recipeBook/SmallRecipeCard";
import EmptyRecipe from "@/Components/recipeBook/EmptyRecipe";
import Pagination from "@/Components/recipeBook/Pagination";

interface RecipeSectionProps {
  title: string;
  recipes: RecipesContract[] | undefined;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function RecipeSection({
  title,
  recipes,
  currentPage,
  totalPages,
  onPageChange,
}: RecipeSectionProps) {
  return (
    <div className="recipe-section flex flex-col gap-5">
      <h2 className="bg-secondary border-bg w-fit rounded-full border-2 px-5 py-2 text-xl">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <SmallRecipeCard
              variant="home"
              key={recipe.recipeId}
              id={recipe.recipeId}
              title={recipe.name}
              description={recipe.description}
              imageUrl={recipe.image}
              cookable={
                title === "cookable"
                  ? true
                  : title === "not cookable"
                    ? false
                    : recipe.cookable
              }
            />
          ))
        ) : (
          <EmptyRecipe />
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default RecipeSection;
