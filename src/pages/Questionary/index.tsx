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
import { useAuth } from '../../hooks/auth';
import { BlockType } from '../Questionaries/types';
import { HiMenu } from 'react-icons/hi';
import { DocsDrawer } from './components/DocsDrawer';

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

  const { handleSubmit, getValues } = reactHookFormsMethods;

  const [blockIndex, setBlockIndex] = useState(0);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [docsDrawerIsOpen, setDocsDrawerIsOpen] = useState(false);

  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['questions-blocks', userFirebaseId],
    queryFn: () => api.get(`/users/${userFirebaseId}/questions_sets`),
  });

  if (isLoading || isError) {
    return <LoadingLayout />;
  }

  const questionBlocks: QuestionBlocksProps[] = data?.data.sort(
    (a: BlockType, b: BlockType) =>
      new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf(),
  );

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
      <div className="my-3 flex items-center gap-2">
        <div className="flex-grow my-auto">
          <Progress
            progress={progressPercentage}
            className="[&>div]:bg-sky-600"
          />
        </div>
        <div className="font-medium text-gray-700 dark:text-gray-200 flex-shrink-0">
          <span className="text-sky-600">
            {Object.keys(getValues()).length + 1}
          </span>
        </div>
        <div className="flex-shrink-0">
          <button className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
            <HiMenu
              className="w-5 h-5"
              onClick={() => setDocsDrawerIsOpen(prevState => !prevState)}
            />
          </button>
        </div>
      </div>

      <DocsDrawer
        isOpen={docsDrawerIsOpen}
        handleClose={() => setDocsDrawerIsOpen(false)}
      />

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
