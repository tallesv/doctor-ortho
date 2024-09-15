import { Button } from '@/components/Button';
import { BlockType } from '@/pages/Questionaries/types';
import { useNavigate } from 'react-router-dom';

interface ReviewAnsweredQuestionsProps {
  blocks: BlockType[];
  formAnswers: {
    [x: number]: string;
  };
  goBackToQuestionary: () => void;
}

export function ReviewAnsweredQuestions({
  blocks,
  formAnswers,
  goBackToQuestionary,
}: ReviewAnsweredQuestionsProps) {
  const formatQuestionsAnswered = blocks.map(block => ({
    blockName: block.name,
    questions: block.questions
      .map(({ id, query, replies }) => {
        const replyId = Number(formAnswers[id]);
        const reply = replies.find(({ id }) => id === replyId);

        if (!reply || !reply.show_on_summary) return null;

        const answer =
          reply.summary_title && reply.summary_title !== ''
            ? reply.summary_title
            : reply.answer;

        return answer ? { id, query, answer } : null;
      })
      .filter(Boolean),
  }));

  const isFormatQuestionsAnsweredEmpty = !formatQuestionsAnswered.some(
    item => item.questions.length > 0,
  );

  return (
    <section className="space-y-8">
      <div className="mx-auto text-center">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
          Conferência questionário
        </h2>
      </div>
      <div className="bg-white max-w-screen-lg mx-auto dark:bg-gray-800 antialiased shadow-md rounded-lg ">
        <div className="px-4 py-2 mx-auto lg:px-6 sm:py-4 lg:py-8">
          {isFormatQuestionsAnsweredEmpty && (
            <div className="mx-auto my-4 text-center text-gray-900 dark:text-white">
              Não foram encontradas respostas para serem exibidas na Conferência
              questionário
            </div>
          )}
          {formatQuestionsAnswered.map((item, index) => (
            <div key={`${item.blockName}-${index}`}>
              {item.questions.length > 0 && (
                <div>
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <dl>
                      {item.questions.map(questionItem => (
                        <div
                          key={questionItem?.id}
                          className="px-4 py-2 sm:px-0 space-y-2 border-b-2 border-gray-100 dark:border-gray-700"
                        >
                          <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            {questionItem?.query}
                          </dt>
                          <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                            {questionItem?.answer}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pb-2 px-1 lg:space-x-10 flex justify-between lg:justify-center">
          <Button
            onClick={() => goBackToQuestionary()}
            className="w-44 lg:w-48"
          >
            Voltar
          </Button>

          <Button type="submit" className="w-44 lg:w-48">
            Continuar
          </Button>
        </div>
      </div>
    </section>
  );
}
