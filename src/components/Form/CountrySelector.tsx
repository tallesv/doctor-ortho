import {
  ForwardedRef,
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { getInputBorderStyle } from '../../utils/inputBorderStyle';
import bindClassNames from '../../utils/bindClassNames';

interface CountrySelectorProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

interface Country {
  name: string;
  code: string;
  flag: string;
}

const CountrySelector = forwardRef(
  (
    {
      label,
      error,
      errorMessage,
      className,
      required,
      ...rest
    }: CountrySelectorProps,
    ref: ForwardedRef<HTMLSelectElement>,
  ) => {
    const inputBorderStyle = getInputBorderStyle(error);

    const [countries, setCountries] = useState<Country[]>([]);

    // function handleSelectCountry(countryCode: string) {
    //   // TO DO
    //   // fetch(`'https://api.teleport.org/v1/countries'`).then(response =>
    //   //   response.json().then(data => console.log(data)),
    //   // );
    // }

    useEffect(() => {
      fetch('https://restcountries.com/v3.1/all').then(response =>
        response.json().then(data =>
          setCountries(
            data
              .map((country: any) => ({
                name: country.name.common,
                code: country.cca2,
                flag: country.flags.png,
              }))
              .sort((a: Country, b: Country) => (a.name < b.name ? -1 : 1)),
          ),
        ),
      );
    }, []);

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
        <select
          id="countries"
          ref={ref}
          className={bindClassNames(
            'bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5',
            className || '',
            inputBorderStyle,
          )}
          {...rest}
          // onChange={e => handleSelectCountry(e.target.value)}
        >
          {countries.map(option => (
            <option key={option.code} value={option.code}>
              {option.name}
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

export default CountrySelector;
