// components/Pagination.js
import React from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Chuyển đổi currentPage từ 0-based thành 1-based cho hiển thị
  const displayPage = currentPage + 1;
  
  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // maximum number of page links to show

    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than the max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate middle pages
      let startPage = Math.max(displayPage - 1, 2);
      let endPage = Math.min(displayPage + 1, totalPages - 1);

      // Adjust if we're at the start or end
      if (displayPage <= 2) {
        endPage = 4;
      } else if (displayPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis before middle pages if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always include last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`px-3 py-1 rounded-md flex items-center ${
            currentPage === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-gray-300'
          }`}
          title="Trang trước"
        >
          <FaAngleLeft className="w-4 h-4 mr-1" /> Trước
        </button>

        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) => {
          // If it's an ellipsis
          if (pageNumber === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-1">
                ...
              </span>
            );
          }

          // If it's a page number (convert to 0-based for internal handling)
          return (
            <button
              key={`page-${pageNumber}`}
              onClick={() => onPageChange(pageNumber - 1)}
              className={`px-3 py-1 rounded-md ${
                displayPage === pageNumber
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-gray-300'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={`px-3 py-1 rounded-md flex items-center ${
            currentPage === totalPages - 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-gray-300'
          }`}
          title="Trang tiếp"
        >
          Tiếp <FaAngleRight className="w-4 h-4 ml-1" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;