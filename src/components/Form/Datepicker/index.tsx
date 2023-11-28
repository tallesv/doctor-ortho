import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';
import { getInputBorderStyle } from '../../../utils/inputBorderStyle';
import bindClassNames from '../../../utils/bindClassNames';

interface DatepickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

const Datepicker = forwardRef(
  (
    {
      label,
      error,
      type,
      errorMessage,
      className,
      required,
      ...rest
    }: DatepickerProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const inputBorderStyle = getInputBorderStyle(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={rest.id}
            className="block mb-2 ml-1 text-sm font-medium text-gray-900"
          >
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </label>
        )}
        {/* <FlowbiteDatepicker
          language="pt-BR"
          labelTodayButton="Hoje"
          labelClearButton="Apagar"
          theme={DatepickerStyle}
          onChange={e => console.log(e)}
          {...rest}
        /> */}

        <input
          id={rest.id}
          ref={ref}
          type="date"
          className={bindClassNames(
            `shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-lg w-full block p-2.5`,
            className || '',
            inputBorderStyle,
          )}
          {...rest}
        />
        {errorMessage && (
          <span className="mt-2 text-sm text-red-600">{errorMessage}</span>
        )}
      </div>
    );
  },
);

export default Datepicker;
