import { RadioGroup } from '@headlessui/react';
import { useState } from 'react';
import { HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import bindClassNames from '../../../utils/bindClassNames';
import { useQuery, QueryKey } from '@tanstack/react-query';
import { api } from '../../../client/api';
import { LoadingLayout } from '../../../layout/LoadingLayout';
import { useFormContext } from 'react-hook-form';
import { queryClient } from '../../../config/queryClient';

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

type QuestionaryFormData = {
  pacientName: string;
  questions: {
    [key: number]: string;
  };
  questionsIdOrder: number[];
};

interface QuestionGeneratorProps {
  blockId: number;
  previousBlockId: number;
  isLastBlock: boolean;
  handleNextBlock: () => void;
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

  const [questionIndex, setQuestionIndex] = useState(0);

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
      } else {
        if (!isLastBlock) {
          setQuestionIndex(0);
          handleNextBlock();
        } else {
          handleShowFinishButton(true);
        }
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
          <RadioGroup onChange={handleSelectReply}>
            <div className="flex flex-col lg:h-full h-[500px] space-y-2">
              {currentQuestion?.replies?.map(reply => (
                <RadioGroup.Option
                  key={reply.id}
                  value={reply}
                  className={({ active, checked }) =>
                    bindClassNames(
                      active
                        ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300  dark:ring-white/80 dark:ring-offset-sky-600'
                        : '',
                      checked ? 'bg-sky-600' : 'bg-gray-50 dark:bg-gray-700',
                      'animate-right-left min-h-[6rem]  lg:min-h-[10rem] flex-grow relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none',
                    )
                  }
                >
                  {({ active, checked }) => (
                    <>
                      <div className="flex w-full items-center justify-between space-x-4">
                        <div className="h-full flex-shrink-0 content-center">
                          {reply.image && (
                            <img
                              className="h-16 object-cover"
                              src={reply.image}
                            />
                          )}
                        </div>

                        <div className="flex items-center flex-grow">
                          <div className="text-sm">
                            <RadioGroup.Label
                              as="p"
                              className={({}) =>
                                bindClassNames(
                                  active || checked
                                    ? 'text-gray-200'
                                    : 'text-gray-800 dark:text-gray-200',
                                  `font-medium`,
                                )
                              }
                            >
                              {reply.answer}
                            </RadioGroup.Label>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-white">
                          {(active || checked) && (
                            <HiCheckCircle className="h-6 w-6 " />
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>

        {currentQuestion.image && (
          <div className="mt-10 flex">
            <img
              className="max-w-xl max-h-96 mx-auto rounded-lg object-cover"
              src={currentQuestion.image}
              alt={`question ${currentQuestion.id} image`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
