export function getInputBorderStyle(isWithError: boolean | undefined) {
  return isWithError
    ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-sky-400 focus:ring-sky-400';
}
