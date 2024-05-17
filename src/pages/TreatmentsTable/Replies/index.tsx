import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Button } from '../../../components/Button';
import { LoadingLayout } from '../../../layout/LoadingLayout';
import { api } from '../../../client/api';
import { queryClient } from '../../../config/queryClient';
import { BlockType, QuestionType, ReplyType } from '../../Questionaries/types';
import { useBlocksQuery } from '../../Questionaries/useQuestionariesQuery';
import { useAuth } from '../../../hooks/auth';
import Checkbox from '../../../components/Form/Checkbox';
import { RepliesTable } from './components/RepliesTable';
import * as yup from 'yup';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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

export type AddReplyFormData = {
  [x: string]: string | null;
};

const addReplyFormSchema = yup.object().shape({});

export function TreatmentReply() {
  const { treatmentId } = useParams();

  let questions: QuestionType[];

  const formMethods = useForm<AddReplyFormData>({
    resolver: yupResolver(addReplyFormSchema),
    shouldUnregister: false,
  });

  const { handleSubmit, getValues, setValue } = formMethods;

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
    mutate: editRepliesToTreatment,
    isPending: isEditRepliesToTreatment,
  } = useMutation({
    mutationFn: async (data: {
      replies_id: number[];
    }): Promise<{ data: TreatmentType }> => {
      const { replies_id } = data;
      const treatmentData = { ...treatment, reply_ids: replies_id };
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
  });

  const blocks: BlockType[] = useMemo(() => blocksQuery?.data, [blocksQuery]);

  if (
    isLoadingBlocksQuery ||
    !treatmentId ||
    isLoadingTreatmentsQuery ||
    isEditRepliesToTreatment
  ) {
    return <LoadingLayout />;
  }

  questions = blocks.map(block => block.questions).flat(1);
  const replies = questions.map(question => question.replies).flat(1);

  const repliesSelected = replies.filter(reply =>
    Object.values(getValues()).includes(String(reply.id)),
  );

  const treatment: TreatmentType = treatmentsQuery?.data.find(
    (treatment: TreatmentType) => treatment.id === +treatmentId,
  );

  const handleEditTreatmentRepliesSubmit: SubmitHandler<
    AddReplyFormData
  > = async data => {
    try {
      const replies_id = Object.values(data).filter(Number).map(Number);
      editRepliesToTreatment({ replies_id });
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  function handleRemoveReply(replyId: string) {
    const formEntries = Object.entries(getValues());
    const questionEntry = formEntries.find(entry => entry[1] === replyId);
    if (questionEntry) {
      setValue(questionEntry[0], null);
    }
  }

  return (
    <main className="bg-gray-100 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <h2 className="my-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
              Respostas do tratamento
            </h2>
            <FormProvider {...formMethods}>
              <form
                onSubmit={handleSubmit(handleEditTreatmentRepliesSubmit)}
                className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden"
              >
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div className="w-full flex justify-end">
                    <Button type="submit">Salvar</Button>
                  </div>
                </div>

                <section
                  aria-labelledby="products-heading"
                  className="pb-24 pt-6"
                >
                  <h2 id="products-heading" className="sr-only">
                    Products
                  </h2>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                    <div className="lg:col-span-3">
                      <RepliesTable
                        blocks={blocks}
                        questions={questions}
                        treatment={treatment}
                      />
                    </div>

                    <div className="hidden lg:block">
                      <div className="border-b border-gray-200 dark:border-gray-700 py-4 max-h-[700px] overflow-auto">
                        <h3 className="-my-3 flow-root">
                          <div className="flex w-full items-center justify-between bg-white dark:border-gray-700 dark:bg-gray-800 py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900 dark:text-white">
                              Respostas salvas
                            </span>
                          </div>
                        </h3>
                        <div className="pt-6">
                          <div className="space-y-4">
                            {repliesSelected?.map(reply => (
                              <div key={reply.id} className="flex items-center">
                                <Checkbox
                                  key={reply.id}
                                  label={reply.answer}
                                  checked={true}
                                  onChange={() =>
                                    handleRemoveReply(String(reply.id))
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </main>
  );
}
