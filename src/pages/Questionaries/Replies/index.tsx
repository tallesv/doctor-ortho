import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../../client/api';
import { LoadingLayout } from '../../../layout/LoadingLayout';
import { HiPlus } from 'react-icons/hi';
import { Table } from 'flowbite-react';
//import { QuestionFormData, QuestionModal } from './components/QuestionModal';
import { useState } from 'react';
import { queryClient } from '../../../config/queryClient';
//import { DeleteQuestionModal } from './components/DeleteQuestionModal';
import { HiChevronRight } from 'react-icons/hi';
import { ReplyFormData, ReplyModal } from './components/ReplyModal';
import { Question } from '../Questions';
import { DeleteReplyModal } from './components/DeleteReplyModal';
import { useQuestionsQuery, useRepliesQuery } from '../useQuestionariesQuery';

export type Reply = {
  id: number;
  answer: string;
  question_id: number;
  next_question_id: number;
  treatment_id: number;
};

export function Replies() {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyToEdit, setReplyToEdit] = useState<Reply | undefined>(undefined);
  const [replyToDelete, setReplyToDelete] = useState<Reply | undefined>(
    undefined,
  );

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const questionId = searchParams.get('question_id');
  const blockId = searchParams.get('block_id');

  if (!blockId || !questionId) {
    return <LoadingLayout />;
  }

  const { data: questionsResponse, isLoading: isQuestionsRequestLoading } =
    useQuestionsQuery(blockId);

  const { data: repliesResponse, isLoading } = useRepliesQuery(questionId);

  const { mutate: createReply, isPending: isCreateReplyPending } = useMutation({
    mutationFn: async (data: ReplyFormData): Promise<{ data: Reply }> => {
      return api.post(`/questions/${questionId}/replies`, data);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: repliesResponse => {
      const { data: newReply } = repliesResponse;

      queryClient.setQueryData(
        ['replies', questionId],
        (response: { data: Reply[] }) => {
          response.data = [...response.data, newReply];
          return response;
        },
      );
    },
    onSettled: () => {
      setShowReplyModal(false);
    },
  });

  const { mutate: editReply, isPending: isEditReplyPending } = useMutation({
    mutationFn: async (data: {
      reply: ReplyFormData;
      replyId: number;
    }): Promise<{ data: Reply }> => {
      const { reply, replyId } = data;
      return api.put(`/questions/${questionId}/replies/${replyId}`, reply);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: repliesResponse => {
      const { data: updatedReplies } = repliesResponse;

      queryClient.setQueryData(
        ['replies', questionId],
        (response: { data: Reply[] }) => {
          response.data = response.data.map(item =>
            item.id === updatedReplies.id ? updatedReplies : item,
          );
          return response;
        },
      );
    },
    onSettled: () => {
      setReplyToEdit(undefined);
    },
  });

  const { mutate: deleteReply, isPending: isDeleteReplyPending } = useMutation({
    mutationFn: async (id: number): Promise<{ data: Reply }> => {
      return api.delete(`/questions/${questionId}/replies/${id}`);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: (_, replyId) => {
      queryClient.setQueryData(
        ['replies', questionId],
        (response: { data: Reply[] }) => {
          response.data = replies.filter(item => item.id !== replyId);
          return response;
        },
      );
      setReplyToDelete(undefined);
    },
    onSettled: () => {
      setShowReplyModal(false);
    },
  });
  if (isLoading || isQuestionsRequestLoading) {
    return <LoadingLayout />;
  }

  const replies: Reply[] = repliesResponse?.data;
  const questions: Question[] = questionsResponse?.data;

  function handleCloseQuestionModal() {
    if (showReplyModal) {
      setShowReplyModal(false);
    }
    if (replyToEdit) {
      setReplyToEdit(undefined);
    }
  }

  function getNextQuestionQuery(next_question_id: number | undefined) {
    if (!next_question_id) {
      return '-';
    }
    return questions.find(question => question.id === next_question_id)?.query;
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <ReplyModal
        onCloseModal={() => handleCloseQuestionModal()}
        showModal={showReplyModal || !!replyToEdit}
        onCreate={data => createReply(data)}
        onEdit={data => editReply(data)}
        reply={replyToEdit}
        questionBlockId={blockId}
        type={replyToEdit ? 'edit' : 'create'}
        isSubmitting={isCreateReplyPending || isEditReplyPending}
      />

      {replyToDelete && (
        <DeleteReplyModal
          showModal={!!replyToDelete}
          reply={replyToDelete}
          onCloseModal={() => setReplyToDelete(undefined)}
          onSubmmit={replyId => deleteReply(replyId)}
          isSubmitting={isDeleteReplyPending}
        />
      )}
      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <div className="flex items-center space-x-1">
              <a
                className="cursor-pointer font-bold underline"
                onClick={() => navigate('/blocks')}
              >
                Blocos
              </a>
              <HiChevronRight className="h-10 w-5" />
              <a
                className="cursor-pointer font-bold underline"
                onClick={() => navigate(`/questions?block_id=${blockId}`)}
              >
                {`Questões do bloco ${blockId}`}
              </a>
              <HiChevronRight className="h-10 w-5" />
              <span className="font-bold">{`Respostas da questão ${questionId}`}</span>
            </div>

            <h2 className="my-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
              Respostas
            </h2>
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full flex justify-end">
                  <Button onClick={() => setShowReplyModal(true)}>
                    <HiPlus className="mr-2" />
                    Adicionar resposta
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto sm:rounded-lg">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Resposta</Table.HeadCell>
                    <Table.HeadCell>Próxima questão</Table.HeadCell>
                    <Table.HeadCell>Ações</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {replies.map(reply => (
                      <Table.Row
                        key={reply.id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {reply.answer}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {getNextQuestionQuery(reply.next_question_id)}
                        </Table.Cell>
                        <Table.Cell className="flex space-x-2">
                          <a
                            className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer"
                            onClick={() => setReplyToEdit(reply)}
                          >
                            <p>Editar</p>
                          </a>

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
