/// <reference types="vite/client" />

interface InventoryDataContract {
  categories: CategoryContractWithProducts[];
}

interface CategoryRequestContract {
  categoryName: string;
  notificationTime: number;
}

interface CategoryContract extends CategoryRequestContract {
  categoryId: number;
}

interface CategoryContractWithProducts extends CategoryContract {
  products: ProductContractWithInventory[];
}

interface ProductContractWithInventory extends ProductContract {
  inventory: InventoryItemContract[];
}

interface InventoryItemContract {
  inventoryId: number;
  amount: number;
  purchaseDate: string;
  expiryDate: string;
  storageTypeName: string;
  isExpiringSoon?: boolean;
}

interface ProductContract {
  productId: number;
  productName: string;
  uomName: string;
  imageUrl?: string;
}

interface ProductRequestContract {
  productName: string;
  categoryId: number;
  uomId: number;
  imageFile?: File;
  imageUrl?: string;
}

interface RecipesContract {
  recipeId: number;
  name: string;
  description: string;
  image?: string;
  cookable?: boolean;
}

interface RecipeFullInfoContract extends Omit<RecipesContract, "cookable"> {
  tags: TagsContract[];
  servingSize: number;
  complexity: number;
  prepareTime: number;
  parts: RecipePart[];
  instructions: {
    id: number;
    step: number;
    header: string;
    text: string;
  }[];
  createdOn: string;
  lastCooked?: string;
  favorite?: boolean;
}

interface RecipePart {
  partId: number;
  title: string;
  products: {
    amount: number;
    productId: number;
    productName: string;
    uomName: string;
    imageUrl?: string;
  }[];
}

interface TagsContract {
  id: number;
  name: string;
}

interface TagRequestContract {
  name: string;
}

interface StorageTypeContract {
  storageTypeId: number;
  storageTypeName: string;
}

interface StorageTypeRequest {
  storageTypeName: string;
}

interface RecipeFormValues {
  name: string;
  description: string;
  image: File | null;
  tags: number[];
  servingSize: number;
  complexity: number;
  prepareTime: number;
  recipeParts: {
    title: string;
    products: {
      productId: number;
      amount: number;
    }[];
  }[];
  instructions: {
    step: string;
    header: string;
    text: string;
  }[];
}

interface ShoppingListItem {
  id: number;
  product: {
    productId: number;
    productName: string;
    uomName: string;
  };
  amount: number;
  checked: boolean;
}

interface UnitOfMeasurementRequestContract {
  unit: string;
}

interface UnitOfMeasurementContract extends UnitOfMeasurementRequestContract {
  id: number;
}

interface CreateShoppingListItem {
  productId: number;
  amount: number;
}

interface ShoppingListItemsContract {
  shoppingListItems: ShoppingListItem[];
}

interface InventoryRequestContract {
  ProductId: number;
  Amount: number;
  PurchaseDate?: string;
  ExpiryDate: string;
  StorageTypeName: string;
}

interface InventoryResponseContract {
  InventoryId: number;
  ProductId: number;
  Amount: number;
  PurchaseDate?: string;
  ExpiryDate: string;
  StorageTypeName: string;
  ProductName: string;
  CategoryName: string;
  UnitOfMeasurement: string;
  ImageUrl: string;
}
