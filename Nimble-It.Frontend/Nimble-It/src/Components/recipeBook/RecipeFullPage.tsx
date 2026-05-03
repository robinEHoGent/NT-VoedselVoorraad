import { useNavigate, useParams } from "react-router-dom";
import FavoriteSVG from "./FavoriteSVG";
import viteLogo from "/vite.svg";
import { Clock, Edit, Minus, Plus, Settings, Trash2Icon } from "lucide-react";
import CtaButton from "../buttons/CtaButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GetRecipeById,
  DeleteRecipe,
  UpdateLastCooked,
  ToggleFavorite,
} from "@/Api/apiCallsRecipe";
import { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import NotFound from "@/UI/NotFound";
import ErrorMessage from "@/UI/ErrorMessage";
import Loading from "@/UI/Loading";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import DeleteConfirmationPopup from "../pop-ups/DeleteConfirmationPopup";

enum Complexity {
  Easy = 1,
  Medium = 2,
  Hard = 3,
}

function RecipeFullPage() {
  const [servingSize, setServingSize] = useState<number>(1);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLElement>(null);
  const queryClient = useQueryClient();

  const {
    isLoading,
    data: recipe,
    error,
    isError,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => GetRecipeById(Number(id)),
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000,
  });

  useGSAP(() => {
    if (containerRef.current && recipe) {
      gsap.from(".recipe-content", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [recipe]);

  useEffect(() => {
    if (recipe) {
      setServingSize(recipe.servingSize);
    }
  }, [recipe]);

  const handleIncreaseServing = () => {
    setServingSize((prev) => prev + 1);
  };

  const handleDecreaseServing = () => {
    setServingSize((prev) => Math.max(1, prev - 1));
  };

  const deleteMutation = useMutation({
    mutationFn: DeleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe-cookable"] });
      queryClient.invalidateQueries({ queryKey: ["recipe-not-cookable"] });
      queryClient.invalidateQueries({ queryKey: ["filtered-recipes"] });
      queryClient.invalidateQueries({ queryKey: ["totalCookable"] });
      queryClient.invalidateQueries({ queryKey: ["totalNotCookable"] });
      queryClient.invalidateQueries({ queryKey: ["totalFiltered"] });
      toast.success("Recipe deleted successfully!", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => navigate("/recipe-book"), 1000);
    },
    onError: () => {
      toast.error("Failed to delete recipe. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const updateLastCookedMutation = useMutation({
    mutationFn: UpdateLastCooked,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      toast.success("Recipe marked as cooked!", {
        duration: 3000,
        position: "top-center",
      });
    },
    onError: () => {
      toast.error("Failed to update recipe. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: ToggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      queryClient.invalidateQueries({ queryKey: ["recipe-cookable"] });
      queryClient.invalidateQueries({ queryKey: ["recipe-not-cookable"] });
      queryClient.invalidateQueries({ queryKey: ["filtered-recipes"] });
      queryClient.invalidateQueries({ queryKey: ["totalFiltered"] });
      toast.success("Favorite status updated!", {
        duration: 2000,
        position: "top-center",
      });
    },
    onError: () => {
      toast.error("Failed to update favorite. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const handleDeleteRecipe = () => {
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(Number(id));
    setShowDeletePopup(false);
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return <NotFound />;
    }
    return <ErrorMessage error={error} title="Error loading recipe" />;
  }

  if (!recipe) {
    return <NotFound />;
  }

  return (
    <section ref={containerRef}>
      <Toaster />
      {/* navigate back button */}
      <button onClick={() => navigate("/recipe-book")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute top-5 left-3 size-10 cursor-pointer"
        >
          <path
            fillRule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Background Blob */}
      <div className="bg-image-recipe-red absolute top-40 left-0 h-80 w-full bg-cover bg-top bg-no-repeat xl:bg-position-[0rem_5rem]"></div>

      {/* Content */}
      <div className="recipe-content relative flex flex-col">
        <div className="absolute -top-3 right-2 overflow-hidden">
          <FavoriteSVG
            className={` ${recipe.favorite && "text-primary"} size-16 rotate-30`}
            active={recipe.favorite!}
            big={true}
          />
        </div>

        {/* image */}
        <div className="bg-bg flex aspect-square w-3/5 self-center rounded-full md:w-2/5 lg:w-1/5">
          <img
            src={viteLogo}
            alt={recipe.name}
            className="h-full w-full object-cover select-none"
            draggable="false"
          />
        </div>

        {/* info */}
        <section className="bg-bg flex -translate-y-5 flex-col gap-y-2 rounded-t-[8rem] px-5 pt-10 xl:gap-x-5 xl:rounded">
          <h1 className="col-span-full place-self-center text-xl lg:text-2xl 2xl:text-4xl">
            {recipe.name}
          </h1>
          <div className="flex max-w-1/2 flex-wrap justify-center gap-2 self-center">
            {recipe.tags.map((tag) => (
              <h2 key={tag.id} className="px-3 py-2 text-gray-500">
                {tag.name}
              </h2>
            ))}
          </div>

          <div className="bg-customWhite grid h-full w-full grid-cols-3 place-items-center self-center rounded-2xl py-5 shadow-md md:max-w-2/3 xl:max-w-1/2">
            {/* complexity */}
            <div className="flex flex-col items-center gap-2">
              <Settings />
              <h2>Difficulty</h2>
              <h2 className="p-2">{Complexity[recipe.complexity]}</h2>
            </div>

            {/* servings */}
            <div className="flex flex-col items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>

              <h2>Servings</h2>

              <div className="bg-bg border-customGrayMedium/50 flex gap-4 rounded-full border p-2">
                <Minus
                  className="cursor-pointer"
                  onClick={handleDecreaseServing}
                />
                <h2>{servingSize}</h2>
                <Plus
                  className="cursor-pointer"
                  onClick={handleIncreaseServing}
                />
              </div>
            </div>

            {/* time */}
            <div className="flex flex-col items-center gap-2">
              <Clock />
              <h2>Time</h2>
              <h2 className="p-2">{recipe.prepareTime} min</h2>
            </div>
          </div>

          {/* description */}
          <div className="bg-customWhite flex w-full flex-col gap-4 self-center rounded-2xl px-5 py-5 shadow-md md:max-w-2/3 xl:max-w-1/2">
            <h2 className="font-bold">Description</h2>
            <h3 className="text-customGrayMedium">{recipe.description}</h3>
          </div>

          {/* ingredients */}
          {recipe.parts.map((part) => (
            <div
              key={part.partId}
              className="bg-customWhite flex w-full flex-col gap-4 self-center rounded-2xl px-5 py-5 shadow-md md:max-w-2/3 xl:max-w-1/2"
            >
              <h2 className="font-bold">Ingredients for the {part.title}</h2>
              {part.products.map((product) => {
                const scaledAmount =
                  (product.amount / recipe.servingSize) * servingSize;
                const displayAmount = Number.isInteger(scaledAmount)
                  ? scaledAmount
                  : scaledAmount.toFixed(2);
                return (
                  <div
                    key={product.productId}
                    className="grid grid-cols-[1fr_2fr_auto] items-center gap-4"
                  >
                    <h3>
                      {displayAmount} {product.uomName}
                    </h3>
                    <h3>{product.productName}</h3>
                    <img
                      src={viteLogo}
                      alt={product.productName}
                      className="h-10 w-10 object-contain select-none"
                      draggable="false"
                    />
                  </div>
                );
              })}
            </div>
          ))}

          {/* intructions */}
          <div className="bg-customWhite flex w-full flex-col gap-4 self-center rounded-2xl px-5 py-5 shadow-md md:max-w-2/3 xl:max-w-1/2">
            <h2 className="font-bold">Instructions</h2>

            {recipe.instructions.map((instruction) => (
              <div className="flex gap-4">
                <h2>{instruction.step}.</h2>
                <div className="flex flex-col gap-2">
                  <h2>{instruction.header}</h2>
                  <p className="text-customGrayMedium">{instruction.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* extra info */}
          <div className="bg-customWhite flex w-full flex-col items-center justify-center gap-4 self-center rounded-2xl px-5 py-5 shadow-md md:max-w-2/3 xl:max-w-1/2">
            <Clock />
            <div className="flex w-full justify-evenly">
              <div className="flex flex-col items-center">
                <h3>Created on</h3>
                <h2>{recipe.createdOn}</h2>
              </div>

              <div className="flex flex-col items-center">
                <h3>Last Cooked</h3>
                <h2>
                  {recipe.lastCooked ? recipe.lastCooked : "Not cooked yet"}
                </h2>
              </div>
            </div>

            <CtaButton
              onClick={() =>
                !updateLastCookedMutation.isPending &&
                updateLastCookedMutation.mutate(Number(id))
              }
              className="xl:w-1/2!"
            >
              {updateLastCookedMutation.isPending
                ? "Updating..."
                : "Mark as cooked"}
            </CtaButton>
          </div>

          {/* edits */}
          <div className="bg-customWhite flex w-full items-center justify-evenly gap-4 self-center rounded-2xl px-5 py-5 shadow-md md:max-w-2/3 xl:max-w-1/2">
            <button
              onClick={() =>
                !toggleFavoriteMutation.isPending &&
                toggleFavoriteMutation.mutate(Number(id))
              }
              className="cursor-pointer"
            >
              <FavoriteSVG
                className={`size-6 ${recipe.favorite && "text-primary"}`}
                active={recipe.favorite!}
              />
            </button>
            <Edit
              className="cursor-pointer"
              onClick={() => navigate(`/recipe/${id}/edit`)}
            />
            <Trash2Icon
              className="cursor-pointer transition-colors hover:text-red-500"
              onClick={handleDeleteRecipe}
            />
          </div>

          {/* leftovers */}
          <div className="bg-customWhite flex w-full flex-col items-center justify-evenly gap-4 self-center rounded-2xl px-5 py-5 shadow-md md:max-w-2/3 xl:max-w-1/2">
            <h2>Got any leftovers ?</h2>
            <CtaButton className="xl:w-1/2!">Add to inventory</CtaButton>
          </div>
        </section>
      </div>

      {showDeletePopup &&
        createPortal(
          <div className="bg-bg border-secondary fixed top-1/2 left-1/2 z-50 flex min-w-4/5 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl border-2 px-4 py-2 text-center shadow-md md:min-w-1/2">
            <DeleteConfirmationPopup
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
              isPending={deleteMutation.isPending}
            />
          </div>,
          document.body,
        )}
    </section>
  );
}

export default RecipeFullPage;
