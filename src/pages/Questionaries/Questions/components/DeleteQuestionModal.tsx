import { Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Question } from '..';
import { Button } from '../../../../components/Button';

interface DeleteQuestionModalProps {
  showModal: boolean;
  question: Question;
  onCloseModal: () => void;
  onSubmmit: (blcokId: number) => void;
  isSubmitting: boolean;
}

export function DeleteQuestionModal({
  showModal,
  question,
  onCloseModal,
  onSubmmit,
  isSubmitting,
}: DeleteQuestionModalProps) {
  return (
    <Modal dismissible show={showModal} onClose={onCloseModal}>
      <Modal.Header>Deletar bloco</Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {`Você tem certeza que deseja deletar a questão "${question.query}?"`}
          </h3>
          <div className="flex justify-end gap-4">
            <Button
              color="red"
              isLoading={isSubmitting}
              onClick={() => onSubmmit(question.id)}
              disabled
            >
              Deletar
            </Button>
            <Button color="light" onClick={() => onCloseModal()}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
