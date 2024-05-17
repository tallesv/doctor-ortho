import { ForwardedRef, forwardRef } from 'react';
import bindClassNames from '../../utils/bindClassNames';
import { getInputBorderStyle } from '../../utils/inputBorderStyle';
import {
  Checkbox as FlowbiteCheckbox,
  CheckboxProps as FlowbiteCheckboxProps,
  Label,
} from 'flowbite-react';

interface CheckboxProps extends FlowbiteCheckboxProps {
  label?: string;
  error?: boolean;
}

const Checkbox = forwardRef(
  (
    { label, className, error, ...rest }: CheckboxProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const inputBorderStyle = getInputBorderStyle(error);

    return (
      <div className="flex items-center gap-2 ml-1">
        <FlowbiteCheckbox
          ref={ref}
          {...rest}
          className={bindClassNames(
            `text-sky-500`,
            className || '',
            inputBorderStyle,
          )}
        />
        {label && (
          <Label className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">
            {label}
          </Label>
        )}
      </div>
    );
  },
);

export default Checkbox;
