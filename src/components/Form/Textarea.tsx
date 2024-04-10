import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import bindClassNames from '../../utils/bindClassNames';
import { getInputBorderStyle } from '../../utils/inputBorderStyle';

interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

const Textarea = forwardRef(
  (
    {
      label,
      type,
      required,
      className,
      error,
      errorMessage,
      ...rest
    }: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const inputBorderStyle = getInputBorderStyle(error);

    return (
      <div className="w-full">
        {!!label && (
          <label
            htmlFor={rest.id}
            className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </label>
        )}
        <textarea
          id={rest.id}
          ref={ref}
          rows={8}
          className={bindClassNames(
            'shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-lg w-full block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light',
            className || '',
            inputBorderStyle,
          )}
          {...rest}
        ></textarea>
        {errorMessage && (
          <span className="mt-2 text-sm text-red-600">{errorMessage}</span>
        )}
      </div>
    );
  },
);

export default Textarea;
