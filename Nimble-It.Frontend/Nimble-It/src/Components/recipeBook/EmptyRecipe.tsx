import { ImageOff } from "lucide-react";
import LinkButton from "../buttons/LinkButton";

function EmptyRecipe() {
  return (
    <div className="bg-bg border-primary mt-5 flex w-[90vw] items-center overflow-hidden rounded-2xl border-2 shadow-md sm:w-[45vw] md:w-[47vw] xl:w-[23vw]">
      <div className="bg-bg text-primary flex aspect-square grow items-center justify-center rounded-lg">
        <ImageOff className="h-12 w-12" strokeWidth={1.5} />
      </div>

      <div className="flex flex-2 flex-col justify-start gap-3 rounded-lg p-5">
        <h3 className="text-xl">No Results</h3>
        <p className="text-md">Add a recipe ?</p>
        <LinkButton
          to="/recipe/create"
          className="bg-primary! text-customWhite! w-full!"
        >
          Add recipe
        </LinkButton>
      </div>
    </div>
  );
}

export default EmptyRecipe;
