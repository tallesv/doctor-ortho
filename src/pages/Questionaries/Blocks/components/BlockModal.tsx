import { Label, Modal } from 'flowbite-react';
import Input from '../../../../components/Form/Input';
import { Button } from '../../../../components/Button';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Block } from '..';
import { useEffect } from 'react';

interface BlockModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  onCreate: (data: BlockFormData) => void;
  onEdit: (data: { name: string; id: number }) => void;
  isSubmitting: boolean;
  type: 'create' | 'edit';
  block?: Block;
}

export type BlockFormData = {
  name: string;
};

const blockFormSchema = yup.object().shape({
  name: yup.string().required('Por favor insira um Título'),
});

export function BlockModal({
  showModal,
  onCloseModal,
  onCreate,
  onEdit,
  isSubmitting,
  type,
  block,
}: BlockModalProps) {
  const { register, handleSubmit, formState, setValue } =
    useForm<BlockFormData>({
      resolver: yupResolver(blockFormSchema),
    });

  const handleCreateBlock: SubmitHandler<BlockFormData> = async ({ name }) => {
    try {
      if (type === 'create') {
        onCreate({ name });
      }
      if (type === 'edit' && block) {
        onEdit({ name, id: block.id });
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const modalTitle = type === 'create' ? 'Criar bloco' : 'Editar bloco';
  const modalButtonTitle = type === 'create' ? 'Criar' : 'Editar';

  useEffect(() => {
    if (block) {
      setValue('name', block.name);
    } else {
      setValue('name', '');
    }
  }, [block]);

  return (
    <Modal dismissible show={showModal} onClose={onCloseModal}>
      <Modal.Header>{modalTitle}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleCreateBlock)} className="space-y-6">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="blockTitle" value="Título do bloco" />
            </div>
            <Input
              error={!!formState.errors.name}
              errorMessage={formState.errors.name?.message}
              {...register('name')}
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
