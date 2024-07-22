import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../../client/api';
import { LoadingLayout } from '../../../layout/LoadingLayout';
import { HiPlus } from 'react-icons/hi';
import { Table } from 'flowbite-react';
import { useState } from 'react';
import { HiChevronRight } from 'react-icons/hi';
import { ReplyFormData, ReplyModal } from './components/ReplyModal';
import { DeleteReplyModal } from './components/DeleteReplyModal';
import { useAuth } from '../../../hooks/auth';
import { BlockType, QuestionType, ReplyType } from '../types';
import { useBlocksQuery } from '../../../shared/api/useQuestionariesQuery';
import uploadFile from '@/utils/uploadFile';
import deleteFile from '@/utils/deleteFile';

export function Replies() {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyToEdit, setReplyToEdit] = useState<ReplyType | undefined>(
    undefined,
  );
  const [replyToDelete, setReplyToDelete] = useState<ReplyType | undefined>(
    undefined,
  );

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const questionId = searchParams.get('question_id');
  const blockId = searchParams.get('block_id');

  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  if (!blockId || !questionId) {
    return <LoadingLayout />;
  }

  const {
    data: blocksResponse,
    refetch: refetchBlocksQuery,
    isLoading: isBlocksQueryLoading,
  } = useBlocksQuery(userFirebaseId);

  const { mutate: createReply, isPending: isCreateReplyPending } = useMutation({
    mutationFn: async (data: ReplyFormData): Promise<{ data: ReplyType }> => {
      const replyPayload = data;
      const { image } = replyPayload;
      replyPayload.image =
        image && typeof image === 'object' ? await uploadFile(image[0]) : '';

      return api.post(`/questions/${questionId}/replies`, replyPayload);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: () => {
      refetchBlocksQuery();
    },
    onSettled: () => {
      setShowReplyModal(false);
    },
  });

  const { mutate: editReply, isPending: isEditReplyPending } = useMutation({
    mutationFn: async (data: {
      reply: ReplyFormData;
      replyId: number;
    }): Promise<{ data: ReplyType }> => {
      const { reply, replyId } = data;

      const editReplyPayload = reply;
      const { image } = editReplyPayload;
      const findReply = replies?.find(reply => reply.id === replyId);

      //console.log(editReplyPayload);

      if (findReply?.image !== image) {
        if (findReply?.image && findReply.image !== '') {
          await deleteFile(findReply?.image);
        }
        editReplyPayload.image =
          typeof image === 'object' ? await uploadFile(image[0]) : '';
      }
      return api.put(
        `/questions/${questionId}/replies/${replyId}`,
        editReplyPayload,
      );
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: () => {
      refetchBlocksQuery();
    },
    onSettled: () => {
      setReplyToEdit(undefined);
    },
  });

  const { mutate: deleteReply, isPending: isDeleteReplyPending } = useMutation({
    mutationFn: async (id: number): Promise<{ data: ReplyType }> => {
      return api.delete(`/questions/${questionId}/replies/${id}`);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: () => {
      refetchBlocksQuery();
      setReplyToDelete(undefined);
    },
    onSettled: () => {
      setShowReplyModal(false);
    },
  });
  if (isBlocksQueryLoading) {
    return <LoadingLayout />;
  }

  const blocks: BlockType[] = blocksResponse?.data;
  const currentBlock = blocks.find((block: BlockType) => block.id === +blockId);
  const currentQuestion = currentBlock?.questions.find(
    question => question.id === +questionId,
  );
  const replies = currentQuestion?.replies;

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
    let findNextQuestion: QuestionType | undefined;
    blocks.forEach(block => {
      const questionFinded = block.questions.find(
        question => question.id === next_question_id,
      );
      if (questionFinded) {
        findNextQuestion = questionFinded;
      }
    });
    return findNextQuestion?.query;
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
        blocks={blocks}
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
                {`${currentBlock?.name}`}
              </a>
              <HiChevronRight className="h-10 w-5" />
              <span className="font-bold">{`${currentQuestion?.query}`}</span>
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
                    <Table.HeadCell>Coordenada</Table.HeadCell>
                    <Table.HeadCell>Resposta</Table.HeadCell>
                    <Table.HeadCell>Próxima questão</Table.HeadCell>
                    <Table.HeadCell>Ações</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {replies?.map(reply => (
                      <Table.Row
                        key={reply.id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {reply.coordinate}
                        </Table.Cell>
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
