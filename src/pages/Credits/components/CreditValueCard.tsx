import { Radio } from '@headlessui/react';
import bindClassNames from '@/utils/bindClassNames';

interface CreditValueCardProps {
  value: number;
}

export function CreditValueCard({ value }: CreditValueCardProps) {
  return (
    <Radio value={value} className="cursor-pointer">
      {({ checked }) => (
        <span
          className={bindClassNames(
            checked ? 'ring-2 ring-sky-400' : 'cursor-pointer',
            'group relative flex cursor-pointer items-center justify-center rounded-lg  border shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 px-4 py-3 text-sm font-medium uppercase text-gray-900 dark:text-gray-300 dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light  hover:bg-gray-50 focus:outline-none sm:flex-1',
          )}
        >
          {value}
        </span>
      )}
    </Radio>
  );
}
