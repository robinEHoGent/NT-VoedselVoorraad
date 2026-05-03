import { useState, useRef } from "react";
import SearchButton from "../Components/buttons/SearchButton";
import { useNavigate } from "react-router-dom";
import LinkButton from "../Components/buttons/LinkButton";
import InventoryProduct from "../Components/inventory/InventoryProduct";
import CtaButton from "../Components/buttons/CtaButton";
import Loading from "../UI/Loading";
import NotFound from "../UI/NotFound";
import ErrorMessage from "../UI/ErrorMessage";
import { AxiosError } from "axios";
import { useInventoryData } from "../Hooks/useInventoryData";
import { useFilteredInventory } from "../Hooks/useFilteredInventory";
import Empty from "../Components/inventory/Empty";
import { ArrowDownAZ, ArrowUpAZ, CalendarCheck } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AddProductPopup from "@/Components/pop-ups/AddProductPopup";

function InventoryExpiresSoon() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState<string>("");
  const [alfabetSort, setAlfabetSort] = useState<boolean>(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [categoryDateFilters, setCategoryDateFilters] = useState<
    Record<number, boolean>
  >({});
  const containerRef = useRef<HTMLElement>(null);

  const { isPending, data, error, isError } = useInventoryData({
    filterExpiringSoon: true,
    searchTerm: searchInput,
  });

  const filteredData = useFilteredInventory(
    data as InventoryDataContract,
    alfabetSort,
    categoryDateFilters,
  );

  useGSAP(() => {
    if (containerRef.current && data?.categories) {
      gsap.from(".category-section", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, [data]);

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return <NotFound />;
    }
    return <ErrorMessage error={error} title="Error loading inventory" />;
  }

  if (!data) {
    return <Empty page="inventory" />;
  }

  const handleDateFilter = (categoryId: number) => {
    setCategoryDateFilters((prev) => {
      const currentFilter = prev[categoryId] ?? true;
      return {
        ...prev,
        [categoryId]: !currentFilter,
      };
    });
  };

  const getCategoryDateFilter = (categoryId: number) => {
    return categoryDateFilters[categoryId] ?? true;
  };

  return (
    <section ref={containerRef} className="grid grid-cols-1 gap-4 px-5">
      <div className="flex items-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-10 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>

        <SearchButton search={searchInput} setSearch={setSearchInput} />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-4xl">(Almost) Expired</h3>
        <div
          className="bg-primary border-bg text-secondary flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2"
          onClick={() => setAlfabetSort(!alfabetSort)}
        >
          {alfabetSort ? (
            <ArrowDownAZ className="h-6 w-6" />
          ) : (
            <ArrowUpAZ className="h-6 w-6" />
          )}
        </div>
      </div>

      {filteredData.categories.map((product) => {
        const dateFilter = getCategoryDateFilter(product.categoryId);
        return (
          <>
            <div
              className="category-section flex flex-col gap-2"
              key={product.categoryId}
            >
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <h4 className="text-3xl">{product.categoryName}</h4>
                <div
                  className={`border-primary flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2 ${
                    dateFilter
                      ? "bg-bg text-primary"
                      : "bg-primary text-secondary"
                  }`}
                  onClick={() => handleDateFilter(product.categoryId)}
                >
                  <CalendarCheck className="h-6 w-6" />
                </div>
              </div>
              <div className="3xl:grid-cols-5 flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {product.products.map((items) => (
                  <InventoryProduct key={items.productId} items={items} />
                ))}
              </div>
            </div>
            <CtaButton onClick={() => setIsPopupOpen(true)}>
              Add Product
            </CtaButton>
          </>
        );
      })}
      <LinkButton to="/manage-products">Manage Products</LinkButton>
      {isPopupOpen && (
        <AddProductPopup
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </section>
  );
}

export default InventoryExpiresSoon;
