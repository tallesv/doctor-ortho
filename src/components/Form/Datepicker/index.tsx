import { ForwardedRef, forwardRef } from 'react';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getInputBorderStyle } from '../../../utils/inputBorderStyle';
import bindClassNames from '../../../utils/bindClassNames';
import { Control, Controller } from 'react-hook-form';

interface DatepickerProps {
  label?: string;
  name?: string;
  className?: string;
  required?: boolean;
  control: Control<any>;
  error?: boolean;
  errorMessage?: string;
}

const DatepickerComponent = forwardRef(
  (
    {
      label,
      name,
      error,
      errorMessage,
      className,
      required,
      control,
      ...rest
    }: DatepickerProps,
    ref: ForwardedRef<ReactDatePicker>,
  ) => {
    const inputBorderStyle = getInputBorderStyle(error);
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 ml-1 text-sm font-medium text-gray-900">
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </label>
        )}
        <div className="w-full">
          <Controller
            control={control}
            name={name || ''}
            render={({ field }) => {
              return (
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  ref={ref}
                  {...rest}
                  onChange={date => field.onChange(date, name)}
                  selected={field.value}
                  wrapperClassName="w-full"
                  className={bindClassNames(
                    `shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-lg w-full block p-2.5`,
                    className || '',
                    inputBorderStyle,
                  )}
                />
              );
            }}
          />
        </div>
        {errorMessage && (
          <span className="mt-2 text-sm text-red-600">{errorMessage}</span>
        )}
      </div>
    );
  },
);

export default DatepickerComponent;
