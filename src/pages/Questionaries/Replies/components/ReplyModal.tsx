import { Label, Modal } from 'flowbite-react';
import Input from '../../../../components/Form/Input';
import { Button } from '../../../../components/Button';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Reply } from '..';
import { useEffect } from 'react';
import Select from '../../../../components/Form/Select';
import { Question } from '../../Questions';

interface ReplyModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  onCreate: (data: ReplyFormData) => void;
  onEdit: (data: { reply: ReplyFormData; replyId: number }) => void;
  isSubmitting: boolean;
  type: 'create' | 'edit';
  reply?: Reply;
  questions: Question[];
}

export type ReplyFormData = {
  answer: string;
  next_question_id?: number | null;
};

const replyFormSchema = yup.object().shape({
  answer: yup.string().required('Por favor insira a resposta'),
  next_question_id: yup
    .number()
    .nullable()
    .transform((_, val) => (val === '0' ? null : +val)),
});

export function ReplyModal({
  showModal,
  onCloseModal,
  onCreate,
  onEdit,
  isSubmitting,
  type,
  reply,
  questions,
}: ReplyModalProps) {
  const { register, handleSubmit, formState, setValue, reset, getValues } =
    useForm<ReplyFormData>({
      resolver: yupResolver(replyFormSchema),
    });

  const handleCreateQuestion: SubmitHandler<ReplyFormData> = async data => {
    try {
      if (type === 'create') {
        onCreate(data);
      }
      if (type === 'edit' && reply) {
        onEdit({ reply: data, replyId: reply.id });
      }
      reset();
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    if (reply) {
      setValue('answer', reply.answer);
      setValue('next_question_id', reply.next_question_id);
    } else {
      reset();
    }
  }, [reply]);

  const selectOptions = [
    { label: '-', value: 0 },
    ...questions.map(question => ({
      label: question.query,
      value: question.id,
    })),
  ];

  const modalTitle =
    type === 'create' ? 'Adicionar resposta' : 'Editar resposta';
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
              <Label htmlFor="blockTitle" value="Título da resposta" />
            </div>
            <Input
              error={!!formState.errors.answer}
              errorMessage={formState.errors.answer?.message}
              {...register('answer')}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="blockTitle" value="Próxima questão" />
            </div>
            <Select
              options={selectOptions}
              error={!!formState.errors.next_question_id}
              errorMessage={formState.errors.next_question_id?.message}
              {...register('next_question_id')}
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
