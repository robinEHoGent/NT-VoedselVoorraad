import { useState, useRef } from "react";
import { ArrowDownAZ, ArrowUpAZ, CalendarCheck } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AxiosError } from "axios";

import AddProductPopup from "../Components/pop-ups/AddProductPopup";
import InventoryProduct from "../Components/inventory/InventoryProduct";
import SearchButton from "../Components/buttons/SearchButton";
import CtaButton from "../Components/buttons/CtaButton";
import LinkButton from "../Components/buttons/LinkButton";
import Loading from "../UI/Loading";
import NotFound from "../UI/NotFound";
import Empty from "../Components/inventory/Empty";
import ErrorMessage from "../UI/ErrorMessage";

import { useInventoryData } from "../Hooks/useInventoryData";
import { useFilteredInventory } from "../Hooks/useFilteredInventory";

function InventoryPage() {
  const [alfabetSort, setAlfabetSort] = useState<boolean>(true);
  const [categoryDateFilters, setCategoryDateFilters] = useState<
    Record<number, boolean>
  >({});
  const [searchInput, setSearchInput] = useState("");
  const [addProductPopupState, setAddProductPopupState] = useState<{
    open: boolean;
    categoryId?: number;
    categoryName?: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const { isPending, data, error, isError, expiringCount } = useInventoryData({
    searchTerm: searchInput,
  });
  const filteredData = useFilteredInventory(
    data as InventoryDataContract,
    alfabetSort,
    categoryDateFilters,
  );

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

  useGSAP(() => {
    if (containerRef.current && data?.categories) {
      const sections = gsap.utils.toArray(".category-section");
      gsap.killTweensOf(sections);
      gsap.fromTo(
        sections,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          overwrite: "auto",
        },
      );
    }
  }, [data]);

  if (isPending) return <Loading />;
  if (isError) {
    if (error instanceof AxiosError && error.response?.status === 404)
      return <NotFound />;
    return <ErrorMessage error={error} title="Error loading inventory" />;
  }
  if (!data || !data.categories) {
    return <Empty page="inventory" />;
  }

  if (data.categories.length === 0 && !searchInput) {
    return <Empty page="inventory" />;
  }

  return (
    <section ref={containerRef} className="grid grid-cols-1 gap-4 px-5">
      <SearchButton search={searchInput} setSearch={setSearchInput} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex grow justify-between">
          <h3 className="text-4xl">Inventory</h3>
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
        <LinkButton to="/expires-soon">
          (Almost) Expired {expiringCount > 0 && expiringCount}
        </LinkButton>
      </div>

      {data.categories.length === 0 && (
        <Empty
          page={"inventory"}
          onAddProduct={() => setAddProductPopupState({ open: true })}
        />
      )}

      {filteredData.categories.map((category) => {
        const dateFilter = getCategoryDateFilter(category.categoryId);

        return (
          <div
            key={category.categoryId}
            className="category-section flex flex-col gap-2"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <h4 className="text-3xl">{category.categoryName}</h4>
                <div
                  className={`border-primary flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2 ${
                    dateFilter
                      ? "bg-bg text-primary"
                      : "bg-primary text-secondary"
                  }`}
                  onClick={() => handleDateFilter(category.categoryId)}
                >
                  <CalendarCheck className="h-6 w-6" />
                </div>
              </div>

              <div className="3xl:grid-cols-5 flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.products.map((items) => (
                  <InventoryProduct key={items.productId} items={items} />
                ))}
              </div>
            </div>

            <CtaButton
              onClick={() =>
                setAddProductPopupState({
                  open: true,
                  categoryId: category.categoryId,
                  categoryName: category.categoryName,
                })
              }
            >
              Add Product
            </CtaButton>
          </div>
        );
      })}

      <LinkButton to="/manage-products">Manage Products</LinkButton>

      {addProductPopupState?.open && (
        <AddProductPopup
          open={addProductPopupState.open}
          onClose={() => setAddProductPopupState(null)}
          initialCategoryName={addProductPopupState.categoryName}
        />
      )}
    </section>
  );
}

export default InventoryPage;
