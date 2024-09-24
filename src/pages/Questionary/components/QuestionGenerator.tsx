import { RadioGroup, Radio, Label, Field } from '@headlessui/react';
import { HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import { useQuery, QueryKey } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import bindClassNames from '../../../utils/bindClassNames';
import { api } from '../../../client/api';
import { LoadingLayout } from '../../../layout/LoadingLayout';
import { queryClient } from '../../../config/queryClient';
import { useQuestionStore } from '../hooks/useQuestionStore';
import { QuestionaryFormData } from '..';

type Reply = {
  answer: string;
  id: string;
  image?: string;
  next_question_id: number;
  question_id: number;
};

type Question = {
  id: number;
  query: string;
  image?: string;
  replies: Reply[];
};

interface QuestionGeneratorProps {
  blockId: number;
  previousBlockId: number;
  isLastBlock: boolean;
  handleNextBlock: (nextQuestionId: number) => number;
  handlePreviousBlock: () => void;
  handleShowFinishButton: (isInLastQuestion: boolean) => void;
}

export function QuestionGenerator({
  blockId,
  previousBlockId,
  isLastBlock,
  handleNextBlock,
  handlePreviousBlock,
  handleShowFinishButton,
}: QuestionGeneratorProps) {
  const { setValue, getValues, watch } = useFormContext<QuestionaryFormData>();

  const { questionIndex, setQuestionIndex } = useQuestionStore();

  function handleSelectReply(reply: Reply) {
    const { questions: formQuestions = {}, questionsIdOrder } = getValues();
    formQuestions[currentQuestion.id] = reply.id;
    setValue('questions', formQuestions);

    if (!questionsIdOrder.includes(currentQuestion.id)) {
      questionsIdOrder.push(currentQuestion.id);
    }

    const findNextQuestionIndex = questions.findIndex(
      question => question.id === reply.next_question_id,
    );

    setTimeout(() => {
      if (findNextQuestionIndex !== -1) {
        setQuestionIndex(findNextQuestionIndex);
        handleShowFinishButton(false);
      } else if (!isLastBlock) {
        const nextQuestionIndex = handleNextBlock(reply.next_question_id);
        setQuestionIndex(nextQuestionIndex);
      } else {
        handleShowFinishButton(true);
      }
    }, 500);
  }

  async function handleBackPreviousQuestion() {
    const { questions: formQuestions = {}, questionsIdOrder } = getValues();
    const lastAnsweredQuestionId = questionsIdOrder.slice(-1)[0];
    if (lastAnsweredQuestionId) {
      delete formQuestions[+lastAnsweredQuestionId];
      questionsIdOrder.pop();
      setValue('questions', formQuestions);
    }
    const findPreviousQuestionIndex = questions.findIndex(
      question => question.id === +String(lastAnsweredQuestionId),
    );
    if (findPreviousQuestionIndex !== -1) {
      setQuestionIndex(findPreviousQuestionIndex);
      handleShowFinishButton(false);
    } else {
      handlePreviousBlock();
      const [questionsCache] = queryClient.getQueriesData({
        queryKey: ['questions', previousBlockId],
      });
      const [_, previousQuestions]: [QueryKey, any] = questionsCache;
      const previousQuestionIndex = previousQuestions.data.findIndex(
        (question: Question) => question.id === +String(lastAnsweredQuestionId),
      );
      setQuestionIndex(previousQuestionIndex);
    }
  }

  function checkReplySelected(replyId: string) {
    const { previous_questions } = getValues();
    return previous_questions?.[currentQuestion.id] === replyId;
  }

  const { data, isLoading } = useQuery({
    queryKey: ['questions', blockId],
    queryFn: ({ queryKey }) =>
      api.get(`/questions_sets/${queryKey[1]}/questions/`),
  });

  if (isLoading) {
    return <LoadingLayout />;
  }

  const questions: Question[] = data?.data;
  const currentQuestion = questions[questionIndex];
  watch('questions');

  const disablePreviousQuestionButton =
    questionIndex === 0 && blockId === previousBlockId;

  return (
    <div>
      <div className="flex items-center">
        <button
          type="button"
          disabled={disablePreviousQuestionButton}
          onClick={() => handleBackPreviousQuestion()}
        >
          <HiArrowLeft
            className={bindClassNames(
              disablePreviousQuestionButton
                ? 'text-gray-200 dark:text-gray-800'
                : 'text-gray-800 dark:text-gray-200 cursor-pointer',
              'h-6 w-6 mr-2',
            )}
          />
        </button>

        <h3 className="w-full font-bold text-xl text-center text-gray-800 dark:text-gray-200">
          {currentQuestion?.query}
        </h3>
      </div>
      <div className="w-full px-5 py-6">
        <div className="mx-auto w-full max-w-md">
          <RadioGroup className="flex-grow relative z-10">
            <Field className="flex flex-col space-y-4">
              {currentQuestion?.replies?.map(reply => (
                <Radio
                  key={reply.id}
                  value={reply}
                  onClick={() => handleSelectReply(reply)}
                  className={({ focus, checked }) =>
                    bindClassNames(
                      focus
                        ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300 dark:ring-white/80 dark:ring-offset-sky-600'
                        : '',
                      checked || checkReplySelected(reply.id)
                        ? 'bg-sky-600'
                        : 'bg-gray-50 dark:bg-gray-700',
                      'animate-right-left border-2 border-sky-600 h-[6rem] flex-grow relative flex cursor-pointer rounded-lg pr-5 shadow-md focus:outline-none overflow-hidden',
                    )
                  }
                >
                  {({ focus, checked }) => (
                    <div className="flex w-full items-center justify-between space-x-4 h-full">
                      <div className="h-full flex-shrink-0">
                        {reply.image && (
                          <img
                            className="h-full w-20 object-cover"
                            src={reply.image}
                          />
                        )}
                      </div>

                      <div className="flex-grow flex-shrink min-w-0">
                        <Label
                          as="p"
                          className={bindClassNames(
                            focus || checked || checkReplySelected(reply.id)
                              ? 'text-gray-200'
                              : 'text-sky-600 dark:text-gray-200',
                            'text-lg font-medium break-words whitespace-normal leading-4',
                          )}
                        >
                          {reply.answer}
                        </Label>
                      </div>

                      <div className="flex-shrink-0 text-white">
                        {(focus || checked || checkReplySelected(reply.id)) && (
                          <HiCheckCircle className="h-6 w-6" />
                        )}
                      </div>
                    </div>
                  )}
                </Radio>
              ))}
            </Field>
          </RadioGroup>
          {currentQuestion?.image && (
            <img
              className="fixed bottom-0 right-0 h-96 z-0 object-cover m-4"
              src={currentQuestion.image}
              alt={`question ${currentQuestion.id} image`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
