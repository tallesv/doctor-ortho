import { Label, Modal } from 'flowbite-react';
import Input from '../../../../components/Form/Input';
import { Button } from '../../../../components/Button';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { QuestionType } from '../../types';
import FileInput from '@/components/Form/FileInput';
import { Link } from 'react-router-dom';

interface QuestionModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  onCreate: (data: QuestionFormData) => void;
  onEdit: (data: {
    query: string;
    id: number;
    image?: FileList | string;
  }) => void;
  isSubmitting: boolean;
  type: 'create' | 'edit';
  question?: QuestionType;
}

export type QuestionFormData = {
  query: string;
  image?: FileList | string;
};

const blockFormSchema = yup.object().shape({
  query: yup.string().required('Por favor insira um Título'),
  image: yup.mixed(),
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
  const { register, handleSubmit, formState, setValue, watch } =
    useForm<QuestionFormData>({
      resolver: yupResolver(blockFormSchema),
    });

  const watchImage = watch('image');

  const handleCreateQuestion: SubmitHandler<QuestionFormData> = async ({
    query,
    image,
  }) => {
    try {
      if (type === 'create') {
        console.log(image);
        onCreate({ query, image });
      }
      if (type === 'edit' && question) {
        onEdit({ query, id: question.id, image });
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    if (question) {
      setValue('query', question.query);
      setValue('image', question.image);
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
              <Label htmlFor="questionTitle" value="Título da pergunta" />
            </div>
            <Input
              error={!!formState.errors.query}
              errorMessage={formState.errors.query?.message}
              {...register('query')}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="questionImage" value="Imagem da pergunta" />
            </div>

            {typeof watchImage === 'string' && watchImage !== '' && (
              <div className="flex flex-col space-y-4">
                <Link
                  to={watchImage}
                  target="_blank"
                  className="text-sky-500 mr-2"
                >
                  {watchImage}
                </Link>

                <Button color="light" onClick={() => setValue('image', '')}>
                  Remover imagem
                </Button>
              </div>
            )}
            {(typeof watchImage?.[0] === 'object' ||
              watchImage === '' ||
              !watchImage) && (
              <FileInput
                fileName={
                  typeof watchImage === 'object' ? watchImage?.[0].name : ''
                }
                {...register('image')}
              />
            )}
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
