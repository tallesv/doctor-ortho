import { useQuery } from '@tanstack/react-query';
import { Table } from 'flowbite-react';
import { api } from '../../client/api';
import { useState } from 'react';
import Pagination from '../../components/Pagination';
import { useSearchParams } from 'react-router-dom';
import { LoadingLayout } from '../../layout/LoadingLayout';
import SearchInput from '../../components/SearchInput';

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
              <SearchInput
                placeholder="Procure pelo Nome ou Email"
                onChange={e => handleSearchContent(e.target.value)}
              />
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
