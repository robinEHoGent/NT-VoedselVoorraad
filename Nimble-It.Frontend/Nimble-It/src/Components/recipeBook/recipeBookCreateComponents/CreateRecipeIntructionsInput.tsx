import { Field, FieldArray, ErrorMessage } from "formik";
import { ChefHat, Trash2 } from "lucide-react";

function CreateRecipeInstructionsInput({
  instructions,
}: CreateRecipeInstructionsInputProps) {
  return (
    <section className="flex w-full flex-col gap-4 self-center px-5 md:max-w-2/3 xl:max-w-1/2">
      <div className="flex items-center gap-3">
        <ChefHat className="size-6" />
        <h2 className="text-xl font-bold">Instructions</h2>
      </div>

      <FieldArray name="instructions">
        {({ push: pushInstruction, remove: removeInstruction }) => (
          <>
            {instructions.map((_, index) => (
              <div
                key={index}
                className="bg-customWhite rounded-2xl p-4 shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Step {index + 1}</h3>
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="text-primary hover:text-customRed cursor-pointer"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <Field
                      name={`instructions.${index}.header`}
                      placeholder="Step title"
                      className="border-customGrayLight bg-customWhite w-full rounded-full border-2 px-4 py-2 text-center text-sm outline-none"
                    />
                    <ErrorMessage
                      name={`instructions.${index}.header`}
                      component="div"
                      className="text-primary mt-1 text-xs"
                    />
                  </div>

                  <div>
                    <Field
                      as="textarea"
                      name={`instructions.${index}.text`}
                      placeholder="Describe this step in detail..."
                      rows={4}
                      className="border-customGrayLight bg-customWhite w-full resize-none rounded-2xl border-2 px-4 py-3 text-sm outline-none"
                    />
                    <ErrorMessage
                      name={`instructions.${index}.text`}
                      component="div"
                      className="text-primary mt-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const nextStep = (instructions.length + 1).toString();
                pushInstruction({
                  step: nextStep,
                  header: "",
                  text: "",
                });
              }}
              className="border-primary text-primary hover:bg-primary bg-customWhite hover:text-customWhite cursor-pointer rounded-2xl border-2 px-5 py-4 text-sm font-bold shadow-md transition-colors"
            >
              Add Instruction
            </button>
          </>
        )}
      </FieldArray>
    </section>
  );
}

interface CreateRecipeInstructionsInputProps {
  instructions: {
    step: string;
    header: string;
    text: string;
  }[];
}

export default CreateRecipeInstructionsInput;
