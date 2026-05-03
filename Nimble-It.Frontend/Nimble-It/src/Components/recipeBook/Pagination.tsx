import { getVisiblePages } from "@/Utils/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages < 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {getVisiblePages(currentPage, totalPages).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`cursor-pointer rounded-lg border-2 px-4 py-2 transition-colors ${
            currentPage === page
              ? "bg-primary text-customWhite border-primary"
              : "bg-customWhite border-bg hover:border-primary"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
