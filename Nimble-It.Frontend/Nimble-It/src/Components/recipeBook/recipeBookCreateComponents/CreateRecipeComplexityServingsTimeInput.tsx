import { Field, FieldProps } from "formik";
import { Clock, Settings, Minus, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

function CreateRecipeComplexityServingsTimeInput() {
  return (
    <div className="bg-customWhite grid w-full grid-cols-3 place-items-center gap-4 self-center rounded-2xl p-5 shadow-md md:max-w-2/3 xl:max-w-1/2">
      {/* complexity */}
      <div className="flex flex-col items-center gap-2">
        <Settings className="size-5" />
        <h2 className="text-sm font-medium">Difficulty</h2>
        <Field name="complexity">
          {({ field, form }: FieldProps<number>) => (
            <Select
              value={field.value.toString()}
              onValueChange={(value) =>
                form.setFieldValue("complexity", parseInt(value))
              }
            >
              <SelectTrigger
                size="sm"
                className="bg-customWhite border-customGrayLight h-8 w-24 rounded-full border-2 text-xs md:w-36"
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Beginner</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="3">Hard</SelectItem>
              </SelectContent>
            </Select>
          )}
        </Field>
      </div>

      {/* servings */}
      <div className="flex flex-col items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>

        <h2 className="text-sm font-medium">Servings</h2>

        <Field name="servingSize">
          {({ field, form }: FieldProps<number>) => (
            <div className="bg-customWhite border-customGrayLight flex h-8 w-24 items-center justify-between rounded-full border-2 px-2 md:w-36">
              <button
                type="button"
                onClick={() =>
                  form.setFieldValue(
                    "servingSize",
                    Math.max(1, field.value - 1),
                  )
                }
              >
                <Minus className="size-3 cursor-pointer" />
              </button>
              <h2 className="text-sm">{field.value}</h2>
              <button
                type="button"
                onClick={() =>
                  form.setFieldValue("servingSize", field.value + 1)
                }
              >
                <Plus className="size-3 cursor-pointer" />
              </button>
            </div>
          )}
        </Field>
      </div>

      {/* time */}
      <div className="flex flex-col items-center gap-2">
        <Clock className="size-5" />
        <h2 className="text-sm font-medium">Time</h2>
        <Field name="prepareTime">
          {({ field, form }: FieldProps<number>) => (
            <Select
              value={field.value.toString()}
              onValueChange={(value) =>
                form.setFieldValue("prepareTime", parseInt(value))
              }
            >
              <SelectTrigger
                size="sm"
                className="bg-customWhite border-customGrayLight h-8 w-24 rounded-full border-2 text-xs md:w-36"
              >
                <SelectValue placeholder="Time?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="180">3 hours</SelectItem>
              </SelectContent>
            </Select>
          )}
        </Field>
      </div>
    </div>
  );
}

export default CreateRecipeComplexityServingsTimeInput;
