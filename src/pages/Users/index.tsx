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

  //const specialitySelected = searchParams.get('speciality') || 'Ortodontia';
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

  // function handleSelectSpeciality(specialitySelected: string) {
  //   setCurrentPage(1);
  //   setSearchParams(state => {
  //     if (specialitySelected === '') {
  //       state.delete('search');
  //     } else {
  //       state.set('speciality', specialitySelected);
  //     }
  //     return state;
  //   });
  // }

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between pb-4">
        {/* <Dropdown
          label={specialitySelected}
          renderTrigger={() => (
            <button
              id="dropdownRadioButton"
              data-dropdown-toggle="dropdownRadio"
              className="sm:w-52 w-full inline-flex justify-center items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
            >
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400 mr-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
              </svg>
              {specialitySelected}
              <svg
                className="w-2.5 h-2.5 ml-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
          )}
        >
          {specialitiesType.map(speciality => (
            <Dropdown.Item key={speciality}>
              <div
                className="flex items-center rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => handleSelectSpeciality(speciality)}
              >
                <input
                  id="filter-radio-example-1"
                  type="radio"
                  value={speciality}
                  defaultChecked={specialitySelected === speciality}
                  name="filter-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="filter-radio-example-1"
                  className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                >
                  {speciality}
                </label>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown> */}
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
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
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
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
      </div>

      <div className="flex justify-center sm:justify-end">
        <Pagination
          currentPage={currentPage}
          onPageChange={page => setCurrentPage(page)}
          totalQuantityOfData={filteredData.length}
          dataPerPage={contentPerPage}
        />
      </div>
    </div>
  );
}
