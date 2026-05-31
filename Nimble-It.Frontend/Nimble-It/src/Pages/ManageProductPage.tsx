import { useQuery } from "@tanstack/react-query";
import { GetAllProducts } from "../Api/apiCallsProducts";
import Loading from "../UI/Loading";
import viteLogo from "/vite.svg";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import SearchButton from "../Components/buttons/SearchButton";
import DeleteProductPopup from "../Components/pop-ups/DeleteProductPopup";
import Empty from "../Components/inventory/Empty";
import CtaButton from "../Components/buttons/CtaButton";
import { useProductUsageCheck } from "../Hooks/useProductUsageCheck";
import { AxiosError } from "axios";
import CreateProductInstancePopup from "@/Components/pop-ups/CreateProductInstancePopup";

function ManageProductPage() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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
  const containerRef = useRef<HTMLElement>(null);

  const navigate = useNavigate();
  const { isPending, data } = useQuery<ProductContract[]>({
    queryKey: ["product"],
    queryFn: GetAllProducts,
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { isProductUsed } = useProductUsageCheck();

  const filteredProducts = data?.filter((product) => {
    const searchTerm = searchInput.toLowerCase();
    return product.productName.toLowerCase().includes(searchTerm);
  });

  if (isPending) {
    return <Loading />;
  }

  if (!filteredProducts) {
    return <Empty page="product" />;
  }

  return (
    <section ref={containerRef} className={`grid grid-cols-1 gap-4 px-5`}>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-10 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <SearchButton search={searchInput} setSearch={setSearchInput} />
      </div>
      <h3 className="text-center text-4xl">Manage Products</h3>
      {filteredProducts.length === 0 && (
        <h1 className="py-10 text-center text-2xl">No items found.</h1>
      )}
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <li
            key={product.productId}
            className="product-card group border-primary bg-bg hover:border-tertiary flex items-center justify-between rounded-2xl border-2 px-4 py-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="w-1/2 flex items-center gap-3">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.productName} className="h-12 w-12 object-contain rounded-md" />
                          ) : (
                            <img src={viteLogo} alt={product.productName} className="h-12 w-12 object-contain rounded-md" />
                          )}

                          <div>
                            <h2> {product.productName}</h2>{" "}
                            <h4 className="text-customGrayMedium">{product.uomName}</h4>
                          </div>
                        </div>
            <div className="flex gap-2">
              <svg
                viewBox="0 0 14 14"
                fill="currentColor"
                className="text-tertiary size-7 cursor-pointer place-self-center transition-all duration-300 hover:scale-110"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.1875 5.15625H7.96875V0.9375C7.96875 0.419824 7.54893 0 7.03125 0H6.09375C5.57607 0 5.15625 0.419824 5.15625 0.9375V5.15625H0.9375C0.419824 5.15625 0 5.57607 0 6.09375V7.03125C0 7.54893 0.419824 7.96875 0.9375 7.96875H5.15625V12.1875C5.15625 12.7052 5.57607 13.125 6.09375 13.125H7.03125C7.54893 13.125 7.96875 12.7052 7.96875 12.1875V7.96875H12.1875C12.7052 7.96875 13.125 7.54893 13.125 7.03125V6.09375C13.125 5.57607 12.7052 5.15625 12.1875 5.15625Z"
                  clipRule="evenodd"
                  onClick={() => setIsPopupOpen(true)}
                />
              </svg>
              <svg
                onClick={() => {
                  const message = isProductUsed(product.productId)
                    ? `The product "${product.productName}" is still being used in your inventory. 
                  Are you sure you want to delete it?`
                    : `Are you sure you want to delete ${product.productName}?`;
                  setClickedTrashCan({
                    bool: true,
                    id: product.productId,
                    productName: product.productName.toString(),
                    message: message,
                  });
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-primary col-span-2 col-start-2 size-8 cursor-pointer place-self-center transition-all duration-300 hover:scale-110"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </li>
        ))}
      </ul>
      {clickedTrashCan.bool && (
        <DeleteProductPopup
          state={clickedTrashCan}
          SetState={setClickedTrashCan}
        />
      )}
      <CtaButton onClick={() => setIsPopupOpen(true)}>Add Product</CtaButton>

      {isPopupOpen && (
        <CreateProductInstancePopup
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </section>
  );
}

export default ManageProductPage;
