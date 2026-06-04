import LinkButton from "../buttons/LinkButton";
import CtaButton from "../buttons/CtaButton";
import { ShoppingCart } from "lucide-react";
import viteLogo from "/vite.svg";

function SmallRecipeCard({
  id,
  title,
  description,
  imageUrl = viteLogo,
  cookable,
  variant = "default",
}: SmallRecipeCardProps) {
  const isHome = variant === "home";

  return (
    <div
      className={`bg-bg group relative flex h-full min-h-64 w-[90vw] flex-col overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl sm:w-[45vw] md:w-[47vw] xl:w-[23vw] ${
        cookable === false
          ? "border-customGrayMedium opacity-90 hover:opacity-100"
          : "border-primary hover:-translate-y-1"
      } ${isHome ? "hover:shadow-primary/15 hover:shadow-xl" : ""}`}
    >
      {/* Recipe Image */}
      <div
        className={`relative h-32 w-full sm:h-36 ${isHome ? "px-4 pt-3" : ""}`}
      >
        <div
          className={
            isHome
              ? "relative h-full w-full overflow-hidden rounded-2xl shadow-[0_3px_14px_rgba(19,4,2,0.12)] transition-shadow duration-300 group-hover:shadow-[0_6px_22px_rgba(255,99,71,0.22)]"
              : "relative h-full w-full overflow-hidden"
          }
        >
          <img
            src={imageUrl}
            alt={title}
            className={`h-full w-full select-none transition-transform duration-500 ease-out ${
              isHome
                ? `object-contain object-center group-hover:scale-[1.03] ${
                    cookable === false
                      ? "grayscale-[0.25] group-hover:grayscale-0"
                      : ""
                  }`
                : "object-contain duration-300 group-hover:scale-105"
            }`}
            draggable="false"
          />
          {cookable === false && (
            <div
              className={`bg-customGrayDark/90 absolute z-10 rounded-full px-3 py-1 text-xs font-medium text-white shadow-md backdrop-blur-sm ${
                isHome ? "right-2.5 bottom-2.5" : "right-2 bottom-2"
              }`}
            >
              Missing Ingredients
            </div>
          )}
        </div>
      </div>

      {/* Recipe Content */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <h3 className="line-clamp-2 text-lg font-semibold sm:text-xl">
          {title}
        </h3>
        <p className="text-customGrayMedium line-clamp-3 flex-1 text-sm">
          {description}
        </p>

        <div className="mt-auto flex flex-col gap-2">
          <LinkButton className="w-full!" to={`/recipe/${id}`}>
            View Recipe
          </LinkButton>
          {cookable === false && (
            <CtaButton className="flex w-full! items-center justify-center gap-2 text-xs sm:text-sm">
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Add to Shopping List</span>
              <span className="sm:hidden">Add to List</span>
            </CtaButton>
          )}
        </div>
      </div>
    </div>
  );
}

interface SmallRecipeCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  cookable?: boolean;
  variant?: "default" | "home";
}

export default SmallRecipeCard;
