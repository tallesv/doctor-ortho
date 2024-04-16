import { Label, Modal } from 'flowbite-react';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Button } from '../../../components/Button';
import { TreatmentType } from '..';
import Textarea from '../../../components/Form/Textarea';

interface TreatmentModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  onCreate: (data: TreatmentFormData) => void;
  onEdit: (data: { id: number; description: string }) => void;
  isSubmitting: boolean;
  type: 'create' | 'edit';
  treatment?: TreatmentType;
}

export type TreatmentFormData = {
  description: string;
};

const blockFormSchema = yup.object().shape({
  description: yup
    .string()
    .required('Por favor insira a descrição do tratamento'),
});

export function TreatmentModal({
  showModal,
  onCloseModal,
  onCreate,
  onEdit,
  isSubmitting,
  type,
  treatment,
}: TreatmentModalProps) {
  const { register, handleSubmit, formState, setValue } =
    useForm<TreatmentFormData>({
      resolver: yupResolver(blockFormSchema),
    });

  const handleCreateQuestion: SubmitHandler<TreatmentFormData> = async ({
    description,
  }) => {
    try {
      if (type === 'create') {
        onCreate({ description });
      }
      if (type === 'edit' && treatment) {
        onEdit({ description, id: treatment.id });
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    if (treatment) {
      setValue('description', treatment.description);
    } else {
      setValue('description', '');
    }
  }, [treatment]);

  const modalTitle =
    type === 'create' ? 'Adicionar tratamento' : 'Editar tratamento';
  const modalButtonTitle = type === 'create' ? 'Criar' : 'Editar';

  return (
    <Modal dismissible show={showModal} onClose={onCloseModal}>
      <Modal.Header>{modalTitle}</Modal.Header>
      <Modal.Body>
        <form
          onSubmit={handleSubmit(handleCreateQuestion)}
          className="space-y-6"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="blockTitle" value="Descrição do tratamento" />
            </div>
            <Textarea
              error={!!formState.errors.description}
              errorMessage={formState.errors.description?.message}
              {...register('description')}
            />
          </div>
          <div className="w-full flex justify-end">
            <Button type="submit" isLoading={isSubmitting} className="w-24">
              {modalButtonTitle}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
