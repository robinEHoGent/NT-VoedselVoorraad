import SearchButton from "../Components/buttons/SearchButton";
import { useEffect, useState } from "react";
import NotFound from "@/UI/NotFound";
import { IoMdCheckmarkCircle } from "react-icons/io";
import CtaButton from "@/Components/buttons/CtaButton";
import ValueStepperButton from "@/Components/buttons/ValueStepperButton";
import { useShoppingListData } from "@/Hooks/useShoppingListData";
import Loading from "@/UI/Loading";
import { AxiosError } from "axios";
import ErrorMessage from "../UI/ErrorMessage";
import { useLocalStorage } from "@/Hooks/useLocalStorage";
import DeleteShoppingListItemPopup from "@/Components/pop-ups/DeleteShoppingListItemPopup";
import { useQueryClient } from "@tanstack/react-query";
import AddItemToShoppingList from "@/Components/pop-ups/AddItemToShoppingList";
import { AddShoppingListItem } from "@/Api/apiCallsShoppingList";
import { AddInventoryItem } from "@/Api/apiCallsInventory";

import { BsSend } from "react-icons/bs";
import SendMailPopup from "@/Components/pop-ups/SendMailPopup";
function ShoppingListPage() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [showSendMail, setShowSendMail] = useState(false);
  const [checkedItems, setCheckedItems] = useState<
    ShoppingListItemsContract | undefined
  >();
  const [showAddItemToShopping, setShowAddItemToShopping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();
  const [isAddingToInventory, setIsAddingToInventory] = useState(false);
  const [addInventoryError, setAddInventoryError] = useState<string>("");
  const checkedItemsList =
    checkedItems?.shoppingListItems.filter((i) => i.checked) || [];
  const [clickedTrashCan, setClickedTrashCan] = useState<{
    bool: boolean;
    id: number | undefined;
    productName: string;
    message?: string;
  }>({
    bool: false,
    id: undefined,
    productName: "",
    message: undefined,
  });
  const [storageValue, setStorageValue] = useLocalStorage(
    "myShoppingList",
    null,
  );
  const { isPending, data, error, isError } = useShoppingListData();
  useEffect(() => {
    if (storageValue) {
      setCheckedItems(JSON.parse(storageValue));
    } else if (data) {
      setCheckedItems(data);
    }
  }, [data, storageValue]);
  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return <NotFound />;
    }
    return <ErrorMessage error={error} title="Error loading shopping list" />;
  }
  if (!data) {
    return <NotFound />;
  }
  const toggleChecked = (itemId: number) => {
    setCheckedItems((prev) => {
      if (prev) {
        const list = {
          ...prev,
          shoppingListItems: prev.shoppingListItems.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item,
          ),
        };
        setStorageValue(JSON.stringify(list));
        return list;
      }
    });
  };
  const updateAmount = (itemId: number, newAmount: number) => {
    setCheckedItems((prev) => {
      if (prev) {
        const list = {
          ...prev,
          shoppingListItems: prev.shoppingListItems.map((item) =>
            item.id === itemId ? { ...item, amount: newAmount } : item,
          ),
        };
        setStorageValue(JSON.stringify(list));
        return list;
      }
    });
  };
  const filteredBySearchTerm = (item: ShoppingListItem) => {
    return item.product.productName
      .toLowerCase()
      .includes(searchInput.toLowerCase());
  };
  const handleAddToInventory = async () => {
    if (!checkedItemsList.length) return;
    try {
      // Stuur geselecteerde items naar inventory API
      await Promise.all(
        checkedItemsList.map((item) => {
          console.log(
            `Sending to inventory: ${item.product.productName} - Quantity: ${item.amount}`,
          );

          const purchaseDate = new Date();
          const expiryDate = new Date();
          expiryDate.setDate(purchaseDate.getDate() + 14);

          const requestPayload: InventoryRequestContract = {
            ProductId: item.product.productId,
            Amount: item.amount,
            PurchaseDate: purchaseDate.toISOString().split("T")[0],
            ExpiryDate: expiryDate.toISOString().split("T")[0],
            StorageTypeName: "Cabinet",
          };
          return AddInventoryItem(requestPayload);
        }),
      );

      // Verwijder geselecteerde items uit shopping list
      setCheckedItems((prev) => {
        if (!prev) return prev;
        const updatedList = {
          ...prev,
          shoppingListItems: prev.shoppingListItems.filter((i) => !i.checked),
        };
        setStorageValue(JSON.stringify(updatedList));
        return updatedList;
      });
      setShowConfirm(false);
      setIsAddingToInventory(false);
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    } catch (error) {
      console.error("Error adding items to inventory:", error);
      setAddInventoryError(
        `Failed to add items: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setIsAddingToInventory(false);
    }
  };

  const allItems = checkedItems?.shoppingListItems || [];

  return (
    <section className="flex flex-col gap-5 px-5">
      <SearchButton search={searchInput} setSearch={setSearchInput} />
      <div className="mb-2 flex items-center gap-20">
        <h3 className="text-2xl">Shopping list</h3>
        <BsSend
          size={24}
          className="text-primary cursor-pointer"
          onClick={() => setShowSendMail(true)}
        />
      </div>
      {showSendMail && (
        <SendMailPopup
          items={allItems}
          onClose={() => setShowSendMail(false)}
        />
      )}
      {checkedItems?.shoppingListItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        checkedItems?.shoppingListItems
          .filter((item) => filteredBySearchTerm(item))
          .map((item) => {
            return (
              <div
                key={item.id}
                className="bg-bg border-primary relative grid max-w-[550px] grid-cols-[40px_1fr_40px] grid-rows-[auto_auto] gap-y-1 rounded-2xl border-2 p-2 shadow-md sm:grid-cols-[50px_200px_120px_50px] sm:grid-rows-1 sm:items-center sm:gap-y-0"
              >
                <div className="row-span-2 flex items-center sm:row-span-1">
                  <IoMdCheckmarkCircle
                    onClick={() => toggleChecked(item.id)}
                    className={`size-8 cursor-pointer ${item.checked ? "text-tertiary" : "text-primary"}`}
                  />
                </div>
                <h1 className="col-start-2 row-start-1 sm:self-center">
                  {item.product.productName}
                </h1>
                <div className="col-start-2 row-start-2 flex items-center gap-2 sm:col-start-3 sm:row-start-1 sm:self-center">
                  <ValueStepperButton
                    value={item.amount}
                    onChange={(newValue) => updateAmount(item.id, newValue)}
                  />
                  <h2>{item.product.uomName}</h2>
                </div>
                {/* TrashCan */}
                <svg
                  onClick={() => {
                    setCheckedItems((prev) => {
                      if (prev) {
                        const list = {
                          ...prev,
                          shoppingListItems: prev.shoppingListItems.map((i) =>
                            i.id === item.id ? { ...i, checked: false } : i,
                          ),
                        };
                        setStorageValue(JSON.stringify(list));
                        return list;
                      }
                    });
                    setClickedTrashCan({
                      bool: true,
                      id: item.id,
                      productName: item.product.productName,
                    });
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-primary absolute top-1/2 right-2 size-8 -translate-y-1/2 transform cursor-pointer"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            );
          })
      )}
      {/* verwijderfunctie */}
      {clickedTrashCan.bool && (
        <DeleteShoppingListItemPopup
          state={clickedTrashCan}
          SetState={setClickedTrashCan}
          onDelete={() => {
            setCheckedItems((prev) => {
              if (prev) {
                const updated = {
                  ...prev,
                  shoppingListItems: prev.shoppingListItems.filter(
                    (item) => item.id !== clickedTrashCan.id,
                  ),
                };
                setStorageValue(JSON.stringify(updated));
                return updated;
              }
            });
            setClickedTrashCan({ bool: false, id: undefined, productName: "" });
          }}
        />
      )}
      <CtaButton onClick={() => setShowAddItemToShopping(true)}>
        Add item
      </CtaButton>
      {showAddItemToShopping && (
        <div className="bg-bg border-secondary fixed top-1/2 left-1/2 z-9 flex min-w-2/3 -translate-1/2 flex-col items-center justify-center rounded-2xl border-2 px-4 py-2 text-center shadow-md md:min-w-1/2">
          <AddItemToShoppingList
            onCancel={() => setShowAddItemToShopping(false)}
            onConfirm={(p) => {
              AddShoppingListItem({
                productId: p.productId,
                amount: 1,
              }).then((item) => {
                setStorageValue((prev) => {
                  if (prev) {
                    const localList: ShoppingListItemsContract =
                      JSON.parse(prev);
                    const result = {
                      ...localList,
                      shoppingListItems: [...localList.shoppingListItems, item],
                    };
                    return JSON.stringify(result);
                  }
                  return null;
                });
                setShowAddItemToShopping(false);
                queryClient.invalidateQueries({ queryKey: ["shoppinglist"] });
              });
            }}
          />
        </div>
      )}
      <CtaButton className="bg-secondary" onClick={() => setShowConfirm(true)}>
        Add items to inventory
      </CtaButton>
      {showConfirm && (
        <div className="bg-bg border-secondary fixed top-1/2 left-1/2 z-50 flex w-2/3 max-w-xl -translate-1/2 flex-col items-center justify-center rounded-2xl border-2 px-4 py-4 shadow-md md:w-1/2">
          <h3 className="mb-3 text-xl">Add items to inventory</h3>
          {checkedItemsList.length === 0 ? (
            <p className="text-sm text-gray-500">No items selected.</p>
          ) : (
            <ul className="mb-4 max-h-40 overflow-auto text-left">
              {checkedItemsList.map((item) => (
                <li key={item.id}>
                  {item.product.productName} ({item.amount}{" "}
                  {item.product.uomName})
                </li>
              ))}
            </ul>
          )}
          {addInventoryError && (
            <p className="mb-3 text-sm text-red-500">{addInventoryError}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isAddingToInventory}
              className="bg-primary rounded px-4 py-2 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToInventory}
              disabled={checkedItemsList.length === 0 || isAddingToInventory}
              className="bg-tertiary rounded px-4 py-2 disabled:opacity-50"
            >
              {isAddingToInventory ? "Adding..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
export default ShoppingListPage;
