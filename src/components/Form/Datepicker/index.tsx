import { ForwardedRef, forwardRef } from 'react';
import DatePicker, {
  ReactDatePicker,
  ReactDatePickerProps,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getInputBorderStyle } from '../../../utils/inputBorderStyle';
import bindClassNames from '../../../utils/bindClassNames';
import { Control, Controller } from 'react-hook-form';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

interface DatepickerProps extends Omit<ReactDatePickerProps, 'onChange'> {
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

    const PatternFormatWithRef = forwardRef<
      HTMLInputElement,
      PatternFormatProps
    >((props, ref: ForwardedRef<HTMLInputElement>) => (
      <PatternFormat {...props} getInputRef={ref} />
    ));

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">
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
                  {...rest}
                  onChange={date => field.onChange(date, name)}
                  selected={field.value}
                  wrapperClassName="w-full"
                  customInput={
                    <PatternFormatWithRef
                      format="##/##/####"
                      placeholder="DD/MM/AAAA"
                      mask={['D', 'D', 'M', 'M', 'A', 'A', 'A', 'A']}
                      getInputRef={ref}
                      className={bindClassNames(
                        `shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-lg w-full block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light`,
                        className || '',
                        inputBorderStyle,
                      )}
                      value={field.value ? field.value : ''}
                    />
                  }
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
