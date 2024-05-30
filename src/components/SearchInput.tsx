import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';
import { getInputBorderStyle } from '../utils/inputBorderStyle';
import bindClassNames from '../utils/bindClassNames';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

const SearchInput = forwardRef(
  (
    { className, ...rest }: SearchInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const inputBorderStyle = getInputBorderStyle(false);

    return (
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="flex flex-col w-full sm:flex-row gap-2 sm:items-center justify-between">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              ref={ref}
              className={bindClassNames(
                'block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white',
                inputBorderStyle,
              )}
              {...rest}
            />
          </div>
        </div>
      </div>
    );
  },
);

export default SearchInput;
