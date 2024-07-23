import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../../client/api';
import { LoadingLayout } from '../../../layout/LoadingLayout';
import { HiPlus } from 'react-icons/hi';
import { Table } from 'flowbite-react';
import { QuestionFormData, QuestionModal } from './components/QuestionModal';
import { useState } from 'react';
import { DeleteQuestionModal } from './components/DeleteQuestionModal';
import { HiChevronRight } from 'react-icons/hi';
import { BlockType, QuestionType } from '../types';
import { useAuth } from '../../../hooks/auth';
import { useBlocksQuery } from '../../../shared/api/useQuestionariesQuery';
import uploadFile from '@/utils/uploadFile';
import deleteFile from '@/utils/deleteFile';

export function Questions() {
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<
    QuestionType | undefined
  >(undefined);
  const [questionToDelete, setQuestionToDelete] = useState<
    QuestionType | undefined
  >(undefined);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const blockId = searchParams.get('block_id');

  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  if (!blockId) {
    return <LoadingLayout />;
  }

  const {
    data: blocksResponse,
    refetch: refetchBlocksQuery,
    isLoading: isBlocksQueryLoading,
  } = useBlocksQuery(userFirebaseId);

  const { mutate: createQuestion, isPending: isCreateQuestoinPending } =
    useMutation({
      mutationFn: async (
        data: QuestionFormData,
      ): Promise<{ data: QuestionType }> => {
        const { query, image } = data;
        const imageUploaded =
          image && typeof image === 'object' ? await uploadFile(image[0]) : '';

        return api.post(`/questions_sets/${blockId}/questions`, {
          query,
          image: imageUploaded,
        });
      },
      onError: err => {
        console.log(err);
      },
      onSuccess: () => {
        refetchBlocksQuery();
      },
      onSettled: () => {
        setShowQuestionModal(false);
      },
    });

  const { mutate: editQuestion, isPending: isEditQuestionPending } =
    useMutation({
      mutationFn: async (data: {
        query: string;
        id: number;
        image?: FileList | string;
      }): Promise<{ data: QuestionType }> => {
        const editQuestionPayload = data;
        const { id, image } = editQuestionPayload;
        const findQuestion = questions.find(question => question.id === id);

        if (findQuestion?.image !== image) {
          if (findQuestion?.image && findQuestion.image !== '') {
            await deleteFile(findQuestion?.image);
          }
          editQuestionPayload.image =
            typeof image === 'object' ? await uploadFile(image[0]) : '';
        }

        return api.put(
          `/questions_sets/${blockId}/questions/${data.id}`,
          editQuestionPayload,
        );
      },
      onError: err => {
        console.log(err);
      },
      onSuccess: () => {
        refetchBlocksQuery();
      },
      onSettled: () => {
        setQuestionToEdit(undefined);
      },
    });

  const { mutate: deleteQuestion, isPending: isDeleteQuestionPending } =
    useMutation({
      mutationFn: async (id: number): Promise<{ data: QuestionType }> => {
        const findQuestion = questions.find(question => question.id === id);
        if (findQuestion?.image && findQuestion?.image !== '') {
          await deleteFile(findQuestion?.image);
        }

        return api.delete(`/questions_sets/${blockId}/questions/${id}`);
      },
      onError: err => {
        console.log(err);
      },
      onSuccess: () => {
        refetchBlocksQuery();
        setQuestionToDelete(undefined);
      },
      onSettled: () => {
        setShowQuestionModal(false);
      },
    });

  if (isBlocksQueryLoading) {
    return <LoadingLayout />;
  }

  const currentBlock: BlockType = blocksResponse?.data.find(
    (block: BlockType) => block.id === +blockId,
  );
  const questions: QuestionType[] = currentBlock.questions;

  function handleCloseQuestionModal() {
    if (showQuestionModal) {
      setShowQuestionModal(false);
    }
    if (questionToEdit) {
      setQuestionToEdit(undefined);
    }
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <QuestionModal
        onCloseModal={() => handleCloseQuestionModal()}
        showModal={showQuestionModal || !!questionToEdit?.id}
        onCreate={data => createQuestion(data)}
        onEdit={data => editQuestion(data)}
        question={questionToEdit}
        type={questionToEdit ? 'edit' : 'create'}
        isSubmitting={isCreateQuestoinPending || isEditQuestionPending}
      />

      {questionToDelete && (
        <DeleteQuestionModal
          showModal={!!questionToDelete?.id}
          question={questionToDelete}
          onCloseModal={() => setQuestionToDelete(undefined)}
          onSubmmit={questionId => deleteQuestion(questionId)}
          isSubmitting={isDeleteQuestionPending}
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
              <span className="font-bold">{`${currentBlock.name}`}</span>
            </div>

            <h2 className="my-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
              Questões
            </h2>
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full flex justify-end">
                  <Button onClick={() => setShowQuestionModal(true)}>
                    <HiPlus className="mr-2" />
                    Adicionar questão
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto sm:rounded-lg">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Titúlo</Table.HeadCell>
                    <Table.HeadCell>Ações</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {questions.map(question => (
                      <Table.Row
                        key={question.id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {question.query}
                        </Table.Cell>
                        <Table.Cell className="flex space-x-2">
                          <a
                            className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer"
                            onClick={() => setQuestionToEdit(question)}
                          >
                            <p>Editar</p>
                          </a>
                          <a
                            className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/replies?block_id=${blockId}&question_id=${question.id}`,
                              )
                            }
                          >
                            <p>Respostas</p>
                          </a>

                          <a
                            className="font-medium text-sky-500 hover:underline dark:text-sky-600 cursor-pointer"
                            onClick={() => setQuestionToDelete(question)}
                          >
                            <p>Excluir</p>
                          </a>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
              {/* <nav
                  className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 border-t border-gray-200 dark:border-gray-600"
                  aria-label="Table navigation"
                >
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing
                    <span className="font-semibold text-gray-900 dark:text-white">
                      1-10
                    </span>
                    of
                    <span className="font-semibold text-gray-900 dark:text-white">
                      1000
                    </span>
                  </span>
                  <ul className="inline-flex items-stretch -space-x-px">
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        1
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        2
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        aria-current="page"
                        className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      >
                        3
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        ...
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        100
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </nav> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
