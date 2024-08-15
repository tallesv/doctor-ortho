import { Button } from '@/components/Button';
import { BlockType } from '@/pages/Questionaries/types';

interface ReviewAnsweredQuestionsProps {
  blocks: BlockType[];
  formAnswers: {
    [x: number]: string;
  };
}

export function ReviewAnsweredQuestions({
  blocks,
  formAnswers,
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

  return (
    <section className="bg-white dark:bg-gray-800 antialiased shadow-md sm:rounded-lg ">
      <div className="max-w-screen-xl px-4 py-2 mx-auto lg:px-6 sm:py-4 lg:py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
            Revisar respostas
          </h2>
        </div>

        {formatQuestionsAnswered.map((item, index) => (
          <div key={`${item.blockName}-${index}`}>
            {item.questions.length > 0 && (
              <div>
                <div className="px-4 py-2 sm:px-0">
                  <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    {item.blockName}
                  </h3>
                </div>
                <div className="mt- border-t border-gray-100 dark:border-gray-700">
                  <dl className="divide-y divide-gray-100 dark:divide-gray-700">
                    {item.questions.map(questionItem => (
                      <div
                        key={questionItem?.id}
                        className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
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

      <div className="max-w-3xl mx-auto pb-2">
        <Button type="submit" className="w-full">
          Finalizar
        </Button>
      </div>
    </section>
  );
}
