import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HiPlus } from 'react-icons/hi';
import { Table } from 'flowbite-react';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { LoadingLayout } from '../../layout/LoadingLayout';
import { api } from '../../client/api';
import { DeleteTreatmentModal } from './components/DeleteTreatmentModal';
import { ReplyType } from '../Questionaries/types';
import { useTreatmentsQuery } from '../../shared/api/useTreatmentsQuery';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';

export type TreatmentType = {
  id: number;
  description: string;
  replies: ReplyType[];
  created_at: string;
};

export type TreatmentPayloadData = {
  id: number;
  description: string;
  reply_ids: number[];
};

export function TreatmentsTable() {
  const [treatmentToDelete, setTreatmentToDelete] = useState<
    TreatmentType | undefined
  >(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const contentPerPage = 10;

  const { data: treatmentsQuery, isLoading: isLoadingTreatmentsQuery } =
    useTreatmentsQuery();

  const queryClient = useQueryClient();

  const { mutate: deleteTreatment, isPending: isDeleteTreatmentPending } =
    useMutation({
      mutationFn: async (id: number) => {
        return api.delete(`/treatments/${id}`);
      },
      onError: err => {
        toast.error('Não foi possível deletar o tratamento.');
        console.log(err);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['treatments'] });
      },
      onSettled: () => {
        setTreatmentToDelete(undefined);
      },
    });

  if (isLoadingTreatmentsQuery) {
    return <LoadingLayout />;
  }

  const treatments: TreatmentType[] = treatmentsQuery?.data.sort(
    (a: TreatmentType, b: TreatmentType) =>
      new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf(),
  );

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      {treatmentToDelete && (
        <DeleteTreatmentModal
          showModal={!!treatmentToDelete?.id}
          treatment={treatmentToDelete}
          onCloseModal={() => setTreatmentToDelete(undefined)}
          onSubmmit={treatmentId => deleteTreatment(treatmentId)}
          isSubmitting={isDeleteTreatmentPending}
        />
      )}
      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <h2 className="my-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
              Tratamentos
            </h2>
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full flex justify-end">
                  <Link to={`/treatment-editor`}>
                    <Button>
                      <HiPlus className="mr-2" />
                      Adicionar tratamento
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto sm:rounded-lg">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Tratamento</Table.HeadCell>
                    <Table.HeadCell>Ações</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {treatments
                      .slice(
                        (currentPage - 1) * contentPerPage,
                        contentPerPage * currentPage,
                      )
                      .map(treatment => (
                        <Table.Row
                          key={treatment.id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="font-medium text-gray-900 dark:text-white">
                            {treatment.description}
                          </Table.Cell>
                          <Table.Cell className="flex space-x-2">
                            <Link to={`/treatment-editor/${treatment.id}`}>
                              <span className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer">
                                <p>Editar</p>
                              </span>
                            </Link>
                            <a
                              className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer"
                              onClick={() => setTreatmentToDelete(treatment)}
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
                  totalQuantityOfData={treatments.length}
                  dataPerPage={contentPerPage}
                  onPageChange={page => setCurrentPage(page)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
