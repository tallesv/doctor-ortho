import { BlockType } from '@/pages/Questionaries/types';
import { Modal } from 'flowbite-react';

interface ReportAnswersModalProps {
  showModal: boolean;
  answers: [x: string];
  questionaryBlocks: BlockType[];
  onCloseModal: () => void;
}

export function ReportAnswersModal({
  showModal,
  answers,
  questionaryBlocks,
  onCloseModal,
}: ReportAnswersModalProps) {
  const formatQuestionsAnswered = questionaryBlocks.map(block => ({
    blockName: block.name,
    questions: block.questions
      .map(({ id, query, replies }) => {
        const replyId = Number(answers[id]);
        const reply = replies.find(({ id }) => id === replyId);

        if (!reply) return null;

        const answer = reply.answer;

        return answer ? { id, query, answer } : null;
      })
      .filter(Boolean),
  }));

  return (
    <Modal dismissible show={showModal} onClose={onCloseModal}>
      <Modal.Header>Respostas</Modal.Header>
      <Modal.Body>
        {formatQuestionsAnswered.map((item, index) => (
          <div key={`${item.blockName}-${index}`}>
            {item.questions.length > 0 && (
              <div>
                <dl className="">
                  {item.questions.map(questionItem => (
                    <div
                      key={questionItem?.id}
                      className="px-4 py-2 sm:px-0 space-y-2 border-b-2 border-gray-100 dark:border-gray-600"
                    >
                      <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white sm:col-span-2">
                        {questionItem?.query}
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300 sm:mt-0">
                        {questionItem?.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
}
