import { useQuery } from '@tanstack/react-query';
import { Table } from 'flowbite-react';
import { api } from '../../client/api';
import { useState } from 'react';
import Pagination from '../../components/Pagination';
import { useSearchParams } from 'react-router-dom';
import { LoadingLayout } from '../../layout/LoadingLayout';

type UserProps = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  phone_number: string;
  type: string;
  created_at: string;
};

export function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const contentPerPage = 10;

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users'),
  });

  if (isLoading) {
    return <LoadingLayout />;
  }

  const users: UserProps[] = data?.data;

  const termSearched = searchParams.get('search') || '';
  const filteredData = users.filter(
    (user: UserProps) =>
      user.name.toLowerCase().includes(termSearched.toLowerCase()) ||
      user.email.toLowerCase().includes(termSearched.toLowerCase()),
  );

  function handleSearchContent(data: string) {
    setCurrentPage(1);
    setSearchParams(state => {
      if (data === '') {
        state.delete('search');
      } else {
        state.set('search', data);
      }
      return state;
    });
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <h2 className="my-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
              Usuários
            </h2>
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="flex flex-col w-full sm:flex-row gap-2 sm:items-center justify-between">
                  <label htmlFor="table-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-64">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="table-search"
                      className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Procure pelo Nome ou Email"
                      onChange={e => handleSearchContent(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto sm:rounded-lg">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Nome</Table.HeadCell>
                    <Table.HeadCell>Email</Table.HeadCell>
                    <Table.HeadCell>Telefone</Table.HeadCell>
                    <Table.HeadCell>Especialidade</Table.HeadCell>
                    <Table.HeadCell>Data de criação</Table.HeadCell>
                    <Table.HeadCell>
                      <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {filteredData
                      .slice(
                        (currentPage - 1) * contentPerPage,
                        contentPerPage * currentPage,
                      )
                      .map(user => (
                        <Table.Row
                          key={user.id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </Table.Cell>
                          <Table.Cell>{user.email}</Table.Cell>
                          <Table.Cell>{user.phone_number}</Table.Cell>
                          <Table.Cell>{user.specialty}</Table.Cell>
                          <Table.Cell>
                            {new Date(user.created_at).toLocaleDateString(
                              'pt-BR',
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <a className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer">
                              <p>Editar</p>
                            </a>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table>

                <Pagination
                  currentPage={currentPage}
                  onPageChange={page => setCurrentPage(page)}
                  totalQuantityOfData={filteredData.length}
                  dataPerPage={contentPerPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
