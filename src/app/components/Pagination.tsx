import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        Previous
      </button>
      <span className="text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
