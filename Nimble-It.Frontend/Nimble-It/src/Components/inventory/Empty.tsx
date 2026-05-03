import { useState } from "react";
import CtaButton from "../buttons/CtaButton";
import AddProductPopup from "../pop-ups/AddProductPopup";

function Empty({ page, onAddProduct }: EmptyProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct();
    } else {
      setIsPopupOpen(true);
    }
  };

  return (
    <>
      <div className="mt-40 px-4 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-4 text-6xl">📦</div>
          <h2 className="text-customGrayDark mb-2 text-3xl font-bold">
            Your {page} is Empty
          </h2>
          <p className="text-customGrayMedium mb-6">
            You haven't added any products to your{" "}
            {page === "product" ? page + "s" : page} yet. Start by adding your
            first product!
          </p>
          <CtaButton className="w-full!" onClick={handleAddProduct}>
            Add Your First Product
          </CtaButton>
        </div>
      </div>

      {isPopupOpen && (
        <AddProductPopup
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </>
  );
}

interface EmptyProps {
  page: "inventory" | "product";
  onAddProduct?: () => void;
}

export default Empty;
