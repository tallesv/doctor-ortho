import { Label, Modal } from 'flowbite-react';
import Input from '../../../../components/Form/Input';
import { Button } from '../../../../components/Button';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { QuestionType } from '../../types';

interface QuestionModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  onCreate: (data: QuestionFormData) => void;
  onEdit: (data: { query: string; id: number }) => void;
  isSubmitting: boolean;
  type: 'create' | 'edit';
  question?: QuestionType;
}

export type QuestionFormData = {
  query: string;
};

const blockFormSchema = yup.object().shape({
  query: yup.string().required('Por favor insira um Título'),
});

export function QuestionModal({
  showModal,
  onCloseModal,
  onCreate,
  onEdit,
  isSubmitting,
  type,
  question,
}: QuestionModalProps) {
  const { register, handleSubmit, formState, setValue } =
    useForm<QuestionFormData>({
      resolver: yupResolver(blockFormSchema),
    });

  const handleCreateQuestion: SubmitHandler<QuestionFormData> = async ({
    query,
  }) => {
    try {
      if (type === 'create') {
        onCreate({ query });
      }
      if (type === 'edit' && question) {
        onEdit({ query, id: question.id });
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    if (question) {
      setValue('query', question.query);
    } else {
      setValue('query', '');
    }
  }, [question]);

  const modalTitle = type === 'create' ? 'Adicionar questão' : 'Editar questão';
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
              <Label htmlFor="blockTitle" value="Título da pergunta" />
            </div>
            <Input
              error={!!formState.errors.query}
              errorMessage={formState.errors.query?.message}
              {...register('query')}
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
