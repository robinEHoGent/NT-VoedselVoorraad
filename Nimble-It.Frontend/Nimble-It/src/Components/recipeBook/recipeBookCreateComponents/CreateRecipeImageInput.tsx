import { ImagePlus } from "lucide-react";
import { useState } from "react";

function CreateRecipeImageInput({
  setFieldValue,
}: CreateRecipeImageInputProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <div className="bg-bg relative flex aspect-square w-3/5 self-center rounded-full md:w-2/5 lg:w-1/5">
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFieldValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
              setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        }}
      />
      <label
        htmlFor="image-upload"
        className="flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full"
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Recipe preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <ImagePlus className="text-customGrayMedium size-20" />
        )}
      </label>
    </div>
  );
}

interface CreateRecipeImageInputProps {
  setFieldValue: (field: string, value: File | null) => void;
}

export default CreateRecipeImageInput;
