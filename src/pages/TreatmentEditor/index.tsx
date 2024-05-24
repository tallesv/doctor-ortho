import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { api } from '../../client/api';
import { BlockType, QuestionType, ReplyType } from '../Questionaries/types';
import Checkbox from '../../components/Form/Checkbox';
import { RepliesTable } from './components/RepliesTable';
import * as yup from 'yup';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TreatmentSteps, treatmentSteps } from './components/TreatmentSteps';
import { TreatmentDescriptionStep } from './components/TreatmentDescriptionStep';
import withTreatmentFetching from './hocs/withTreatmentFecthing';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

export type TreatmentFormData = {
  [x: string]: string | null;
  description: string;
};

const addReplyFormSchema = yup.object().shape({
  description: yup
    .string()
    .required('Por favor insira a descrição do tratamento'),
});

interface TreatmentEditorProps {
  blocks: BlockType[];
  questions: QuestionType[];
  replies: ReplyType[];
  treatment?: TreatmentType;
}

function TreatmentEditor({
  blocks,
  questions,
  replies,
  treatment,
}: TreatmentEditorProps) {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);

  const formMethods = useForm<TreatmentFormData>({
    resolver: yupResolver(addReplyFormSchema),
    shouldUnregister: false,
  });

  const { handleSubmit, getValues, setValue } = formMethods;

  const queryClient = useQueryClient();

  const {
    mutate: editRepliesToTreatment,
    isPending: isEditRepliesToTreatment,
  } = useMutation({
    mutationFn: async (data: {
      replies_id: number[];
      description: string;
    }): Promise<{ data: TreatmentType }> => {
      const { replies_id, description } = data;
      const treatmentData = {
        ...treatment,
        reply_ids: replies_id,
        description,
      };
      if (treatment) {
        return api.put(`/treatments/${treatment.id}`, treatmentData);
      }
      return api.post(`/treatments`, treatmentData);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
    },
  });

  const repliesSelected = replies.filter(reply =>
    Object.values(getValues()).includes(String(reply.id)),
  );

  const currentStep = treatmentSteps[stepIndex];

  const handleEditTreatmentRepliesSubmit: SubmitHandler<
    TreatmentFormData
  > = async data => {
    try {
      const replies_id = Object.values(data).filter(Number).map(Number);
      const { description } = data;
      editRepliesToTreatment({ replies_id, description });
      if (treatment) {
        toast.success('Tratamento editado com sucesso!');
      } else {
        toast.success('Tratamento criado com sucesso!');
      }
      navigate('/treatments-table');
    } catch (err) {
      toast.error('Por favor tente novamente.');
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
                <div className="w-2/3 mx-auto space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div className="flex-row items-center justify-center space-x-4">
                    <TreatmentSteps currentStep={stepIndex} />
                    <div className="flex items-center justify-center space-x-4 mt-4">
                      <Button
                        disabled={currentStep.id === 0}
                        onClick={() =>
                          setStepIndex(prevStepIndex => prevStepIndex - 1)
                        }
                      >
                        Voltar
                      </Button>
                      {stepIndex === treatmentSteps.length - 1 && (
                        <Button
                          type="submit"
                          isLoading={isEditRepliesToTreatment}
                        >
                          Finalizar
                        </Button>
                      )}
                      {stepIndex != treatmentSteps.length - 1 && (
                        <Button
                          type="button"
                          onClick={() =>
                            setStepIndex(prevStepIndex => prevStepIndex + 1)
                          }
                        >
                          Prosseguir
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {currentStep.id === 0 && (
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

                      <div className="hidden lg:block mt-10">
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
                                <div
                                  key={reply.id}
                                  className="flex items-center"
                                >
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
                )}

                {currentStep.id === 1 && (
                  <TreatmentDescriptionStep
                    description={treatment?.description}
                  />
                )}
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </main>
  );
}

export default withTreatmentFetching(TreatmentEditor);
