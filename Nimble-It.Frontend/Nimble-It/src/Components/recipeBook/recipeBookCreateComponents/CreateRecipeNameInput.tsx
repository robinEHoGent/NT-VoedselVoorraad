import { Field, ErrorMessage } from "formik";

function CreateRecipeNameInput() {
  return (
    <div className="col-span-full place-self-center">
      <Field
        name="name"
        type="text"
        placeholder="Recipe Name"
        className="border-customGrayLight bg-customWhite w-fit rounded-full border-2 px-3 py-2 text-center text-xl outline-none lg:text-2xl 2xl:text-4xl"
      />
      <ErrorMessage
        name="name"
        component="div"
        className="text-primary mt-1 text-center text-sm"
      />
    </div>
  );
}

export default CreateRecipeNameInput;
