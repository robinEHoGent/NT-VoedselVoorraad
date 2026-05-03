import RecipeCarousel from "./RecipeCarousel";

interface HomeSectionProps {
  title: string;
  recipes: RecipesContract[] | undefined;
}

function HomeSection({ title, recipes }: HomeSectionProps) {
  return (
    <div className="home-section flex flex-col gap-5">
      <h2 className="bg-secondary border-bg w-fit rounded-full border-2 px-5 py-2 text-xl">
        {title}
      </h2>
      {recipes && <RecipeCarousel recipes={recipes} title={title} />}
    </div>
  );
}

export default HomeSection;
