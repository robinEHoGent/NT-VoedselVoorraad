import { Field, FieldArray, FieldProps, ErrorMessage } from "formik";
import { Trash2, X } from "lucide-react";
import CtaButton from "@/Components/buttons/CtaButton";
import { useState } from "react";
import CreateProductInstancePopup from "@/Components/pop-ups/CreateProductInstancePopup";

function CreateRecipeIngredientsInput({
  recipeParts,
  data,
}: CreateRecipeIngredientsInputProps) {
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({});
  const [showSuggestions, setShowSuggestions] = useState<{
    [key: string]: boolean;
  }>({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const getFilteredProducts = (searchTerm: string) => {
    if (!searchTerm || !data) return [];
    return data.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  return (
    <FieldArray name="recipeParts">
      {({ push: pushPart, remove: removePart }) => (
        <>
          {recipeParts.map((part, partIndex) => (
            <div
              key={partIndex}
              className="bg-customWhite flex w-full flex-col gap-4 self-center rounded-2xl px-5 py-5 shadow-md md:max-w-2/3 xl:max-w-1/2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold">Ingredients for</h2>
                  <Field
                    name={`recipeParts.${partIndex}.title`}
                    placeholder="e.g., Main Dish, Sauce, Garnish"
                    className="bg-customWhite border-customGrayLight flex-1 rounded-full border-2 px-4 py-2 text-sm outline-none"
                  />
                  <ErrorMessage
                    name={`recipeParts.${partIndex}.title`}
                    component="div"
                    className="text-primary text-xs"
                  />
                </div>
                {recipeParts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePart(partIndex)}
                    className="text-primary hover:text-customRed cursor-pointer"
                  >
                    <Trash2 className="size-5" />
                  </button>
                )}
              </div>

              <FieldArray name={`recipeParts.${partIndex}.products`}>
                {({ push: pushProduct, remove: removeProduct }) => (
                  <>
                    {part.products.map((_, productIndex) => (
                      <div key={productIndex} className="flex flex-col gap-1">
                        <div className="grid grid-cols-[1fr_3fr_auto] items-center gap-2">
                          <Field
                            name={`recipeParts.${partIndex}.products.${productIndex}.amount`}
                          >
                            {({ field, form }: FieldProps<number>) => (
                              <input
                                id={field.name}
                                name={field.name}
                                type="number"
                                step="0.01"
                                placeholder="0"
                                value={field.value || ""}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : parseFloat(e.target.value);
                                  form.setFieldValue(field.name, value);
                                }}
                                onBlur={field.onBlur}
                                className="border-customGrayLight bg-customWhite h-9 w-full rounded-full border-2 px-3 text-center text-sm outline-none"
                              />
                            )}
                          </Field>
                          <Field
                            name={`recipeParts.${partIndex}.products.${productIndex}.productId`}
                          >
                            {({ field, form }: FieldProps<number>) => {
                              const key = `${partIndex}-${productIndex}`;
                              const currentSearchTerm = searchTerms[key] || "";
                              const filteredProducts =
                                getFilteredProducts(currentSearchTerm);
                              const selectedProduct = data?.find(
                                (p) => p.productId === field.value,
                              );

                              return (
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder="Search product..."
                                    value={
                                      selectedProduct && !showSuggestions[key]
                                        ? `${selectedProduct.productName} (${selectedProduct.uomName})`
                                        : currentSearchTerm
                                    }
                                    onChange={(e) => {
                                      setSearchTerms({
                                        ...searchTerms,
                                        [key]: e.target.value,
                                      });
                                      setShowSuggestions({
                                        ...showSuggestions,
                                        [key]: true,
                                      });
                                    }}
                                    onFocus={() => {
                                      setShowSuggestions({
                                        ...showSuggestions,
                                        [key]: true,
                                      });
                                    }}
                                    className="border-customGrayLight bg-customWhite h-9 w-full rounded-full border-2 px-3 text-sm outline-none"
                                  />
                                  {showSuggestions[key] &&
                                    currentSearchTerm &&
                                    filteredProducts.length > 0 && (
                                      <div className="border-customGrayLight bg-customWhite absolute top-full left-0 z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border-2 shadow-lg">
                                        {filteredProducts.map((product) => (
                                          <button
                                            key={product.productId}
                                            type="button"
                                            onClick={() => {
                                              form.setFieldValue(
                                                `recipeParts.${partIndex}.products.${productIndex}.productId`,
                                                product.productId,
                                              );
                                              form.setFieldValue(
                                                `recipeParts.${partIndex}.products.${productIndex}.name`,
                                                product.productName,
                                              );
                                              form.setFieldValue(
                                                `recipeParts.${partIndex}.products.${productIndex}.unit`,
                                                1,
                                              );
                                              setSearchTerms({
                                                ...searchTerms,
                                                [key]: "",
                                              });
                                              setShowSuggestions({
                                                ...showSuggestions,
                                                [key]: false,
                                              });
                                            }}
                                            className="hover:bg-primary/10 w-full px-3 py-2 text-left text-sm transition-colors"
                                          >
                                            {product.productName} (
                                            {product.uomName})
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                </div>
                              );
                            }}
                          </Field>
                          <button
                            type="button"
                            onClick={() => removeProduct(productIndex)}
                            className="hover:text-primary text-customGrayMedium cursor-pointer"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-[1fr_3fr_auto] gap-2">
                          <ErrorMessage
                            name={`recipeParts.${partIndex}.products.${productIndex}.amount`}
                            component="div"
                            className="text-primary text-center text-xs"
                          />
                          <ErrorMessage
                            name={`recipeParts.${partIndex}.products.${productIndex}.productId`}
                            component="div"
                            className="text-primary text-center text-xs"
                          />
                          <div></div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          pushProduct({
                            productId: 0,
                            name: "",
                            amount: 0,
                            unit: 0,
                          })
                        }
                        className="border-primary text-primary hover:bg-primary bg-customWhite hover:text-customWhite flex-1 cursor-pointer rounded-full border-2 px-4 py-2 text-sm transition-colors"
                      >
                        Add Ingredient
                      </button>
                      <CtaButton
                        className="w-auto!"
                        onClick={() => setIsPopupOpen(true)}
                      >
                        Add Product
                      </CtaButton>
                    </div>
                  </>
                )}
              </FieldArray>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              pushPart({
                title: "",
                products: [{ productId: 0, name: "", amount: 0, unit: 0 }],
              })
            }
            className="border-primary text-primary hover:bg-primary bg-customWhite hover:text-customWhite w-full cursor-pointer self-center rounded-2xl border-2 px-5 py-4 text-sm font-bold shadow-md transition-colors md:max-w-2/3 xl:max-w-1/2"
          >
            Add Ingredient List
          </button>
          {isPopupOpen && (
            <CreateProductInstancePopup
              open={isPopupOpen}
              onClose={() => setIsPopupOpen(false)}
            />
          )}
        </>
      )}
    </FieldArray>
  );
}

interface CreateRecipeIngredientsInputProps {
  recipeParts: {
    title: string;
    products: {
      productId: number;
      amount: number;
    }[];
  }[];
  data: ProductContract[] | undefined;
}

export default CreateRecipeIngredientsInput;
