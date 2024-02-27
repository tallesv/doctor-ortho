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

  const treatments: Treatment[] = data?.data;

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
        <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
            Tratamento
          </h2>
          {/*  <p className="mb-4 font-light">Texto teste</p> */}
          {treatments.map(treatment => (
            <p key={treatment.id} className="mb-4 font-medium">
              {treatment.description}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
