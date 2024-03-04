export function getButtonColorStyle(color: string) {
  switch (color) {
    case 'blue':
      return 'bg-sky-500 border-gray-200 dark:border-gray-500 disabled:bg-sky-600 text-white hover:bg-sky-600 focus:ring-sky-300';
    case 'light':
      return 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700';
    case 'red':
      return 'bg-red-500 border-gray-200 hover:bg-red-600 text-gray-100 focus:ring-red-700 dark:focus:ring-red-700 dark:bg-red-600 dark:text-gray-200 dark:border-red-900 dark:hover:text-white dark:hover:bg-red-700';
    default:
      return '';
  }
}
