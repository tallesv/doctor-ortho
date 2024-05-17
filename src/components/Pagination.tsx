import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const siblingsCount = 2;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1;
    })
    .filter(page => page > 0);
}

interface PaginationProps {
  currentPage: number;
  totalQuantityOfData: number;
  dataPerPage?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalQuantityOfData,
  dataPerPage = 10,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.ceil(totalQuantityOfData / dataPerPage);

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage),
        )
      : [];

  let initialDataCount;
  if (currentPage === 1) {
    if (totalQuantityOfData > 0) {
      initialDataCount = 1;
    } else {
      initialDataCount = 0;
    }
  } else {
    initialDataCount = dataPerPage * (currentPage - 1);
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50"
        >
          Previous
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-white">
            Mostrando <span className="font-medium">{initialDataCount}</span>{' '}
            para{' '}
            <span className="font-medium">
              {totalQuantityOfData > dataPerPage &&
                currentPage * dataPerPage < totalQuantityOfData &&
                currentPage * dataPerPage}
              {totalQuantityOfData > dataPerPage &&
                currentPage * dataPerPage >= totalQuantityOfData &&
                totalQuantityOfData}
              {totalQuantityOfData < dataPerPage && totalQuantityOfData}
            </span>{' '}
            de <span className="font-medium">{totalQuantityOfData}</span> totais
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
              type="button"
              onClick={() => onPageChange(1)}
            >
              <span className="sr-only">Previous</span>
              <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {previousPages.length > 0 &&
              previousPages.map(page => (
                <button
                  key={page}
                  type="button"
                  aria-current="page"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ))}

            <button
              type="button"
              aria-current="page"
              className="relative z-10 inline-flex items-center bg-sky-500 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              {currentPage}
            </button>

            {nextPages.length > 0 &&
              nextPages.map(page => (
                <button
                  key={page}
                  type="button"
                  aria-current="page"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ))}

            <button
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
              type="button"
              onClick={() => onPageChange(lastPage)}
            >
              <span className="sr-only">Next</span>
              <HiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
