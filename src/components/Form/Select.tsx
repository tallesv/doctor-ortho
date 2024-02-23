import { ForwardedRef, SelectHTMLAttributes, forwardRef } from 'react';
import { getInputBorderStyle } from '../../utils/inputBorderStyle';
import bindClassNames from '../../utils/bindClassNames';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: {
    value: string;
    label: string;
  }[];
  error?: boolean;
  errorMessage?: string;
}

const Select = forwardRef(
  (
    {
      label,
      options,
      error,
      errorMessage,
      className,
      required,
      ...rest
    }: SelectProps,
    ref: ForwardedRef<HTMLSelectElement>,
  ) => {
    const inputBorderStyle = getInputBorderStyle(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={rest.id}
            className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={bindClassNames(
            'bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light',
            className || '',
            inputBorderStyle,
          )}
          {...rest}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errorMessage && (
          <span className="mt-2 text-sm text-red-600">{errorMessage}</span>
        )}
      </div>
    );
  },
);

export default Select;
