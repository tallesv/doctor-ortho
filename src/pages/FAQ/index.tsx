import { DocMenu } from '../../components/DocMenu';

export function FAQ() {
  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex justify-between">
                <div>
                  <DocMenu />
                </div>
                <div className="flex-grow">
                  <h2 className="my-6 ml-10 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
                    FAQ
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
