import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { HiPlus } from 'react-icons/hi';
import { Table } from 'flowbite-react';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { LoadingLayout } from '../../layout/LoadingLayout';
import { api } from '../../client/api';
import { queryClient } from '../../config/queryClient';
import { DeleteTreatmentModal } from './components/DeleteTreatmentModal';
import { TreatmentFormData, TreatmentModal } from './components/TreatmentModal';
import { ReplyType } from '../Questionaries/types';

export type TreatmentType = {
  id: number;
  description: string;
  replies: ReplyType[];
};

export type TreatmentPayloadData = {
  id: number;
  description: string;
  reply_ids: number[];
};

export function TreatmentsTable() {
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [treatmentToEdit, setTreatmentToEdit] = useState<
    TreatmentType | undefined
  >(undefined);
  const [treatmentToDelete, setTreatmentToDelete] = useState<
    TreatmentType | undefined
  >(undefined);

  const navigate = useNavigate();

  const { data: treatmentsQuery, isLoading: isLoadingTreatmentsQuery } =
    useQuery({
      queryKey: ['treatments'],
      queryFn: () => api.get(`treatments`),
    });

  const { mutate: createTreatment, isPending: isCreateTreatmentPending } =
    useMutation({
      mutationFn: async (
        data: TreatmentFormData,
      ): Promise<{ data: TreatmentType }> => {
        const treatmentData = { ...data, reply_ids: [] };
        return api.post(`/treatments`, treatmentData);
      },
      onError: err => {
        console.log(err);
      },
      onSuccess: treatmentResponse => {
        const { data: newTreatment } = treatmentResponse;

        queryClient.setQueryData(
          ['treatments'],
          (response: { data: TreatmentType[] }) => {
            response.data = [...response.data, newTreatment];
            return response;
          },
        );
      },
      onSettled: () => {
        setShowTreatmentModal(false);
      },
    });

  const { mutate: editTreatment, isPending: isEditTreatmentPending } =
    useMutation({
      mutationFn: async (
        data: TreatmentPayloadData,
      ): Promise<{ data: TreatmentType }> => {
        return api.put(`/treatment/${data.id}`, data);
      },
      onError: err => {
        console.log(err);
      },
      onSuccess: ({ data: updatedTreatment }) => {
        queryClient.setQueryData(
          ['treatments'],
          (response: { data: TreatmentType[] }) => {
            response.data = response.data.map(item =>
              item.id === updatedTreatment.id ? updatedTreatment : item,
            );
            return response;
          },
        );
      },
      onSettled: () => {
        setTreatmentToEdit(undefined);
      },
    });

  const { mutate: deleteTreatment, isPending: isDeleteTreatmentPending } =
    useMutation({
      mutationFn: async (id: number): Promise<{ data: TreatmentType }> => {
        return api.delete(`/treatments/${id}`);
      },
      onError: err => {
        console.log(err);
      },
      onSuccess: (_, treatmentId) => {
        queryClient.setQueryData(
          ['treatments'],
          (response: { data: TreatmentType[] }) => {
            response.data = treatments.filter(item => item.id !== treatmentId);
            return response;
          },
        );

        setTreatmentToDelete(undefined);
      },
      onSettled: () => {
        setShowTreatmentModal(false);
      },
    });

  if (isLoadingTreatmentsQuery) {
    return <LoadingLayout />;
  }

  const treatments: TreatmentType[] = treatmentsQuery?.data;

  function handleCloseTreatmentModal() {
    if (showTreatmentModal) {
      setShowTreatmentModal(false);
    }
    if (treatmentToEdit) {
      setTreatmentToEdit(undefined);
    }
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <TreatmentModal
        onCloseModal={() => handleCloseTreatmentModal()}
        showModal={showTreatmentModal || !!treatmentToEdit?.id}
        onCreate={data => createTreatment(data)}
        onEdit={data => editTreatment(data)}
        treatment={treatmentToEdit}
        type={treatmentToEdit ? 'edit' : 'create'}
        isSubmitting={isCreateTreatmentPending || isEditTreatmentPending}
      />

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
                  <Button onClick={() => setShowTreatmentModal(true)}>
                    <HiPlus className="mr-2" />
                    Adicionar tratamento
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto sm:rounded-lg">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Tratamento</Table.HeadCell>
                    <Table.HeadCell>Ações</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {treatments.map(treatment => (
                      <Table.Row
                        key={treatment.id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="font-medium text-gray-900 dark:text-white">
                          {treatment.description}
                        </Table.Cell>
                        <Table.Cell className="flex space-x-2">
                          <a
                            className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer"
                            onClick={() => setTreatmentToEdit(treatment)}
                          >
                            <p>Editar</p>
                          </a>
                          <a
                            className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer"
                            /* onClick={() =>
                              navigate(
                                `/replies?block_id=${blockId}&question_id=${question.id}`,
                              )
                            } */
                          >
                            <p>Respostas</p>
                          </a>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
