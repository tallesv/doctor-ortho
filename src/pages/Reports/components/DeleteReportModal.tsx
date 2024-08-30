import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Modal } from 'flowbite-react';
import { ReportsProps } from '..';
import { Button } from '@/components/Button';

interface DeleteReportModalProps {
  showModal: boolean;
  report?: ReportsProps;
  onCloseModal: () => void;
  onSubmmit: (blcokId: number) => void;
  isSubmitting: boolean;
}

export function DeleteReportModal({
  showModal,
  report,
  onCloseModal,
  onSubmmit,
  isSubmitting,
}: DeleteReportModalProps) {
  if (!report) {
    return <></>;
  }

  return (
    <Modal dismissible show={showModal} onClose={onCloseModal}>
      <Modal.Header>Deletar bloco</Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {`Você tem certeza que deseja deletar o relatório de ${report.patient_name}?`}
          </h3>
          <div className="flex justify-end gap-4">
            <Button
              color="red"
              isLoading={isSubmitting}
              onClick={() => onSubmmit(report.id)}
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
