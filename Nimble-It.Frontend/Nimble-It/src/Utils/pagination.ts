export const getVisiblePages = (
  currentPage: number,
  totalPages: number,
): number[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: number[] = [1];

  if (currentPage <= 3) {
    // Show pages 1, 2, 3, 4, 5
    pages.push(2, 3, 4, 5);
  } else if (currentPage >= totalPages - 2) {
    // Show page 1 and last 4 pages
    pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    // Show page 1, then current page and nearby pages
    pages.push(currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
  }

  return pages;
};
