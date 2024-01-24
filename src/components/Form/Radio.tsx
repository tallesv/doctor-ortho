import { ForwardedRef, forwardRef } from 'react';
import {
  RadioProps as FlowbiteRadioProps,
  Radio as FlowbiteRadio,
} from 'flowbite-react';
import bindClassNames from '../../utils/bindClassNames';
import { getInputBorderStyle } from '../../utils/inputBorderStyle';

interface RadioProps extends FlowbiteRadioProps {
  label?: string;
  error?: boolean;
}

const Radio = forwardRef(
  (
    { label, required, className, error, ...rest }: RadioProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const inputBorderStyle = getInputBorderStyle(error);
    return (
      <FlowbiteRadio
        ref={ref}
        {...rest}
        className={bindClassNames(
          `text-sky-500`,
          className || '',
          inputBorderStyle,
        )}
      />
    );
  },
);

export default Radio;
