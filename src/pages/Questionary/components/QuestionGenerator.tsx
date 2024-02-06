import { RadioGroup } from '@headlessui/react';
import { useState } from 'react';
import { HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import bindClassNames from '../../../utils/bindClassNames';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../client/api';
import { LoadingLayout } from '../../../layout/LoadingLayout';
import { useFormContext } from 'react-hook-form';

type Reply = {
  answer: string;
  id: string;
  next_question_id: number;
  question_id: number;
};

type Question = {
  id: number;
  query: string;
  replies: Reply[];
};

type QuestionaryFormData = {
  [key: string]: string;
};

interface QuestionGenerator {
  blockId: number;
  handleNextBlock: () => void;
}

export function QuestionGenerator({
  blockId,
  handleNextBlock,
}: QuestionGenerator) {
  const { setValue } = useFormContext<QuestionaryFormData>();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [previousQuestionIndex, setPreviousQuestionIndex] = useState(0);

  function handleSelectReply(reply: Reply) {
    setValue(`${currentQuestion.id}`, reply.answer);

    setTimeout(() => {
      const findNextQuestionIndex = questions.findIndex(
        question => question.id === reply.next_question_id,
      );
      if (findNextQuestionIndex !== -1) {
        setPreviousQuestionIndex(questionIndex);
        setQuestionIndex(findNextQuestionIndex);
      } else {
        setQuestionIndex(0);
        handleNextBlock();
      }
    }, 500);
  }

  const { data, isLoading } = useQuery({
    queryKey: ['questions', blockId],
    queryFn: () => api.get(`/questions_sets/${blockId}/questions/`),
    gcTime: 0,
  });

  if (isLoading) {
    return <LoadingLayout />;
  }

  const questions: Question[] = data?.data;
  const currentQuestion = questions[questionIndex];

  return (
    <div>
      <div className="flex items-center">
        <HiArrowLeft
          className={bindClassNames(
            previousQuestionIndex != 0 ? 'cursor-pointer' : '',
            'h-6 w-6 mr-2 text-gray-800 dark:text-gray-200 cursor-pointer',
          )}
          disabled={questionIndex === 0}
          onClick={() => setQuestionIndex(previousQuestionIndex)}
        />
        <h3 className="w-full font-bold text-xl text-center text-gray-800 dark:text-gray-200">
          {currentQuestion?.query}
        </h3>
      </div>
      <div className="w-full px-5 py-6">
        <div className="mx-auto w-full max-w-md">
          <RadioGroup onChange={handleSelectReply}>
            <div className="space-y-2">
              {currentQuestion.replies.map(reply => (
                <RadioGroup.Option
                  key={reply.id}
                  value={reply}
                  className={({ active, checked }) =>
                    bindClassNames(
                      active
                        ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300  dark:ring-white/80 dark:ring-offset-sky-600'
                        : '',
                      checked ? 'bg-sky-600' : 'bg-gray-50 dark:bg-gray-700',
                      'h-24 relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none',
                    )
                  }
                >
                  {({ active, checked }) => (
                    <>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
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
                        {(active || checked) && (
                          <div className="shrink-0 text-white">
                            <HiCheckCircle className="h-6 w-6 " />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
