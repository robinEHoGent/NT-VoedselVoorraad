import { useRef, useState } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import * as Yup from "yup";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/Components/ui/button";
import Input from "@/Components/ui/input";
import {
  GetAllProducts,
  AddProduct,
  GetAllImages,
} from "../../Api/apiCallsProducts";
import { GetAllCategories, AddCategory } from "../../Api/apiCallsCategories";
import { GetAllUnits, AddUnitOfMeasurement } from "../../Api/apiCallsUnits";
import { GetAllStorageTypes, AddStorageType } from "../../Api/apiCallsStorage";
import { AddInventoryItem } from "../../Api/apiCallsInventory";
import { AxiosError } from "axios";

const validationSchema = Yup.object({
  productName: Yup.string().when("newProductName", {
    is: (val: string) => !val || val.length === 0,
    then: (schema) => schema.required("Select a product or add a new one"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newProductName: Yup.string(),
  categoryName: Yup.string(),
  newCategoryName: Yup.string(),
  uom: Yup.string(),
  newUom: Yup.string(),
  image: Yup.string(),
  newImage: Yup.mixed<File>()
    .nullable()
    .test(
      "fileType",
      "Unsupported file format",
      (value) =>
        !value ||
        ["image/jpeg", "image/png", "image/webp"].includes(value.type),
    ),
  quantity: Yup.number()
    .required("Quantity is required")
    .positive("Quantity must be positive"),
  storagetype: Yup.string(),
  newStoragetype: Yup.string(),
  expiryDate: Yup.string().required("Expiration date is required"),
  purchaseDate: Yup.string(),
});

interface AddProductPopupProps {
  open: boolean;
  onClose: () => void;
  initialCategoryName?: string;
}

const AddProductPopup = ({
  open,
  onClose,
  initialCategoryName,
}: AddProductPopupProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // expand to add new items
  const [expandProduct, setExpandProduct] = useState(false);
  const [expandStorage, setExpandStorage] = useState(false);
  const [expandCategory, setExpandCategory] = useState(false);
  const [expandUnit, setExpandUnit] = useState(false);
  const [expandImage, setExpandImage] = useState(false);

  // states for api calls
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingUnit, setSavingUnit] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingStorage, setSavingStorage] = useState(false);

  // data imports
  const retryConfig = (failureCount: number, error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return false;
    }
    return failureCount < 1;
  };

  const { data: products = [] } = useQuery<ProductContract[]>({
    queryKey: ["products"],
    queryFn: () => GetAllProducts(),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  const { data: categories = [] } = useQuery<CategoryContract[]>({
    queryKey: ["categories"],
    queryFn: () => GetAllCategories(),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  const { data: uoms = [] } = useQuery<UnitOfMeasurementContract[]>({
    queryKey: ["units"],
    queryFn: () => GetAllUnits(),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  const { data: storageTypes = [] } = useQuery<StorageTypeContract[]>({
    queryKey: ["storageTypes"],
    queryFn: GetAllStorageTypes,
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  const { data: images = [] } = useQuery<string[]>({
    queryKey: ["product-images"],
    queryFn: () => GetAllImages(),
    retry: retryConfig,
    staleTime: 5 * 60 * 1000,
  });

  // mutations + handleclick
  const queryClient = useQueryClient();

  const addCategoryMutation = useMutation({
    mutationFn: (
      category: CategoryRequestContract,
    ): Promise<CategoryContract> => AddCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleAddCategory = async (value: string, setFieldValue: any) => {
    if (!value) return;

    setSavingCategory(true);
    addCategoryMutation.mutate(
      { categoryName: value, notificationTime: 7 },
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

  const handleAddUnit = async (value: string, setFieldValue: any) => {
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

  const addStorageMutation = useMutation({
    mutationFn: (storage: StorageTypeRequest): Promise<StorageTypeContract> =>
      AddStorageType(storage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storageTypes"] });
    },
  });

  const handleAddStorage = async (value: string, setFieldValue: any) => {
    if (!value) return;

    setSavingStorage(true);
    addStorageMutation.mutate(
      { storageTypeName: value },
      {
        onSuccess: () => {
          setFieldValue("storagetype", value);
          setFieldValue("newStoragetype", "");
          setExpandStorage(false);
          setSavingStorage(false);
        },
        onError: () => setSavingStorage(false),
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleAddProduct = async (values: any, setFieldValue: any) => {
    if (!values.newProductName) return;

    setSavingProduct(true);

    const selectedCategory = categories.find(
      (c) => c.categoryName === values.categoryName,
    );
    const selectedUom = uoms.find((u) => u.unit === values.uom);

    if (!selectedCategory?.categoryId || !selectedUom?.id) return;

    addProductMutation.mutate(
      {
        product: {
          productName: values.newProductName,
          categoryId: selectedCategory.categoryId,
          uomId: selectedUom.id,
          imageUrl: values.image || undefined,
          imageFile: values.newImage || undefined,
        },
        requireImage: !!values.newImage,
      },
      {
        onSuccess: (product: ProductContract) => {
          setFieldValue("productName", product.productName);
          setFieldValue("newProductName", "");
          setExpandProduct(false);
          setSavingProduct(false);
        },
        onError: () => setSavingProduct(false),
      },
    );
  };

  const addInventoryMutation = useMutation({
    mutationFn: (
      inventory: InventoryRequestContract,
    ): Promise<InventoryResponseContract> => AddInventoryItem(inventory),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  const handleAddInventory = async (values: any, { resetForm }: any) => {
    const selectedProduct = products.find(
      (p) => p.productName === values.productName,
    );

    if (
      !selectedProduct?.productId ||
      !values.quantity ||
      !values.expiryDate ||
      !values.storagetype
    )
      return;

    addInventoryMutation.mutate(
      {
        ProductId: selectedProduct.productId,
        Amount: Number(values.quantity),
        PurchaseDate: values.purchaseDate || undefined,
        ExpiryDate: values.expiryDate,
        StorageTypeName: values.storagetype,
      },
      {
        onSuccess: () => {
          toast.success("Product added successfully!");
          resetForm();
          onClose();
        },
        onError: () => {
          toast.error("Failed to add product");
        },
      },
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="scrollbar-thin scrollbar-thumb-[#FF6B4A] scrollbar-track-[#FFF] border-primary bg-customWhite relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border-2 p-4 shadow-md">
        <button
          onClick={onClose}
          className="border-primary bg-primary text-customWhite absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex flex-col items-center">
          <span className="mb-2 text-lg font-bold">Add item to inventory</span>
          <div className="border-primary bg-customWhite mb-4 flex min-h-24 w-full flex-col items-center justify-center rounded-xl border-2 p-2">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                className="h-24 w-24 rounded object-cover"
              />
            ) : (
              <span className="text-customGrayDark text-base">
                Image preview will appear here after selecting a product
              </span>
            )}
          </div>
        </div>

        <Formik
          initialValues={{
            productName: "",
            newProductName: "",
            categoryName: initialCategoryName || "",
            newCategoryName: "",
            uom: "",
            newUom: "",
            image: "",
            newImage: null as File | null,
            quantity: 0,
            storagetype: "",
            newStoragetype: "",
            expiryDate: "",
            purchaseDate: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddInventory}
        >
          {({ values, setFieldValue, errors }) => (
            <Form>
              <FieldArray name="products">
                {() => (
                  <>
                    <div className="border-primary bg-customWhite mb-4 rounded-xl border-2 p-4">
                      {/* Product Name */}
                      <div className="mb-2">
                        <label className="mb-1 block text-sm font-medium">
                          Product Name *
                        </label>
                        <div className="mb-1 flex items-center gap-2">
                          <Field
                            as="select"
                            name="productName"
                            className="border-primary bg-customWhite w-full rounded border-2 px-2 py-1"
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setFieldValue("productName", e.target.value);

                              const selected = products.find(
                                (p) => p.productName === e.target.value,
                              );
                              setImagePreview(selected?.imageUrl ?? null);
                              setFieldValue("newImage", null);
                            }}
                          >
                            <option value="" disabled>
                              Select product
                            </option>
                            {products.map((p) => (
                              <option key={p.productId} value={p.productName}>
                                {p.productName}
                              </option>
                            ))}
                          </Field>

                          {!expandProduct ? (
                            <Button
                              type="button"
                              className="bg-primary ml-1 h-8 w-8 rounded-full p-0"
                              onClick={() => setExpandProduct(true)}
                            >
                              +
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              className="bg-primary ml-1 h-8 w-8 rounded-full p-0"
                              onClick={() => {
                                setExpandProduct(false);
                                setExpandCategory(false);
                                setExpandUnit(false);
                              }}
                            >
                              -
                            </Button>
                          )}
                        </div>
                        {errors.productName && (
                          <p className="text-customRed pt-2 text-sm font-semibold">
                            {errors.productName}
                          </p>
                        )}

                        {expandProduct && (
                          <div>
                            <Field
                              as={Input}
                              name="newProductName"
                              placeholder="Add new product name"
                              className="border-primary mt-2 w-full rounded border-2 px-2 py-1"
                            />

                            {/* Category dropdown using options */}
                            <div className="mt-2">
                              <label className="mb-1 block text-sm font-medium">
                                - Category *
                              </label>
                              <div className="mb-1 flex items-center gap-2">
                                <Field
                                  as="select"
                                  name="categoryName"
                                  className="border-primary bg-customWhite w-full rounded border-2 px-2 py-1"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>,
                                  ) => {
                                    setFieldValue(
                                      "categoryName",
                                      e.target.value,
                                    );
                                  }}
                                >
                                  <option value="" disabled>
                                    Select category
                                  </option>
                                  {categories.map((c) => (
                                    <option
                                      key={c.categoryId}
                                      value={c.categoryName}
                                    >
                                      {c.categoryName}
                                    </option>
                                  ))}
                                </Field>
                                {!expandCategory ? (
                                  <Button
                                    type="button"
                                    className="bg-primary ml-1 h-8 w-8 rounded-full p-0"
                                    onClick={() => setExpandCategory(true)}
                                  >
                                    +
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    className="bg-primary ml-1 h-8 w-8 rounded-full p-0"
                                    onClick={() => setExpandCategory(false)}
                                  >
                                    -
                                  </Button>
                                )}
                              </div>
                            </div>

                            {expandCategory && (
                              <div className="mt-2 flex justify-between gap-2">
                                <Field
                                  as={Input}
                                  name="newCategoryName"
                                  placeholder="Add new category"
                                  className="border-primary mt-2 w-full rounded border-2 px-2 py-1"
                                />
                                <Button
                                  type="button"
                                  className="bg-primary ml-1 h-8 w-16 rounded-full p-0"
                                  disabled={savingCategory}
                                  onClick={() =>
                                    handleAddCategory(
                                      values.newCategoryName,
                                      setFieldValue,
                                    )
                                  }
                                >
                                  Add
                                </Button>
                              </div>
                            )}

                            {/* Unit dropdown using options */}
                            <div className="mt-2">
                              <label className="mb-1 block text-sm font-medium">
                                - Unit of Measurement *
                              </label>
                              <div className="mb-1 flex items-center gap-2">
                                <Field
                                  as="select"
                                  name="uom"
                                  className="border-primary bg-customWhite w-full rounded border-2 px-2 py-1"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>,
                                  ) => {
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
                                {!expandUnit ? (
                                  <Button
                                    type="button"
                                    className="bg-primary ml-1 h-8 w-8 rounded-full p-0"
                                    onClick={() => setExpandUnit(true)}
                                  >
                                    +
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    className="bg-primary ml-1 h-8 w-8 rounded-full p-0"
                                    onClick={() => setExpandUnit(false)}
                                  >
                                    -
                                  </Button>
                                )}
                              </div>
                            </div>

                            {expandUnit && (
                              <div className="mt-2 flex justify-between gap-2">
                                <Field
                                  as={Input}
                                  name="newUom"
                                  placeholder="Add new measurement"
                                  className="border-primary mt-2 w-full rounded border-2 px-2 py-1"
                                />
                                <Button
                                  type="button"
                                  className="bg-primary ml-1 h-8 w-16 rounded-full p-0"
                                  disabled={savingUnit}
                                  onClick={() =>
                                    handleAddUnit(values.newUom, setFieldValue)
                                  }
                                >
                                  Add
                                </Button>
                              </div>
                            )}

                            {/* Image dropdown */}
                            <div className="mt-2">
                              <label className="mb-1 block text-sm font-medium">
                                - Choose image
                              </label>
                              <div className="mb-1 flex items-center gap-2">
                                <Field
                                  as="select"
                                  name="image"
                                  className="border-primary bg-customWhite w-full rounded border-2 px-2 py-1"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>,
                                  ) => {
                                    setFieldValue("image", e.target.value);
                                    setImagePreview(e.target.value || null);
                                    setFieldValue("newImage", null);
                                    setExpandImage(false);
                                  }}
                                >
                                  <option value="" disabled>
                                    Select image
                                  </option>
                                  {images.map((i) =>
                                    i ? <option value={i}>{i}</option> : null,
                                  )}
                                </Field>
                                {!expandImage ? (
                                  <Button
                                    type="button"
                                    className="bg-primary ml-1 h-8 w-8 rounded-full p-0"
                                    onClick={() => setExpandImage(true)}
                                  >
                                    +
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    className="bg-primary ml-1 h-8 w-8 rounded-full p-0"
                                    onClick={() => setExpandImage(false)}
                                  >
                                    -
                                  </Button>
                                )}
                              </div>

                              {expandImage && (
                                <div className="mt-2 flex flex-col justify-between gap-2">
                                  <label className="mb-1 block text-sm font-medium">
                                    - Choose new image
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                      const file =
                                        e.currentTarget.files?.[0] ?? null;

                                      setFieldValue("newImage", file);
                                      setFieldValue("image", "");

                                      if (file) {
                                        const previewUrl =
                                          URL.createObjectURL(file);
                                        setImagePreview(previewUrl);
                                      } else {
                                        setImagePreview(null);
                                        setFieldValue("newImage", null);
                                      }
                                    }}
                                  />
                                  {errors.newImage && (
                                    <p className="text-customRed pt-2 text-sm font-semibold">
                                      {errors.newImage}
                                    </p>
                                  )}
                                  <Button
                                    className="bg-primary mb-2 ml-1 h-8 w-32 rounded-full p-0"
                                    onClick={() =>
                                      fileInputRef.current?.click()
                                    }
                                  >
                                    Choose new image
                                  </Button>
                                </div>
                              )}

                              <Button
                                type="button"
                                className="bg-primary mt-1 ml-1 h-8 w-45 rounded-full p-0"
                                disabled={savingProduct}
                                onClick={() =>
                                  handleAddProduct(values, setFieldValue)
                                }
                              >
                                Add new product
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="mb-2">
                        <label className="mb-1 block text-sm font-medium">
                          Quantity *
                        </label>
                        <Field
                          as={Input}
                          name="quantity"
                          type="number"
                          placeholder="Value"
                          className="border-primary w-full rounded border-2 px-2 py-1"
                        />
                        {errors.quantity && (
                          <p className="text-customRed pt-2 text-sm font-semibold">
                            {errors.quantity}
                          </p>
                        )}
                      </div>

                      {/* Storage */}
                      <div className="mb-2">
                        <label className="mb-2 block text-sm font-medium">
                          Storage Location *
                        </label>
                        <div className="flex items-center gap-2">
                          <Field
                            as="select"
                            name="storagetype"
                            className="border-primary bg-customWhite w-full rounded border-2 px-2 py-1"
                          >
                            <option value="" disabled>
                              Select storage
                            </option>
                            {storageTypes.map((s) => (
                              <option
                                key={s.storageTypeId}
                                value={s.storageTypeName}
                              >
                                {s.storageTypeName}
                              </option>
                            ))}
                          </Field>
                          {!expandStorage ? (
                            <Button
                              type="button"
                              className="bg-primary ml-1 h-8 w-8 rounded-full p-0"
                              onClick={() => setExpandStorage(true)}
                            >
                              +
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              className="bg-primary ml-1 h-8 w-8 rounded-full p-0"
                              onClick={() => setExpandStorage(false)}
                            >
                              -
                            </Button>
                          )}
                        </div>
                      </div>

                      {expandStorage && (
                        <div className="mt-2 flex gap-2">
                          <Field
                            as={Input}
                            name="newStoragetype"
                            placeholder="Add new storage location"
                            className="border-primary mt-2 w-full rounded border-2 px-2 py-1"
                          />
                          <Button
                            type="button"
                            className="bg-primary ml-1 h-8 w-16 rounded-full p-0"
                            disabled={savingStorage}
                            onClick={() =>
                              handleAddStorage(
                                values.newStoragetype,
                                setFieldValue,
                              )
                            }
                          >
                            Add
                          </Button>
                        </div>
                      )}

                      {/* Dates */}
                      <div className="mb-2">
                        <label className="mb-1 block text-sm font-medium">
                          Expiration Date *
                        </label>
                        <Field
                          as={Input}
                          name="expiryDate"
                          type="date"
                          className="border-primary w-full rounded border-2 px-2 py-1"
                        />
                        {errors.expiryDate && (
                          <p className="text-customRed pt-2 text-sm font-semibold">
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>
                      <div className="mb-2">
                        <label className="mb-1 block text-sm font-medium">
                          Purchase Date
                        </label>
                        <Field
                          as={Input}
                          name="purchaseDate"
                          type="date"
                          className="border-primary w-full rounded border-2 px-2 py-1"
                        />
                      </div>
                    </div>
                  </>
                )}
              </FieldArray>
              <Button
                type="submit"
                className="bg-primary text-customWhite mt-2 w-full rounded-full py-3 text-lg font-bold"
              >
                Add Product
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProductPopup;
