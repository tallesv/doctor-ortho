import { Button } from '../../components/Button';
import { DefaultLayout } from '../../layout/DefaultLayout/index';
import { Label, Radio } from 'flowbite-react';
import { useState } from 'react';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type QuestionFormData = {
  answer: string;
};

const questionFormSchema = yup.object().shape({
  answer: yup.string().required('Por favor escolha uma opcao.'),
});

export function Home() {
  // const [currentQuestion, setCurrentQuestion] = useState<Question>(myForm[0]);

  // const { register, handleSubmit, formState } = useForm<QuestionFormData>({
  //   resolver: yupResolver(questionFormSchema),
  // });

  // const handleNextQuestion: SubmitHandler<QuestionFormData> = async ({
  //   answer,
  // }) => {
  //   const findNextQuestionLinked = myForm.find(
  //     item =>
  //       item.dependsOnLabel === currentQuestion.label &&
  //       item.dependsOnValue === answer,
  //   );
  //   const nextQuestionIndex =
  //     findNextQuestionLinked ||
  //     myForm
  //       .slice(
  //         myForm.findIndex(item => item.label === currentQuestion.label) + 1,
  //       )
  //       .find(item => !item.dependsOnLabel);
  //   if (!nextQuestionIndex) {
  //     console.log('Finish');
  //   } else {
  //     setCurrentQuestion(nextQuestionIndex);
  //   }
  // };
  return (
    <DefaultLayout>
      {/* <form
        onSubmit={handleSubmit(handleNextQuestion)}
        className="flex max-w-md flex-col gap-4"
        id="radio"
      >
        <legend className="mb-4">{currentQuestion.label}</legend>
        {currentQuestion.options?.map(item => (
          <div key={item} className="flex items-center gap-2">
            <Radio id={item} value={item} {...register('answer')} />
            <Label>{item}</Label>
          </div>
        ))}

        {formState.errors.answer && (
          <span className="text-sm text-red-600">
            {formState.errors.answer.message}
          </span>
        )}

        <Button type="submit" className="">
          Proximo
        </Button>
      </form> */}
    </DefaultLayout>
  );
}
