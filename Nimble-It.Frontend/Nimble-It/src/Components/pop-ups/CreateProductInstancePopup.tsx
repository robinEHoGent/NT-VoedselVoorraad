import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import Input from "../ui/input";
import { GetAllCategoriesSimple } from "../../Api/apiCallsCategories";
import { GetAllUnitsSimple } from "../../Api/apiCallsUnits";
import { AddCategory } from "../../Api/apiCallsCategories";
import { AddUnitOfMeasurement } from "../../Api/apiCallsUnits";
import { AddProduct } from "../../Api/apiCallsProducts";

interface CreateProductInstancePopupProps {
  open: boolean;
  onClose: () => void;
  initialCategoryName?: string;
}

interface FormValues {
  productName: string;
  categoryName: string;
  newCategoryName: string;
  uom: string;
  newUom: string;
  image: string;
  newImage: File | null;
}

const CreateProductInstancePopup: React.FC<CreateProductInstancePopupProps> = ({
  open,
  onClose,
  initialCategoryName,
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [expandCategory, setExpandCategory] = useState(false);
  const [expandUnit, setExpandUnit] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [savingCategory, setSavingCategory] = useState(false);
  const [savingUnit, setSavingUnit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const validationSchema = Yup.object({
    productName: Yup.string().required("Product name is required"),
    categoryName: Yup.string().required("Category is required"),
    uom: Yup.string().required("Unit of measurement is required"),
  });

  const { data: categories = [] } = useQuery<CategoryContract[]>({
    queryKey: ["categories-simple"],
    queryFn: GetAllCategoriesSimple,
  });

  const { data: uoms = [] } = useQuery<UnitOfMeasurementContract[]>({
    queryKey: ["units-simple"],
    queryFn: GetAllUnitsSimple,
  });

  const addCategoryMutation = useMutation({
    mutationFn: (
      category: CategoryRequestContract,
    ): Promise<CategoryContract> => AddCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleAddCategory = async (
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    if (!value) return;

    setSavingCategory(true);
    addCategoryMutation.mutate(
      { categoryName: value, notificationTime: 0 },
      {
        onSuccess: () => {
          setFieldValue("categoryName", value);
          setFieldValue("newCategoryName", "");
          setExpandCategory(false);
          setSavingCategory(false);
        },
        onError: () => setSavingCategory(false),
      },
    );
  };

  const addUomMutation = useMutation({
    mutationFn: (
      uom: UnitOfMeasurementRequestContract,
    ): Promise<UnitOfMeasurementContract> => AddUnitOfMeasurement(uom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });

  const handleAddUnit = async (
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    if (!value) return;

    setSavingUnit(true);
    addUomMutation.mutate(
      { unit: value },
      {
        onSuccess: () => {
          setFieldValue("uom", value);
          setFieldValue("newUom", "");
          setExpandUnit(false);
          setSavingUnit(false);
        },
        onError: () => setSavingUnit(false),
      },
    );
  };

  const addProductMutation = useMutation({
    mutationFn: ({
      product,
      requireImage,
    }: {
      product: ProductRequestContract;
      requireImage: boolean;
    }): Promise<ProductContract> => AddProduct(product, requireImage),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleAddProduct = async (
    values: FormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    const selectedCategory = categories.find(
      (c) => c.categoryName === values.categoryName,
    );
    const selectedUom = uoms.find((u) => u.unit === values.uom);

    if (!selectedCategory?.categoryId || !selectedUom?.id) return;

    addProductMutation.mutate(
      {
        product: {
          productName: values.productName,
          categoryId: selectedCategory.categoryId,
          uomId: selectedUom.id,
          imageUrl: values.image || undefined,
          imageFile: values.newImage || undefined,
        },
        requireImage: !!values.newImage,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            onClose();
          }, 1500);
          resetForm();
          setImagePreview(null);
          setExpandCategory(false);
          setExpandUnit(false);
        },
        onError: () => {
          setError(true);
          setTimeout(() => setError(false), 2000);
        },
      },
    );
  };

  if (!open) return null;

  return createPortal(
    <div className="scrollbar-thin scrollbar-thumb-[#FF6B4A] scrollbar-track-[#FFF] border-primary bg-customWhite fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border-2 shadow-2xl">
      <button
        onClick={onClose}
        className="border-primary bg-primary text-customWhite absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all hover:scale-110 hover:rotate-90"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="from-primary/10 to-primary/5 border-primary/20 border-b bg-gradient-to-br px-6 pt-6 pb-4">
        <h2 className="text-primary mb-3 text-2xl font-bold">
          Add New Product
        </h2>
        {imagePreview && (
          <div className="flex justify-center">
            <div className="border-primary relative overflow-hidden rounded-2xl border-2 shadow-md">
              <img
                src={imagePreview}
                alt="preview"
                className="h-32 w-32 object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <Formik
        initialValues={{
          productName: "",
          categoryName: initialCategoryName || "",
          newCategoryName: "",
          uom: "",
          newUom: "",
          image: "",
          newImage: null as File | null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleAddProduct}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-5 p-6">
            {/* Product Name */}
            <div>
              <label className="text-customGrayDark mb-2 block text-sm font-semibold">
                Product Name <span className="text-primary">*</span>
              </label>
              <Field
                as={Input}
                name="productName"
                placeholder="e.g., Tomatoes, Flour, Olive Oil"
                className="border-primary/30 hover:border-primary focus:border-primary w-full rounded-xl border-2 px-4 py-3 transition-colors outline-none"
              />
            </div>

            {/* Category dropdown */}
            <div>
              <label className="text-customGrayDark mb-2 block text-sm font-semibold">
                Category <span className="text-primary">*</span>
              </label>
              <div className="flex items-start gap-2">
                <Field
                  as="select"
                  name="categoryName"
                  className="border-primary/30 bg-customWhite hover:border-primary focus:border-primary flex-1 rounded-xl border-2 px-4 py-3 transition-colors outline-none"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue("categoryName", e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryName}>
                      {c.categoryName}
                    </option>
                  ))}
                </Field>
                <Button
                  type="button"
                  className="bg-primary hover:bg-primary/90 text-customWhite h-[50px] w-12 shrink-0 rounded-xl transition-all"
                  onClick={() => setExpandCategory(!expandCategory)}
                >
                  {expandCategory ? "-" : "+"}
                </Button>
              </div>

              {expandCategory && (
                <div className="bg-primary/5 mt-3 flex gap-2 rounded-xl p-3">
                  <Field
                    as={Input}
                    name="newCategoryName"
                    placeholder="New category name"
                    className="border-primary/30 hover:border-primary focus:border-primary flex-1 rounded-xl border-2 px-4 py-2 transition-colors outline-none"
                  />
                  <Button
                    type="button"
                    className="bg-primary hover:bg-primary/90 text-customWhite h-auto rounded-xl px-4 transition-colors"
                    disabled={savingCategory}
                    onClick={() =>
                      handleAddCategory(values.newCategoryName, setFieldValue)
                    }
                  >
                    {savingCategory ? "..." : "Add"}
                  </Button>
                </div>
              )}
            </div>

            {/* Unit dropdown */}
            <div>
              <label className="text-customGrayDark mb-2 block text-sm font-semibold">
                Unit of Measurement <span className="text-primary">*</span>
              </label>
              <div className="flex items-start gap-2">
                <Field
                  as="select"
                  name="uom"
                  className="border-primary/30 hover:border-primary bg-customWhite focus:border-primary flex-1 rounded-xl border-2 px-4 py-3 transition-colors outline-none"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue("uom", e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select unit
                  </option>
                  {uoms.map((u) => (
                    <option key={u.id} value={u.unit}>
                      {u.unit}
                    </option>
                  ))}
                </Field>
                <Button
                  type="button"
                  className="bg-primary hover:bg-primary/90 text-customWhite h-[50px] w-12 shrink-0 rounded-xl transition-all"
                  onClick={() => setExpandUnit(!expandUnit)}
                >
                  {expandUnit ? "-" : "+"}
                </Button>
              </div>

              {expandUnit && (
                <div className="bg-primary/5 mt-3 flex gap-2 rounded-xl p-3">
                  <Field
                    as={Input}
                    name="newUom"
                    placeholder="New unit (e.g., kg, pieces)"
                    className="border-primary/30 hover:border-primary focus:border-primary flex-1 rounded-xl border-2 px-4 py-2 transition-colors outline-none"
                  />
                  <Button
                    type="button"
                    className="bg-primary hover:bg-primary/90 text-customWhite h-auto rounded-xl px-4 transition-colors"
                    disabled={savingUnit}
                    onClick={() => handleAddUnit(values.newUom, setFieldValue)}
                  >
                    {savingUnit ? "..." : "Add"}
                  </Button>
                </div>
              )}
            </div>

            {/* Image upload */}
            <div>
              <label className="text-customGrayDark mb-2 block text-sm font-semibold">
                Product Image
              </label>
              <div className="border-primary/30 hover:border-primary relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  ref={fileInputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.currentTarget.files?.[0] ?? null;

                    setFieldValue("newImage", file);
                    setFieldValue("image", "");

                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      setImagePreview(previewUrl);
                    } else {
                      setImagePreview(null);
                      setFieldValue("newImage", null);
                    }
                  }}
                />
                <div className="text-customGrayDark pointer-events-none">
                  {imagePreview ? (
                    <p className="text-sm">
                      ✓ Image selected - Click to change
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium">
                        Click to upload an image
                      </p>
                      <p className="text-customGrayLight text-xs">
                        PNG, JPG up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                className="border-primary/30 text-customGrayDark hover:bg-customGrayLight/20 flex-1 rounded-xl border-2 bg-transparent py-3 font-semibold transition-colors"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-customWhite flex-1 rounded-xl py-3 font-semibold shadow-lg transition-all disabled:opacity-50"
                disabled={addProductMutation.isPending}
              >
                {addProductMutation.isPending ? "Adding..." : "Add Product"}
              </Button>
            </div>

            {success && (
              <div className="bg-primary text-customWhite animate-fadeIn rounded-xl p-3 text-center font-medium">
                ✓ Product added successfully!
              </div>
            )}

            {error && (
              <div className="animate-fadeIn rounded-xl bg-red-500 p-3 text-center font-medium text-white">
                ✗ Failed to add product. Please try again.
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>,
    document.body,
  );
};

export default CreateProductInstancePopup;
