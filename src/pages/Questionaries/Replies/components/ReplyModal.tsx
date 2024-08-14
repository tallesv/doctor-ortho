import { Label, Modal } from 'flowbite-react';
import Input from '../../../../components/Form/Input';
import { Button } from '../../../../components/Button';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import Select from '../../../../components/Form/Select';
import { BlockType, ReplyType } from '../../types';
import { Link } from 'react-router-dom';
import FileInput from '@/components/Form/FileInput';
import Checkbox from '@/components/Form/Checkbox';

interface ReplyModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  onCreate: (data: ReplyFormData) => void;
  onEdit: (data: {
    reply: ReplyFormData;
    replyId: number;
    image?: FileList | string;
  }) => void;
  isSubmitting: boolean;
  type: 'create' | 'edit';
  reply?: ReplyType;
  questionBlockId: string;
  blocks: BlockType[];
}

export type ReplyFormData = {
  answer: string;
  coordinate?: string;
  next_question_id?: number | null;
  image?: FileList | string | null;
  show_on_summary: boolean;
  summary_title?: string;
};

const replyFormSchema = yup.object().shape({
  answer: yup.string().required('Por favor insira a resposta'),
  coordinate: yup.string(),
  next_question_id: yup
    .number()
    .nullable()
    .transform((_, val) => (val === '0' ? null : +val)),
  image: yup
    .mixed<FileList | string>()
    .nullable()
    .transform((_, val) => (val === null ? undefined : val)),
  show_on_summary: yup.boolean().required(),
  summary_title: yup
    .string()
    .test(
      'Required',
      'Por favor insira a resposta que você quer mostrar no resumo',
      (value, ctx) => (ctx.parent.show_on_summary ? value !== '' : true),
    ),
});

export function ReplyModal({
  showModal,
  onCloseModal,
  onCreate,
  onEdit,
  isSubmitting,
  type,
  reply,
  questionBlockId,
  blocks,
}: ReplyModalProps) {
  const { register, handleSubmit, formState, setValue, reset, watch } =
    useForm<ReplyFormData>({
      resolver: yupResolver(replyFormSchema),
    });

  const watchImage = watch('image');
  const watchShowOnSummary = watch('show_on_summary');

  useEffect(() => {
    if (showModal) reset();
  }, [showModal]);

  useEffect(() => {
    if (reply) {
      setValue('answer', reply.answer);
      setValue('next_question_id', reply.next_question_id);
      setValue('image', reply.image);
      setValue('show_on_summary', reply.show_on_summary ?? false);
      setValue('summary_title', reply.summary_title ?? '');
    }
  }, [reply]);

  const [blockIdSelected, setBlockIdSelected] = useState(questionBlockId);

  const questions = blocks.find(block => block.id === +blockIdSelected)
    ?.questions;

  const handleCreateQuestion: SubmitHandler<ReplyFormData> = async data => {
    try {
      if (type === 'create') {
        onCreate(data);
      }
      if (type === 'edit' && reply) {
        onEdit({ reply: data, replyId: reply.id });
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const selectOptions = questions
    ? [
        { label: '-', value: 0 },
        ...questions.map(question => ({
          label: question.query,
          value: question.id,
        })),
      ]
    : [];

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
              <Label htmlFor="answerTitle" value="Título da resposta" />
            </div>
            <Input
              error={!!formState.errors.answer}
              errorMessage={formState.errors.answer?.message}
              {...register('answer')}
            />
          </div>

          <div>
            <Checkbox
              label="Exibir no resumo"
              {...register('show_on_summary')}
            />
          </div>

          {watchShowOnSummary && (
            <div className={watchShowOnSummary ? '' : 'hidden'}>
              <div className="mb-2 block">
                <Label htmlFor="summaryTitle" value="Resposta no resumo" />
              </div>
              <Input
                error={!!formState.errors.summary_title}
                errorMessage={formState.errors.summary_title?.message}
                {...register('summary_title')}
              />
            </div>
          )}

          <div>
            <div className="mb-2 block">
              <Label htmlFor="answerTitle" value="Coordenada" />
            </div>
            <Input
              error={!!formState.errors.coordinate}
              errorMessage={formState.errors.coordinate?.message}
              {...register('coordinate')}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="blockTitle" value="Bloco da próxima questão" />
            </div>
            <Select
              defaultValue={blockIdSelected}
              options={blocks?.map(block => ({
                label: block.name,
                value: block.id,
              }))}
              onChange={e => setBlockIdSelected(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="nextQuestionTitle" value="Próxima questão" />
            </div>
            <Select
              options={selectOptions}
              error={!!formState.errors.next_question_id}
              errorMessage={formState.errors.next_question_id?.message}
              {...register('next_question_id')}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="replyImage" value="Imagem da resposta" />
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
            {(watchImage instanceof FileList ||
              watchImage === '' ||
              !watchImage) && (
              <FileInput
                fileName={
                  watchImage instanceof FileList && watchImage[0]?.name
                    ? watchImage?.[0].name
                    : ''
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
