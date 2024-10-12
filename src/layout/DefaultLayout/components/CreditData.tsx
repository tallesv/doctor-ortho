import { HiOutlineCurrencyDollar } from 'react-icons/hi';

interface CreditDataProps {
  userCurrencyAmount: number;
}

export function CreditData({ userCurrencyAmount }: CreditDataProps) {
  return (
    <div className="flex items-center space-x-2 mx-2 text-gray-500 dark:text-gray-400">
      <HiOutlineCurrencyDollar className="w-5 h-5" />
      <div className="flex flex-col items-center">
        <span className="text-sm">{`R$ ${userCurrencyAmount}`}</span>
        <span className="text-xs">Créditos</span>
      </div>
    </div>
  );
}
