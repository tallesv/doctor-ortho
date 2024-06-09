import { Table } from 'flowbite-react';
import { HiOutlineSwitchVertical } from 'react-icons/hi';

import { useState } from 'react';
import Pagination from '../../components/Pagination';
import { useSearchParams } from 'react-router-dom';
import SearchInput from '../../components/SearchInput';

type QuestionaryType = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
};

const mockQuestionary = [
  {
    id: '11',
    user: {
      id: '1',
      name: 'Talles',
      email: 'talles@mail.com',
    },
    created_at: '2024-01-31T04:58:44.952Z',
  },

  {
    id: '12',
    user: {
      id: '1',
      name: 'Talles',
      email: 'talles@mail.com',
    },
    created_at: '2024-01-31T04:58:44.952Z',
  },

  {
    id: '13',
    user: {
      id: '1',
      name: 'Erick',
      email: 'erick@mail.com',
    },
    created_at: '2024-01-31T04:58:44.952Z',
  },
];

export function Questionaries() {
  const [currentPage, setCurrentPage] = useState(1);
  const contentPerPage = 10;

  const [searchParams, setSearchParams] = useSearchParams();

  /* if (isLoading) {
    return <LoadingLayout />;
  } */

  const questionaries: QuestionaryType[] = mockQuestionary;

  const termSearched = searchParams.get('search') || '';
  const filteredData = questionaries.filter(
    (questionary: QuestionaryType) =>
      questionary.user.name
        .toLowerCase()
        .includes(termSearched.toLowerCase()) ||
      questionary.user.email.toLowerCase().includes(termSearched.toLowerCase()),
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
              Questionários
            </h2>
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <SearchInput
                placeholder="Procure pelo Nome ou Email"
                onChange={e => handleSearchContent(e.target.value)}
              />
              <div className="overflow-x-auto sm:rounded-lg">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Título</Table.HeadCell>
                    <Table.HeadCell>Criador</Table.HeadCell>
                    <Table.HeadCell className="flex items-center space-x-2">
                      <span> Data de criação</span>
                      <button className="hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md p-1">
                        <HiOutlineSwitchVertical className="h-4 w-4" />
                      </button>
                    </Table.HeadCell>
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
                      .map(questionary => (
                        <Table.Row
                          key={questionary.id}
                          className="cursor-pointer bg-white dark:border-gray-700 dark:bg-gray-800"
                          onClick={() => console.log(questionary)}
                        >
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {questionary.user.name}
                          </Table.Cell>
                          <Table.Cell className="flex flex-col">
                            <span className="text-gray-900 dark:text-white font-medium">
                              {questionary.user.name}
                            </span>
                            <span>{questionary.user.email}</span>
                          </Table.Cell>
                          <Table.Cell>
                            {new Date(
                              questionary.created_at,
                            ).toLocaleDateString('pt-BR')}
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
