import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <section className="grid min-h-full px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-sky-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-800 dark:text-white sm:text-5xl">
          Página não encontrada
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
          Não conseguimos encontrar a página que você está procurando.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </div>
    </section>
  );
}
