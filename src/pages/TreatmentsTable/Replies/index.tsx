import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { HiPlus } from 'react-icons/hi';
import { Table } from 'flowbite-react';
import { useState } from 'react';
import { Button } from '../../../components/Button';
import { LoadingLayout } from '../../../layout/LoadingLayout';
import { api } from '../../../client/api';
import { queryClient } from '../../../config/queryClient';
import { BlockType, QuestionType, ReplyType } from '../../Questionaries/types';
import { useBlocksQuery } from '../../Questionaries/useQuestionariesQuery';
import { useAuth } from '../../../hooks/auth';
import { AddReplyModal } from './components/AddReplyModal';
import { RemoveReplyModal } from './components/RemoveReplyModal';

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

export function TreatmentReply() {
  const [showAddReplyModal, setShowAddReplyModal] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<ReplyType | undefined>(
    undefined,
  );

  const { treatmentId } = useParams();
  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  const { data: blocksQuery, isLoading: isLoadingBlocksQuery } =
    useBlocksQuery(userFirebaseId);

  const { data: treatmentsQuery, isLoading: isLoadingTreatmentsQuery } =
    useQuery({
      queryKey: ['treatments'],
      queryFn: () => api.get(`treatments`),
    });

  const {
    mutate: addReplyToTreatment,
    isPending: isAddReplyToTreatmentPending,
  } = useMutation({
    mutationFn: async (data: {
      reply_id: number;
    }): Promise<{ data: TreatmentType }> => {
      const { reply_id } = data;
      const reply_ids = treatment.replies.map(reply => reply.id);
      reply_ids.push(reply_id);
      const treatmentData = { ...treatment, reply_ids };
      return api.put(`/treatments/${treatment.id}`, treatmentData);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: treatmentResponse => {
      const { data: updatedTreatment } = treatmentResponse;

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
      setShowAddReplyModal(false);
    },
  });

  const {
    mutate: removeReplyIdFromTreatment,
    isPending: isRemoveReplyIdFromTreatmentPending,
  } = useMutation({
    mutationFn: async (data: {
      replyIdToRemove: number;
    }): Promise<{ data: TreatmentType }> => {
      const { replyIdToRemove } = data;
      const reply_ids = treatment.replies
        .map(reply => reply.id)
        .filter(replyId => replyId !== replyIdToRemove);
      return api.put(`/treatments/${treatment.id}`, {
        ...treatment,
        reply_ids,
      });
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
      setReplyToDelete(undefined);
    },
  });

  if (isLoadingBlocksQuery || !treatmentId || isLoadingTreatmentsQuery) {
    return <LoadingLayout />;
  }

  const blocks: BlockType[] = blocksQuery?.data;
  const treatment: TreatmentType = treatmentsQuery?.data.find(
    (treatment: TreatmentType) => treatment.id === +treatmentId,
  );
  const replies = treatment.replies;

  function getQuestionByQuestionId(questionId: number) {
    let findQuestion: QuestionType | undefined = {} as QuestionType;
    blocks.some(block =>
      block.questions.find(question => {
        if (question.id === questionId) {
          findQuestion = question;
        }
        return question.id === questionId;
      }),
    );
    return findQuestion.query;
  }

  function getBlockByQuestionId(questionId: number) {
    const block = blocks.find(block =>
      block.questions.some(question => question.id === questionId),
    );
    return block?.name;
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <AddReplyModal
        onCloseModal={() => setShowAddReplyModal(false)}
        showModal={showAddReplyModal}
        onAddReply={data => addReplyToTreatment(data)}
        blocks={blocks}
        isSubmitting={isAddReplyToTreatmentPending}
      />

      {replyToDelete && (
        <RemoveReplyModal
          showModal={!!replyToDelete}
          reply={replyToDelete}
          onCloseModal={() => setReplyToDelete(undefined)}
          onSubmmit={replyId =>
            removeReplyIdFromTreatment({ replyIdToRemove: replyId })
          }
          isSubmitting={isRemoveReplyIdFromTreatmentPending}
        />
      )}

      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <h2 className="my-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
              Respostas do tratamento
            </h2>
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full flex justify-end">
                  <Button onClick={() => setShowAddReplyModal(true)}>
                    <HiPlus className="mr-2" />
                    Adicionar resposta
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto sm:rounded-lg">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Resposta</Table.HeadCell>
                    <Table.HeadCell>Questão</Table.HeadCell>
                    <Table.HeadCell>Bloco</Table.HeadCell>
                    <Table.HeadCell>Ações</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {replies?.map(reply => (
                      <Table.Row
                        key={reply.id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="font-medium text-gray-900 dark:text-white">
                          {reply.answer}
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-white">
                          {getQuestionByQuestionId(reply.question_id)}
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-white">
                          {getBlockByQuestionId(reply.question_id)}
                        </Table.Cell>
                        <Table.Cell className="flex space-x-2">
                          <a
                            className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer"
                            onClick={() => setReplyToDelete(reply)}
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
