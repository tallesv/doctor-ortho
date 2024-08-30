import { LoadingLayout } from '../../layout/LoadingLayout';
import { useState } from 'react';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { Questions } from './components/Questions';
import { ReviewAnsweredQuestions } from './components/ReviewAnsweredQuestions';
import { BlockType } from '../Questionaries/types';
import { useCreateReportMutation } from '@/shared/api/Reports/useReportMutation';
import { PatientDataForm } from './components/PatientDataForm';
import { useQuestionsBlockQuery } from '@/shared/api/QuestionsBlocks/useQuestionsBlocksQuery';

export type QuestionaryFormData = {
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  questions: {
    [key: number]: string;
  };
  questionsIdOrder: number[];
};

enum FormStep {
  PAtIENT_NAME = 0,
  QUESTIONS = 1,
  REVIEW_QUESTIONS_ANSWERED = 2,
}

export function Questionary() {
  const [formStep, setFormStep] = useState(0);

  const navigate = useNavigate();
  const formSchema = yup.object().shape({
    patient_name: yup.string().required('Por favor insira o nome do paciente'),
    patient_age: yup
      .number()
      .typeError('Por favor insira a idade do paciente')
      .required('Por favor insira a idade do paciente'),
    patient_gender: yup
      .string()
      .required('Por favor insira o sexo do paciente'),
    questionsIdOrder: yup.array(yup.number().required()).required(),
    questions: yup.object({}),
  });

  const reactHookFormsMethods = useForm<QuestionaryFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      questionsIdOrder: [],
    },
  });

  const { handleSubmit, getValues } = reactHookFormsMethods;

  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  const {
    data: questionsBlockData,
    isLoading,
    isError,
  } = useQuestionsBlockQuery(userFirebaseId);

  const { mutate: createReport } = useCreateReportMutation(userFirebaseId);

  if (isLoading || isError || !questionsBlockData) {
    return <LoadingLayout />;
  }

  const questionBlocks = questionsBlockData?.sort(
    (a: BlockType, b: BlockType) =>
      new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf(),
  );

  function handleSubmitForm(data: QuestionaryFormData) {
    const { patient_age, patient_gender, patient_name, questions } = data;
    const formattedQuestionsData = Object.values(questions);
    const createReportPayload = {
      patient_age,
      patient_gender,
      patient_name,
      fields: JSON.stringify(questions),
    };
    createReport(createReportPayload);
    navigate(`/treatment?answers=${formattedQuestionsData.toString()}`);
  }

  return (
    <div className="w-4/5 mx-auto py-3">
      <FormProvider {...reactHookFormsMethods}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          {formStep === FormStep.PAtIENT_NAME && (
            <PatientDataForm onSubmitPatientData={() => setFormStep(1)} />
          )}

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
