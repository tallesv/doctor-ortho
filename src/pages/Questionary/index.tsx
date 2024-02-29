import { useQuery } from '@tanstack/react-query';
import { api } from '../../client/api';
import { LoadingLayout } from '../../layout/LoadingLayout';
import { useState } from 'react';
import { Progress } from 'flowbite-react';
import { QuestionGenerator } from './components/QuestionGenerator';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';

type QuestionBlocksProps = {
  id: number;
  name: string;
};

type QuestionaryFormData = {
  [key: number]: string;
};

export function Questionary() {
  const navigate = useNavigate();
  const formSchema = yup.object().shape({});

  const reactHookFormsMethods = useForm<QuestionaryFormData>({
    resolver: yupResolver(formSchema),
  });

  const { handleSubmit } = reactHookFormsMethods;

  const [blockIndex, setBlockIndex] = useState(0);
  const [showFinishButton, setShowFinishButton] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['questions-blocks'],
    queryFn: () =>
      api.get('/users/f8f26fde8ff8a22249e77be7ff818cca90f683a7/questions_sets'),
  });

  if (isLoading || isError) {
    return <LoadingLayout />;
  }

  const questionBlocks: QuestionBlocksProps[] = data?.data;

  const currentBlock = questionBlocks[blockIndex];
  const previousBlock =
    blockIndex === 0 ? questionBlocks[0] : questionBlocks[blockIndex - 1];
  const progressPercentage = ((blockIndex + 1) * 100) / questionBlocks.length;
  const isInLastBlock = blockIndex + 1 === questionBlocks.length;

  function handleNextBlock() {
    if (!isInLastBlock) {
      setBlockIndex(prev => prev + 1);
    }
  }

  function handlePreviousBlock() {
    setBlockIndex(state => state - 1);
  }

  function handleShowFinishButton(isInLastQuestion: boolean) {
    if (!isInLastQuestion && showFinishButton) {
      setShowFinishButton(false);
    }
    if (isInLastQuestion && !showFinishButton) {
      setShowFinishButton(true);
    }
  }

  function handleSubmitForm(data: QuestionaryFormData) {
    const formattedData = Object.values(data);
    navigate(`/treatment?answers=${formattedData.toString()}`);
  }

  return (
    <div className="w-4/5 mx-auto">
      <h1 className="text-center font-medium text-gray-700 dark:text-gray-200">
        {currentBlock.name}
      </h1>
      <div className="my-3 grid grid-cols-6 gap-2">
        <div className="col-span-5 my-auto">
          <Progress
            progress={progressPercentage}
            className="[&>div]:bg-sky-600"
          />
        </div>
        <div className="font-medium text-gray-700 dark:text-gray-200">
          <span className="text-sky-600">{blockIndex + 1}</span>
          <span>{`/${questionBlocks.length}`}</span>
        </div>
      </div>

      <FormProvider {...reactHookFormsMethods}>
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="flex flex-col"
        >
          <QuestionGenerator
            blockId={currentBlock.id}
            previousBlockId={previousBlock.id}
            isLastBlock={isInLastBlock}
            handleNextBlock={handleNextBlock}
            handlePreviousBlock={handlePreviousBlock}
            handleShowFinishButton={handleShowFinishButton}
          />

          {showFinishButton && (
            <Button type="submit" className="w-full sm:w-96 h-12 self-center">
              Finalizar
            </Button>
          )}
        </form>
      </FormProvider>
    </div>
  );
}
