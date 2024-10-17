import { Table } from 'flowbite-react';
import { useState } from 'react';
import Pagination from '../../components/Pagination';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingLayout } from '../../layout/LoadingLayout';
import { useReportsQuery } from '@/shared/api/Reports/useReportQuery';
import { useAuth } from '@/hooks/auth';
import { ReportAnswersModal } from './components/ReportAnswersModal';
import { useQuestionsBlockQuery } from '@/shared/api/QuestionsBlocks/useQuestionsBlocksQuery';
import { HiOutlineArrowSmLeft, HiDocumentText } from 'react-icons/hi';

export type ReportsProps = {
  id: number;
  fields: string;
  created_at: string;
};

export function Reports() {
  const [currentPage, setCurrentPage] = useState(1);
  const contentPerPage = 10;
  const [reportAnswersToShow, setReportAnswersToShow] =
    useState<ReportsProps>();

  const { patientId } = useParams();
  const navigate = useNavigate();

  if (!patientId) {
    navigate(-1);
    return null;
  }

  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  const { data: reportsData, isLoading: isReportsDataLoading } =
    useReportsQuery(userFirebaseId, patientId);

  const { data: questionaryData, isLoading: isQuestionaryDataLoading } =
    useQuestionsBlockQuery(userFirebaseId);

  if (isReportsDataLoading || isQuestionaryDataLoading) {
    return <LoadingLayout />;
  }

  const reports: ReportsProps[] = reportsData?.data;
  const questionary = questionaryData?.sort(
    (a, b) =>
      new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf(),
  );

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      {reportAnswersToShow && questionary && (
        <ReportAnswersModal
          answers={JSON.parse(reportAnswersToShow.fields)}
          questionaryBlocks={questionary}
          showModal={!!reportAnswersToShow}
          onCloseModal={() => setReportAnswersToShow(undefined)}
        />
      )}

      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <div className="flex items-center">
              <button
                type="button"
                className="text-gray-500 hover:bg-gray-300 focus:ring-2 focus:outline-none focus:ring-sky-400 font-medium h-14 w-14 rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:hover:bg-gray-800"
                onClick={() => navigate('/patients')}
              >
                <HiOutlineArrowSmLeft className="h-14 w-14" />
              </button>
              <h2 className="my-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
                Relátorios
              </h2>
            </div>
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              {/*  <SearchInput
                placeholder="Procure pelo Nome do paciente"
                onChange={e => handleSearchContent(e.target.value)}
              /> */}
              <div className="overflow-x-auto sm:rounded-lg">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Data de criação</Table.HeadCell>
                    <Table.HeadCell>Relátorio</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {reports
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
                            {new Date(report.created_at).toLocaleDateString(
                              'pt-BR',
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <button
                              type="button"
                              className="text-white bg-gray-300 hover:bg-gray-400 focus:ring-2 focus:outline-none focus:ring-sky-400 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-gray-700 dark:hover:bg-gray-800"
                              onClick={() => setReportAnswersToShow(report)}
                            >
                              <HiDocumentText className="w-5 h-5" />
                            </button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table>

                <Pagination
                  currentPage={currentPage}
                  onPageChange={page => setCurrentPage(page)}
                  totalQuantityOfData={reports.length}
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
