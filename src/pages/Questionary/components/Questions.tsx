import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Progress } from 'flowbite-react';
import { useFormContext } from 'react-hook-form';
import { HiMenu } from 'react-icons/hi';
import { useAuth } from '@/hooks/auth';
import { api } from '@/client/api';
import { LoadingLayout } from '@/layout/LoadingLayout';
import { BlockType } from '@/pages/Questionaries/types';
import { QuestionaryFormData } from '..';
import { DocsDrawer } from './DocsDrawer';
import { QuestionGenerator } from './QuestionGenerator';
import { Button } from '@/components/Button';

type QuestionBlocksProps = {
  id: number;
  name: string;
};

interface QuestionsProps {
  handleFinishForm: () => void;
}

export function Questions({ handleFinishForm }: QuestionsProps) {
  const [blockIndex, setBlockIndex] = useState(0);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [docsDrawerIsOpen, setDocsDrawerIsOpen] = useState(false);

  const { getValues } = useFormContext<QuestionaryFormData>();

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

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex-grow my-auto">
          <Progress
            progress={progressPercentage}
            className="[&>div]:bg-sky-600"
          />
        </div>
        <div className="font-medium text-gray-700 dark:text-gray-200 flex-shrink-0">
          <span className="text-sky-600">
            {getValues().questionsIdOrder.length + 1}
          </span>
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
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

      <div className="flex flex-col">
        <QuestionGenerator
          blockId={currentBlock.id}
          previousBlockId={previousBlock.id}
          isLastBlock={isInLastBlock}
          handleNextBlock={handleNextBlock}
          handlePreviousBlock={handlePreviousBlock}
          handleShowFinishButton={handleShowFinishButton}
        />

        {showFinishButton && (
          <Button
            onClick={() => handleFinishForm()}
            className="w-full sm:w-96 h-12 self-center"
          >
            Seguir
          </Button>
        )}
      </div>
    </div>
  );
}
