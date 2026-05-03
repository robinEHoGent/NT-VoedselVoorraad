import { Formik, Form, ErrorMessage } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { GetAllProducts } from "@/Api/apiCallsProducts";
import {
  CreateRecipe,
  GetRecipeById,
  UpdateRecipe,
} from "@/Api/apiCallsRecipe";
import { AxiosError } from "axios";
import Loading from "@/UI/Loading";
import CreateRecipeImageInput from "./recipeBookCreateComponents/CreateRecipeImageInput";
import CreateRecipeNameInput from "./recipeBookCreateComponents/CreateRecipeNameInput";
import CreateRecipeTagsInput from "./recipeBookCreateComponents/CreateRecipeTagsInput";
import CreateRecipeComplexityServingsTimeInput from "./recipeBookCreateComponents/CreateRecipeComplexityServingsTimeInput";
import CreateRecipeDescriptionInput from "./recipeBookCreateComponents/CreateRecipeDescriptionInput";
import CreateRecipeIngredientsInput from "./recipeBookCreateComponents/CreateRecipeIngredientsInput";
import CreateRecipeInstructionsInput from "./recipeBookCreateComponents/CreateRecipeIntructionsInput";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const initialValues: RecipeFormValues = {
  name: "",
  description: "",
  image: null,
  tags: [],
  servingSize: 1,
  complexity: 1,
  prepareTime: 0,
  recipeParts: [
    {
      title: "",
      products: [{ productId: 0, amount: 0 }],
    },
  ],
  instructions: [{ step: "1", header: "", text: "" }],
};

function CreateRecipePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLElement>(null);
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();

  const { isPending, data } = useQuery<ProductContract[]>({
    queryKey: ["product"],
    queryFn: GetAllProducts,
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { isPending: isRecipeLoading, data: existingRecipe } =
    useQuery<RecipeFullInfoContract>({
      queryKey: ["recipe", id],
      queryFn: () => GetRecipeById(Number(id)),
      enabled: isEditMode,
      retry: (failureCount, error) => {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return false;
        }
        return failureCount < 1;
      },
      staleTime: 5 * 60 * 1000,
    });

  const mutation = useMutation({
    mutationFn: (values: RecipeFormValues) =>
      isEditMode ? UpdateRecipe(Number(id), values) : CreateRecipe(values),
    onSuccess: (data) => {
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ["recipe", id] });
        queryClient.invalidateQueries({ queryKey: ["recipe-cookable"] });
        queryClient.invalidateQueries({ queryKey: ["recipe-not-cookable"] });
        queryClient.invalidateQueries({ queryKey: ["filtered-recipes"] });
      }
      toast.success(
        isEditMode
          ? "Recipe updated successfully!"
          : "Recipe created successfully!",
        {
          duration: 3000,
          position: "top-center",
        },
      );
      navigate(`/recipe/${data.recipeId}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.message ||
          (isEditMode ? "Failed to update recipe" : "Failed to create recipe");
        toast.error(message, {
          duration: 5000,
          position: "top-center",
        });
      } else {
        toast.error(
          isEditMode
            ? "Failed to update recipe. Please try again."
            : "Failed to create recipe. Please try again.",
          {
            duration: 3000,
            position: "top-center",
          },
        );
      }
    },
  });

  useGSAP(() => {
    if (containerRef.current && data) {
      gsap.from(".form-content", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [data]);

  const handleSubmit = (values: RecipeFormValues) => {
    mutation.mutate(values);
  };

  // Create initial values from existing recipe if in edit mode
  const formInitialValues: RecipeFormValues =
    isEditMode && existingRecipe
      ? {
          name: existingRecipe.name,
          description: existingRecipe.description,
          image: null, // Will show existing image but not include it in form
          tags: existingRecipe.tags.map((tag) => tag.id),
          servingSize: existingRecipe.servingSize,
          complexity: existingRecipe.complexity,
          prepareTime: existingRecipe.prepareTime,
          recipeParts: existingRecipe.parts.map((part) => ({
            title: part.title,
            products: part.products.map((product) => ({
              productId: product.productId,
              amount: product.amount,
            })),
          })),
          instructions: existingRecipe.instructions.map((inst) => ({
            step: inst.step.toString(),
            header: inst.header,
            text: inst.text,
          })),
        }
      : initialValues;

  if (isPending || (isEditMode && isRecipeLoading)) {
    return <Loading />;
  }

  return (
    <section ref={containerRef}>
      <Toaster />
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, submitForm, validateForm }) => (
          <Form
            className="form-content flex flex-col gap-5"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          >
            {/* Background Blob */}
            <div className="bg-image-recipe-red absolute top-40 left-0 h-80 w-full bg-cover bg-top bg-no-repeat xl:bg-position-[0rem_5rem]"></div>

            {/* Image Upload */}
            <CreateRecipeImageInput setFieldValue={setFieldValue} />

            <section className="bg-bg flex -translate-y-10 flex-col gap-y-2 rounded-t-[8rem] px-5 pt-10 xl:gap-x-5 xl:rounded">
              {/* Recipe Name */}
              <CreateRecipeNameInput />

              {/* Tags */}
              <CreateRecipeTagsInput tags={values.tags} />

              {/* Info Grid: Complexity, Servings, Time */}
              <div className="flex flex-col gap-2">
                <CreateRecipeComplexityServingsTimeInput />
                <ErrorMessage
                  name="prepareTime"
                  component="div"
                  className="text-primary text-center text-xs"
                />
              </div>

              {/* description */}
              <CreateRecipeDescriptionInput />

              {/* ingredients */}
              <CreateRecipeIngredientsInput
                recipeParts={values.recipeParts}
                data={data}
              />
            </section>

            {/* Instructions */}
            <CreateRecipeInstructionsInput instructions={values.instructions} />

            {/* Submit and Cancel Buttons */}
            <div className="relative z-10 mb-10 flex w-full gap-3 self-center px-5 md:max-w-2/3 xl:max-w-1/2">
              <button
                type="button"
                onClick={() =>
                  isEditMode
                    ? navigate(`/recipe/${id}`, { replace: true })
                    : navigate("/recipe-book")
                }
                disabled={mutation.isPending}
                className="border-primary text-primary hover:bg-primary bg-customWhite hover:text-customWhite flex-1 cursor-pointer rounded-2xl border-2 px-6 py-4 text-lg font-bold shadow-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const validationErrors = await validateForm();
                  if (Object.keys(validationErrors).length > 0) {
                    toast.error("Please fill in all required fields", {
                      duration: 3000,
                      position: "top-center",
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                  submitForm();
                }}
                disabled={mutation.isPending}
                className="bg-primary hover:bg-primary/90 text-customWhite flex-1 cursor-pointer rounded-2xl px-6 py-4 text-lg font-bold shadow-lg transition-colors disabled:opacity-50"
              >
                {mutation.isPending
                  ? isEditMode
                    ? "Updating Recipe..."
                    : "Creating Recipe..."
                  : isEditMode
                    ? "Update Recipe"
                    : "Create Recipe"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}

export default CreateRecipePage;

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Recipe name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  image: Yup.mixed<File>().nullable(),
  tags: Yup.array().of(Yup.number()).min(1, "At least one tag is required"),
  servingSize: Yup.number()
    .required("Serving size is required")
    .min(1, "Serving size must be at least 1")
    .max(100, "Serving size must be less than 100"),
  complexity: Yup.number()
    .required("Complexity is required")
    .oneOf([1, 2, 3], "Please select a difficulty level"),
  prepareTime: Yup.number()
    .required("Preparation time is required")
    .min(1, "Preparation time must be at least 1 minute")
    .max(1440, "Preparation time must be less than 24 hours"),
  recipeParts: Yup.array()
    .of(
      Yup.object({
        title: Yup.string()
          .required("Part title is required")
          .max(100, "Title must be less than 100 characters"),
        products: Yup.array()
          .of(
            Yup.object({
              productId: Yup.number().required("Product is required"),
              amount: Yup.number()
                .required("Amount is required")
                .min(0.01, "Amount must be greater than 0"),
            }),
          )
          .min(1, "At least one product is required"),
      }),
    )
    .min(1, "At least one recipe part is required"),
  instructions: Yup.array()
    .of(
      Yup.object({
        step: Yup.string().required(),
        header: Yup.string()
          .required("Instruction header is required")
          .max(100, "Header must be less than 100 characters"),
        text: Yup.string()
          .required("Instruction text is required")
          .max(500, "Instruction must be less than 500 characters"),
      }),
    )
    .min(1, "At least one instruction step is required"),
});
