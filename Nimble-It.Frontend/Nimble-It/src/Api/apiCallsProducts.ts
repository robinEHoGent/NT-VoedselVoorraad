import apiClient from "./apiClient";

export async function GetAllProducts(): Promise<ProductContract[]> {
  const response = await apiClient.get<ProductContract[]>("product");
  return response.data;
}

export async function DeleteProduct(ProductId: number): Promise<void> {
  await apiClient.delete<ProductContract>(`product/${ProductId}`);
}

export async function AddProduct(
  product: ProductRequestContract,
  requireImage: boolean,
): Promise<ProductContract> {
  const formData = new FormData();
  formData.append("productName", product.productName);
  formData.append("categoryId", product.categoryId.toString());
  formData.append("uomId", product.uomId.toString());
  if (product.imageFile) {
    // nieuwe image
    formData.append("imageFile", product.imageFile);
  } else if (product.imageUrl) {
    // bestaande image
    formData.append("imageUrl", product.imageUrl);
  }
  const response = await apiClient.post<ProductContract>("product", formData, {
    params: {
      requireImage,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function GetAllImages(): Promise<string[]> {
  const response = await apiClient.get<string[]>("product/images");
  return response.data;
}
