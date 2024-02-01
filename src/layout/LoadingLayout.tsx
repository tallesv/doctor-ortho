import { Spinner } from 'flowbite-react';

export function LoadingLayout() {
  return (
    <div className="flex flex-wrap h-3/5 items-center justify-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
    </div>
  );
}
