import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;

  let visiblePages = pages;
  if (totalPages > maxVisiblePages) {
    const start = Math.max(0, Math.min(currentPage - 3, totalPages - maxVisiblePages));
    visiblePages = pages.slice(start, start + maxVisiblePages);
  }

  return (
    <nav className="flex items-center justify-center space-x-2" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {currentPage > 3 && totalPages > maxVisiblePages && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-lg text-gray-400 hover:text-white"
          >
            1
          </button>
          <span className="text-gray-400">...</span>
        </>
      )}

      {visiblePages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page
              ? 'bg-royal-gold text-royal-dark'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages - 2 && totalPages > maxVisiblePages && (
        <>
          <span className="text-gray-400">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-lg text-gray-400 hover:text-white"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}