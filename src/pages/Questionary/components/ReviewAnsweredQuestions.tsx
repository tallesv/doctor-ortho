import { Button } from '@/components/Button';
import { summaryBlocksData } from '@/pages/Questionaries/Replies/utils/summaryBlocksData';
import { BlockType } from '@/pages/Questionaries/types';

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
  const formatQuestionsAnswered = summaryBlocksData.map(summaryBlock => {
    const answers = blocks
      .flatMap(block =>
        block.questions.map(({ id, query, replies }) => {
          const replyId = Number(formAnswers[id]);
          const reply = replies.find(({ id }) => id === replyId);

          const isReplyValid =
            reply &&
            reply.show_on_summary &&
            reply.summary_block === summaryBlock.id;

          if (!isReplyValid) return null;

          const answerText = reply.summary_title || reply.answer;

          return answerText ? { id, query, answer: answerText } : null;
        }),
      )
      .filter(Boolean);

    return {
      summaryBlockTitle: summaryBlock.title,
      answers,
    };
  });

  const isFormatQuestionsAnsweredEmpty = !formatQuestionsAnswered.some(
    item => item.answers.length > 0,
  );

  return (
    <section className="space-y-8">
      <div className="mx-auto text-center">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
          Conferência questionário
        </h2>
      </div>
      <div className="bg-white max-w-screen-lg mx-auto pt-2 dark:bg-gray-800 antialiased shadow-md rounded-lg ">
        <div className="px-4 py-2 mx-auto lg:px-6 sm:py-4 lg:py-8">
          <ol className="space-y-4 text-sky-600 font-medium list-decimal list-inside dark:text-gray-400">
            {formatQuestionsAnswered.map(summaryBlock => (
              <li key={summaryBlock.summaryBlockTitle}>
                {summaryBlock.summaryBlockTitle}

                <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
                  {summaryBlock.answers.length === 0 && <li />}
                  {summaryBlock.answers.map(answer => (
                    <li>{answer?.answer}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          {isFormatQuestionsAnsweredEmpty && (
            <div className="mx-auto my-4 text-center text-gray-900 dark:text-white">
              Não foram encontradas respostas para serem exibidas na Conferência
              questionário
            </div>
          )}
        </div>

        <div className="py-2 px-1 lg:space-x-10 flex justify-between lg:justify-center">
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
