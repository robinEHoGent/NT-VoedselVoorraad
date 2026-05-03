import SearchButton from "../buttons/SearchButton";
import { ChangeEvent, useEffect, useState } from "react";
import { GetAllProducts } from "@/Api/apiCallsProducts";
import { Button } from "../ui/button";

interface AddItemToShoppingListProps {
  onCancel: () => void;
  onConfirm: (product: ProductContract) => void;
}

function AddItemToShoppingList({
  onCancel,
  onConfirm,
}: AddItemToShoppingListProps) {
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<ProductContract[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<
    ProductContract | undefined
  >();

  const onProductSelected = (e: ChangeEvent<HTMLSelectElement>) => {
    const productId = parseInt(e.target.value);
    const product = products.find((p) => p.productId === productId);

    if (product) {
      setSelectedProduct(product);
    }
  };

  useEffect(() => {
    GetAllProducts()
      .then((products) => {
        setProducts(products);
      })
      .catch((e) => {
        console.log(`Something went wrong getting all products. ${e}`);
      });
  }, []);

  const filteredBySearchTerm = (product: ProductContract) => {
    return product.productName.toLowerCase().includes(search.toLowerCase());
  };

  return (
    <>
      {products.length > 0 && (
        <div className="grid-col-1 grid gap-4">
          <SearchButton search={search} setSearch={setSearch}></SearchButton>
          <select onChange={onProductSelected}>
            <option>Choose a product</option>
            {products
              .filter((p) => filteredBySearchTerm(p))
              .map((p) => (
                <option
                  key={p.productId}
                  value={p.productId}
                >{`${p.productName} (unit: ${p.uomName})`}</option>
              ))}
          </select>
          <div className="flex flex-row justify-around gap-4">
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              onClick={() => {
                if (selectedProduct) {
                  onConfirm(selectedProduct);
                }
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default AddItemToShoppingList;
