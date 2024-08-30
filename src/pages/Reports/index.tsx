import { Table } from 'flowbite-react';
import { useState } from 'react';
import Pagination from '../../components/Pagination';
import { useSearchParams } from 'react-router-dom';
import { LoadingLayout } from '../../layout/LoadingLayout';
import SearchInput from '../../components/SearchInput';
import { useReportsQuery } from '@/shared/api/Reports/useReportQuery';
import { useAuth } from '@/hooks/auth';
import { ReportAnswersModal } from './components/ReportAnswersModal';
import { useQuestionsBlockQuery } from '@/shared/api/QuestionsBlocks/useQuestionsBlocksQuery';
import { DeleteReportModal } from './components/DeleteReportModal';
import { useDeleteReportMutation } from '@/shared/api/Reports/useReportMutation';

export type ReportsProps = {
  id: number;
  patient_name: string;
  patient_gender: string;
  patient_age: number;
  fields: string;
  created_at: string;
};

export function Reports() {
  const [currentPage, setCurrentPage] = useState(1);
  const contentPerPage = 10;
  const [reportAnswersToShow, setReportAnswersToShow] =
    useState<ReportsProps>();

  const [reportToDelete, setReportToDelete] = useState<ReportsProps>();

  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  const { data: reportsData, isLoading: isReportsDataLoading } =
    useReportsQuery(userFirebaseId);

  const { data: questionaryData, isLoading: isQuestionaryDataLoading } =
    useQuestionsBlockQuery(userFirebaseId);

  const { mutate: deleteReport, isPending: isDeleteReportPending } =
    useDeleteReportMutation(userFirebaseId, setReportToDelete);

  if (isReportsDataLoading || isQuestionaryDataLoading) {
    return <LoadingLayout />;
  }

  const reports: ReportsProps[] = reportsData?.data;

  const termSearched = searchParams.get('search') || '';
  const filteredData = reports.filter((report: ReportsProps) =>
    report.patient_name.toLowerCase().includes(termSearched.toLowerCase()),
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
      {reportAnswersToShow && questionaryData && (
        <ReportAnswersModal
          answers={JSON.parse(reportAnswersToShow.fields)}
          questionaryBlocks={questionaryData}
          showModal={!!reportAnswersToShow}
          onCloseModal={() => setReportAnswersToShow(undefined)}
        />
      )}

      <DeleteReportModal
        showModal={!!reportToDelete?.id}
        report={reportToDelete}
        onCloseModal={() => setReportToDelete(undefined)}
        onSubmmit={blockId => deleteReport(blockId)}
        isSubmitting={isDeleteReportPending}
      />

      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <h2 className="my-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
              Relátorios
            </h2>
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <SearchInput
                placeholder="Procure pelo Nome do paciente"
                onChange={e => handleSearchContent(e.target.value)}
              />
              <div className="overflow-x-auto sm:rounded-lg">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Paciente</Table.HeadCell>
                    <Table.HeadCell>Sexo</Table.HeadCell>
                    <Table.HeadCell>Idade</Table.HeadCell>
                    <Table.HeadCell>Data de criação</Table.HeadCell>
                    <Table.HeadCell>Relátorio</Table.HeadCell>
                    <Table.HeadCell>
                      <span className="sr-only">Delete</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {filteredData
                      .slice(
                        (currentPage - 1) * contentPerPage,
                        contentPerPage * currentPage,
                      )
                      .map(report => (
                        <Table.Row
                          key={report.id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {report.patient_name}
                          </Table.Cell>
                          <Table.Cell>{report.patient_gender}</Table.Cell>
                          <Table.Cell>{report.patient_age}</Table.Cell>
                          <Table.Cell>
                            {new Date(report.created_at).toLocaleDateString(
                              'pt-BR',
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <a
                              className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer"
                              onClick={() => setReportAnswersToShow(report)}
                            >
                              <p>Respostas</p>
                            </a>
                          </Table.Cell>
                          <Table.Cell>
                            <a
                              className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer"
                              onClick={() => setReportToDelete(report)}
                            >
                              <p>Excluir</p>
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
