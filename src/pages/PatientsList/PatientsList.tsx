import { Table } from 'flowbite-react';
import { useState } from 'react';
import Pagination from '../../components/Pagination';
import { LoadingLayout } from '../../layout/LoadingLayout';
import { useAuth } from '@/hooks/auth';
import { usePatientsQuery } from '@/shared/api/Patients/usePatientsQuery';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchInput from '@/components/SearchInput';

export type ReportsProps = {
  id: number;
  patient_name: string;
  patient_gender: string;
  patient_age: number;
  fields: string;
  created_at: string;
};

export function PatientsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const contentPerPage = 10;

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  const { data: patientsData, isLoading: isPatientsDataLoading } =
    usePatientsQuery(userFirebaseId);

  if (isPatientsDataLoading) {
    return <LoadingLayout />;
  }

  const patients = patientsData ?? [];

  const termSearched = searchParams.get('search') || '';
  const filteredData = patients?.filter(patient =>
    patient.name.toLowerCase().includes(termSearched.toLowerCase()),
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

  function handleRedirectToReportsListPage(patientId: number) {
    navigate(`/reports/${patientId}`);
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <h2 className="my-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
              Pacientes
            </h2>
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <SearchInput
                placeholder="Procure pelo Nome do paciente"
                onChange={e => handleSearchContent(e.target.value)}
              />
              <div className="overflow-x-auto sm:rounded-lg">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Nome</Table.HeadCell>
                    <Table.HeadCell>Sexo</Table.HeadCell>
                    <Table.HeadCell>Idade</Table.HeadCell>
                    <Table.HeadCell>Data de criação</Table.HeadCell>
                    <Table.HeadCell>Relátorios</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {filteredData
                      ?.slice(
                        (currentPage - 1) * contentPerPage,
                        contentPerPage * currentPage,
                      )
                      .map(patient => (
                        <Table.Row
                          key={patient.id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {patient.name}
                          </Table.Cell>
                          <Table.Cell>{patient.gender}</Table.Cell>
                          <Table.Cell>{patient.age}</Table.Cell>
                          <Table.Cell>
                            {new Date(patient.created_at).toLocaleDateString(
                              'pt-BR',
                            )}
                          </Table.Cell>
                          <Table.Cell className="flex items-center">
                            <button
                              type="button"
                              className="text-white bg-gray-300 hover:bg-gray-400 focus:ring-2 focus:outline-none focus:ring-sky-400 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-gray-700 dark:hover:bg-gray-800"
                              onClick={() =>
                                handleRedirectToReportsListPage(patient.id)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                                />
                              </svg>

                              <span className="sr-only">Icon description</span>
                            </button>
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
