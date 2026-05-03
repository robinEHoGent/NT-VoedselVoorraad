import { useState } from "react";
import CtaButton from "../buttons/CtaButton";
import UpdateStorageTypePopup from "./UpdateStorageTypePopup";
import UpdateAmountPopup from "./UpdateAmountPopup";
import { Toaster } from "react-hot-toast";

interface UpdateInventoryPopupProps {
  item: {
    inventoryId: number;
    storageTypeName: string;
    amount: number;
    purchaseDate: string;
    expiryDate: string;
  };
  product: {
    productName: string;
    uomName: string;
  };
  close: () => void;
}

const UpdateInventoryPopup = ({
  item,
  product,
  close,
}: UpdateInventoryPopupProps) => {
  const [activePopup, setActivePopup] = useState<null | "storage" | "amount">(
    null,
  );

  return (
    <div className="bg-bg border-secondary fixed top-1/2 left-1/2 z-9 flex min-w-4/5 -translate-1/2 flex-col gap-4 rounded-2xl border-2 px-4 py-2 text-center shadow-md md:min-w-1/2">
      <Toaster />
      <div className="flex items-center justify-between">
        <h2 className="text-center text-lg font-black">
          Edit product: {product.productName}
        </h2>
        <svg
          onClick={close}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-primary size-10 cursor-pointer"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {activePopup === null && (
        <div className="grid grid-cols-[2fr_1fr] gap-y-2">
          <p className="text-left">Do you want to update your storage type?</p>
          <CtaButton
            className="w-full!"
            onClick={() => setActivePopup("storage")}
          >
            Update
          </CtaButton>
          <p className="row-start-2 text-left">
            Do you want to use your product?
          </p>
          <CtaButton
            className="row-start-2 w-full!"
            onClick={() => setActivePopup("amount")}
          >
            Use
          </CtaButton>
        </div>
      )}
      {activePopup === "storage" && (
        <UpdateStorageTypePopup
          item={{
            inventoryId: item.inventoryId,
            storageTypeName: item.storageTypeName,
          }}
          close={close}
        ></UpdateStorageTypePopup>
      )}
      {activePopup === "amount" && (
        <UpdateAmountPopup
          item={{
            inventoryId: item.inventoryId,
            amount: item.amount,
            uomName: product.uomName,
          }}
          close={close}
        ></UpdateAmountPopup>
      )}
    </div>
  );
};

export default UpdateInventoryPopup;
