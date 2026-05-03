import { Field, ErrorMessage } from "formik";

function CreateRecipeDescriptionInput() {
  return (
    <div className="bg-customWhite flex w-full flex-col gap-4 self-center rounded-2xl px-5 py-5 shadow-md md:max-w-2/3 xl:max-w-1/2">
      <h2 className="font-bold">Description</h2>
      <Field
        as="textarea"
        name="description"
        placeholder="Describe your recipe..."
        rows={4}
        className="border-customGrayLight bg-customWhite w-full resize-none rounded-2xl border-2 px-4 py-3 text-sm outline-none"
      />
      <ErrorMessage
        name="description"
        component="div"
        className="text-primary text-sm"
      />
    </div>
  );
}

export default CreateRecipeDescriptionInput;
