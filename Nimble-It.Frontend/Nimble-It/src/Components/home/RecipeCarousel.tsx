import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import SmallRecipeCard from "@/Components/recipeBook/SmallRecipeCard";
import EmptyRecipe from "@/Components/recipeBook/EmptyRecipe";
import Autoplay from "embla-carousel-autoplay";

interface RecipeCarouselProps {
  title: string;
  recipes: RecipesContract[];
}

const RecipeCarousel: React.FC<RecipeCarouselProps> = ({ title, recipes }) => {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [
    Autoplay({ delay: 5000 }),
  ]);

  if (!recipes.length) {
    return <EmptyRecipe />;
  }

  return (
    <div className="overflow-visible" ref={emblaRef}>
      <div className="flex gap-1">
        {recipes.map((recipe) => (
          <div key={recipe.recipeId}>
            <SmallRecipeCard
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
                  </div>
                ))}
      </div>
    </div>
  );
};

export default RecipeCarousel;
