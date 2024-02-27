import { useQuery } from '@tanstack/react-query';
import { api } from '../../client/api';
import { LoadingLayout } from '../../layout/LoadingLayout';
import { useSearchParams } from 'react-router-dom';

type Treatment = {
  id: number;
  description: string;
};

export function Treatment() {
  const [searchParams] = useSearchParams();
  const answers = searchParams.get('answers');

  const { data, isLoading } = useQuery({
    queryKey: ['treatments', { answers }],
    queryFn: () => api.get(`/treatments/${answers}`),
  });

  if (isLoading) {
    return <LoadingLayout />;
  }

  const treatments: Treatment[] = [
    ...data?.data,
    ...data?.data,
    ...data?.data,
    ...data?.data,
  ];

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
        <div className="flex flex-col items-center max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
            Tratamento
          </h2>

          <div className="mx-auto max-w-4xl mt-8 p-2 xl:p-6 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 dark:bg-gray-800">
            <div className="mx-auto">
              {/*  <p className="mb-4 font-light">Texto teste</p> */}
              {treatments.map((treatment, index) => (
                <div key={`${treatment.id}-${index}`}>
                  <span className="text-gray-800 dark:text-white font-semibold text-xl">{`Treatment: ${treatment.id}`}</span>
                  <p className="mt-1">{treatment.description}</p>
                  {index !== treatments.length - 1 && (
                    <div className="my-6 border-t border-gray-200 dark:border-gray-700 w-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
