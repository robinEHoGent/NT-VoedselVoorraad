import LinkButton from "@/Components/buttons/LinkButton";
import HomeSection from "@/Components/home/HomeSection";
import { useInventoryData } from "@/Hooks/useInventoryData";
import { useRecipeQueries } from "@/Hooks/useRecipeQueries";
import { useSpecialRecipeQueries } from "@/Hooks/useSpecialRecipeQueries";
import Loading from "@/UI/Loading";
import NotFound from "@/UI/NotFound";
import ErrorMessage from "@/UI/ErrorMessage";
import { AxiosError } from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

function HomePage() {
  const containerRef = useRef<HTMLElement>(null);

  const { expiringCount } = useInventoryData();

  const {
    isLoadingCookable,
    cookable,
    cookableError,
    isCookableError,
    isLoadingNotCookable,
    notCookable,
    notCookableError,
    isNotCookableError,
    totalCookableRecipes,
  } = useRecipeQueries({
    cookablePage: 1,
    notCookablePage: 1,
    amountPerPage: 8,
    filteredPage: 1,
  });

  const {
    isLoadingFavorites,
    favorite,
    favoriteError,
    isFavoriteError,
    isLoadingLastCooked,
    lastCooked,
    lastCookedError,
    isLastCookedError,
  } = useSpecialRecipeQueries({ filteredPage: 1, amountPage: 8 });

  useGSAP(() => {
    if (
      containerRef.current &&
      (cookable || notCookable || favorite || lastCooked)
    ) {
      gsap.from(".home-section", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [cookable, notCookable, favorite, lastCooked]);

  const hasError =
    isCookableError ||
    isNotCookableError ||
    isFavoriteError ||
    isLastCookedError;
  const firstError = (
    isCookableError
      ? cookableError
      : isNotCookableError
        ? notCookableError
        : isFavoriteError
          ? favoriteError
          : lastCookedError
  ) as Error | null;
  const isLoading =
    isLoadingCookable ||
    isLoadingNotCookable ||
    isLoadingFavorites ||
    isLoadingLastCooked;

  if (hasError && firstError) {
    if (
      firstError instanceof AxiosError &&
      firstError.response?.status === 404
    ) {
      return <NotFound />;
    }
    return <ErrorMessage error={firstError} title="Error loading home page" />;
  }

  return (
    <section
      ref={containerRef}
      className="relative z-1 flex flex-col gap-5 overflow-hidden px-5"
    >
      <h1 className="drop-shadow-customBlack mt-6 self-center text-6xl drop-shadow-xs">
        NIMBLE IT
      </h1>
      <div className="mt-6 items-center self-center text-center">
        <h2 className="text-2xl">Welcome!</h2>
        <p className="text-customGrayMedium whitespace-pre-line md:whitespace-normal">
          {`You can cook ${totalCookableRecipes ? totalCookableRecipes.count : 0} meals right now with
        what's in your kitchen.`}
        </p>
      </div>
      <LinkButton to="/expires-soon" className="mb-2 md:self-center">
        (Almost) Expired Items: {expiringCount > 0 ? expiringCount : 0}
      </LinkButton>
      {isLoading ? (
        <Loading />
      ) : (
        <HomeSection title={"cookable"} recipes={cookable} />
      )}

      {/* Background Blob  */}
      <div className="bg-image-recipe-yellow absolute -left-[5vw] -z-1 h-full w-[140vw] scale-x-[-1] bg-size-[100%_auto] bg-center bg-no-repeat sm:-left-[30vw] sm:w-[180vw] sm:scale-y-[0.7] sm:bg-size-[70%_auto] md:-left-[55vw] md:w-[220vw] md:bg-size-[50%_auto] xl:-left-[180vw] xl:w-[450vw] xl:scale-x-[-1.75] xl:bg-size-[20%_auto] 2xl:scale-x-[-3] 2xl:bg-size-[10%_auto]"></div>

      {isLoading ? (
        <Loading />
      ) : (
        <HomeSection title={"not cookable"} recipes={notCookable} />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <HomeSection title={"favorite"} recipes={favorite} />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <HomeSection title={"recently cooked"} recipes={lastCooked} />
      )}
    </section>
  );
}

export default HomePage;
