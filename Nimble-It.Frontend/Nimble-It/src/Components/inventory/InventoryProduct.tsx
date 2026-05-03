import { useEffect, useRef, useState } from "react";
import { formattedDate } from "../../Utils/formattedDate";
import gsap from "gsap";
import UpdateInventoryPopup from "../pop-ups/UpdateInventoryPopup";
import DeleteInventoryItemPopup from "../pop-ups/DeleteInventoryItemPopup";

function InventoryProduct({ items }: InventoryProductProps) {
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [clickedTrashCan, setClickedTrashCan] = useState<{
    bool: boolean;
    id: number | undefined;
    productName: string;
  }>({
    bool: false,
    id: undefined,
    productName: "",
  });
  const svgRef = useRef<SVGSVGElement | null>(null);

  const hasMultipleItems = items.inventory.length > 1;
  const visibleItems = isOpen ? items.inventory : [items.inventory[0]];

  const [editingItem, setEditingItem] = useState<{
    item: InventoryItemContract;
    product: {
      productName: string;
      uomName: string;
    };
  } | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      gsap.to(svgRef.current, {
        rotation: isOpen ? -180 : 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`group cursor-pointer rounded-2xl transition-all duration-300 hover:shadow-lg ${!isOpen ? "border-2" : ""} ${
        items.inventory.some((i) => i.isExpiringSoon)
          ? !isOpen
            ? "border-primary bg-primary/15 hover:bg-primary/25"
            : "border-primary"
          : "border-tertiary bg-bg hover:bg-customWhite"
      } ${hasMultipleItems && "flex flex-col gap-0.5"}`}
    >
      {visibleItems.map((item, index) => (
        <div
          key={item.inventoryId}
          className={`grid grid-cols-8 items-start gap-y-4 p-4 ${isOpen && "border-2"} ${index === 0 && "rounded-t-2xl"} ${index === visibleItems.length - 1 && "grow rounded-b-2xl"} ${index !== 0 && "border-dashed"} ${item.isExpiringSoon ? "border-primary" : "border-tertiary"} ${hasMultipleItems && isOpen && item.isExpiringSoon ? "bg-primary/15" : ""}`}
        >
          <div className="relative col-span-5 flex flex-col justify-center">
            <h3 className="text-3xl">{items.productName}</h3>
            <h3 className="text-customGrayMedium text-lg">
              {(() => {
                const uniqueStorageTypes = [
                  ...new Set(items.inventory.map((i) => i.storageTypeName)),
                ];

                const display = uniqueStorageTypes.map((name) => {
                  const count = items.inventory.filter(
                    (i) => i.storageTypeName === name,
                  ).length;
                  return `${name} (${count}x)`;
                });

                return !isOpen && hasMultipleItems
                  ? display.join(", ")
                  : item.storageTypeName;
              })()}
            </h3>

            {items.imageUrl && (
              <img
                className="absolute -top-2 -left-2 h-[125%] max-h-20 rounded-2xl object-contain opacity-20"
                alt={items.productName}
                src={items.imageUrl}
              />
            )}
          </div>

          <div className="col-span-5 col-start-6 flex justify-end gap-4">
            <div className="place-self-center">
              {hasMultipleItems && index === 0 && (
                <button onClick={handleToggle}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`size-8 cursor-pointer`}
                    ref={svgRef}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              )}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-tertiary hover:text-primary size-8 cursor-pointer transition-all duration-200 hover:scale-110"
                onClick={() => setInfoOpen((prev) => !prev)}
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div
              className={`flex aspect-square w-20 flex-col items-center justify-center rounded-2xl border-2 p-2 ${item.isExpiringSoon || (items.inventory.some((i) => i.isExpiringSoon) && !isOpen) ? "bg-primary border-primary text-customWhite" : "border-secondary text-customGrayMedium"}`}
            >
              <h3 className="text-3xl">
                {(() => {
                  const totalAmount = items.inventory.reduce(
                    (sum, item) => sum + item.amount,
                    0,
                  );

                  return !isOpen && hasMultipleItems
                    ? totalAmount
                    : item.amount;
                })()}
              </h3>
              <h3>{items.uomName}</h3>
            </div>
          </div>

          {infoOpen && (
            <>
              <div className="text-md col-span-5 row-start-2 flex justify-between">
                <div>
                  <h4 className="text-customGrayMedium">Expires:</h4>
                  <h4>{formattedDate(item.expiryDate)}</h4>
                </div>

                <div>
                  <h4 className="text-customGrayMedium">Purchased:</h4>
                  <h4>{formattedDate(item.purchaseDate)}</h4>
                </div>
              </div>

              <div className="col-span-3 flex h-full items-center justify-end gap-4">
                <svg
                  onClick={() =>
                    setEditingItem({
                      item: {
                        inventoryId: item.inventoryId,
                        storageTypeName: item.storageTypeName,
                        amount: item.amount,
                        purchaseDate: item.purchaseDate,
                        expiryDate: item.expiryDate,
                      },
                      product: {
                        productName: items.productName,
                        uomName: items.uomName,
                      },
                    })
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-tertiary size-8 cursor-pointer transition-all duration-200 hover:scale-110"
                >
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-primary size-8 cursor-pointer transition-all duration-200 hover:scale-110 hover:brightness-110"
                  onClick={() =>
                    setClickedTrashCan({
                      bool: true,
                      id: item.inventoryId,
                      productName: items.productName.toString(),
                    })
                  }
                >
                  <path
                    fillRule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {clickedTrashCan.bool && (
                <DeleteInventoryItemPopup
                  state={clickedTrashCan}
                  SetState={setClickedTrashCan}
                />
              )}
            </>
          )}
        </div>
      ))}
      {editingItem && (
        <UpdateInventoryPopup
          item={editingItem.item}
          product={editingItem.product}
          close={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}

interface InventoryProductProps {
  items: ProductContractWithInventory;
}

export default InventoryProduct;
