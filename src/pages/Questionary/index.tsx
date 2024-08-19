import { useQuery } from '@tanstack/react-query';
import { api } from '../../client/api';
import { LoadingLayout } from '../../layout/LoadingLayout';
import { useState } from 'react';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import Input from '@/components/Form/Input';
import { Questions } from './components/Questions';
import { ReviewAnsweredQuestions } from './components/ReviewAnsweredQuestions';
import { BlockType } from '../Questionaries/types';

export type QuestionaryFormData = {
  pacient_name: string;
  questions: {
    [key: number]: string;
  };
  questionsIdOrder: number[];
};

enum FormStep {
  PACIENT_NAME = 0,
  QUESTIONS = 1,
  REVIEW_QUESTIONS_ANSWERED = 2,
}

export function Questionary() {
  const [formStep, setFormStep] = useState(0);

  const navigate = useNavigate();
  const formSchema = yup.object().shape({
    pacient_name: yup.string().required('Por favor insira o nome do paciente'),
    questionsIdOrder: yup.array(yup.number().required()).required(),
    questions: yup.object({}),
  });

  const reactHookFormsMethods = useForm<QuestionaryFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      questionsIdOrder: [],
    },
  });

  const { handleSubmit, getValues, register } = reactHookFormsMethods;

  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['questions-blocks', userFirebaseId],
    queryFn: () => api.get(`/users/${userFirebaseId}/questions_sets`),
  });

  if (isLoading || isError) {
    return <LoadingLayout />;
  }

  const questionBlocks: BlockType[] = data?.data.sort(
    (a: BlockType, b: BlockType) =>
      new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf(),
  );

  function handleSubmitForm(data: QuestionaryFormData) {
    const formattedData = Object.values(data.questions);
    navigate(`/treatment?answers=${formattedData.toString()}`, {
      state: {
        ...data,
      },
    });
  }

  return (
    <div className="w-4/5 mx-auto py-3">
      <FormProvider {...reactHookFormsMethods}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div
            className={
              formStep === FormStep.PACIENT_NAME
                ? 'flex flex-col space-y-8 w-72 lg:w-96 mx-auto'
                : 'hidden'
            }
          >
            <Input label="Nome do paciente" {...register('pacient_name')} />

            <Button onClick={() => setFormStep(1)}>Seguir</Button>
          </div>

          <div className={formStep === FormStep.QUESTIONS ? '' : 'hidden'}>
            <Questions handleFinishForm={() => setFormStep(2)} />
          </div>

          {formStep === FormStep.REVIEW_QUESTIONS_ANSWERED && (
            <ReviewAnsweredQuestions
              blocks={questionBlocks}
              formAnswers={getValues().questions}
            />
          )}
        </form>
      </FormProvider>
    </div>
  );
}
