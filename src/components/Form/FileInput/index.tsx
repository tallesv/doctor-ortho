import bindClassNames from '@/utils/bindClassNames';
import classNames from '@/utils/bindClassNames';
import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fileName?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

const FileInput = forwardRef(
  (
    { fileName, label, error, errorMessage, ...rest }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    // console.log(error);
    const inputBorderStyle = error
      ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600';

    return (
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className={bindClassNames(
            'flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500',
            inputBorderStyle,
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-300">
              <span className="font-semibold">{fileName}</span>
            </p>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-300">
              <span className="font-semibold">Clique para subir</span>
              {/*   ou arraste e solte */}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            ref={ref}
            id="dropzone-file"
            type="file"
            className="hidden"
            {...rest}
          />
        </label>
      </div>
    );
  },
);

export default FileInput;
