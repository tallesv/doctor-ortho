import { Label, Modal } from 'flowbite-react';
import Input from '../../../../components/Form/Input';
import { Button } from '../../../../components/Button';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Reply } from '..';
import { useEffect, useState } from 'react';
import Select from '../../../../components/Form/Select';
import { Question } from '../../Questions';
import { Block } from '../../Blocks';
import { useBlocksQuery, useQuestionsQuery } from '../../useQuestionariesQuery';
import { useAuth } from '../../../../hooks/auth';
import { LoadingLayout } from '../../../../layout/LoadingLayout';

interface ReplyModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  onCreate: (data: ReplyFormData) => void;
  onEdit: (data: { reply: ReplyFormData; replyId: number }) => void;
  isSubmitting: boolean;
  type: 'create' | 'edit';
  reply?: Reply;
  questionBlockId: string;
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
  questionBlockId,
}: ReplyModalProps) {
  const { register, handleSubmit, formState, setValue, reset } =
    useForm<ReplyFormData>({
      resolver: yupResolver(replyFormSchema),
    });

  useEffect(() => {
    if (reply) {
      setValue('answer', reply.answer);
      setValue('next_question_id', reply.next_question_id);
    } else {
      reset();
    }
  }, [reply]);

  const [blockIdSelected, setBlockIdSelected] = useState(questionBlockId);

  const { user } = useAuth();

  const userFirebaseId = user.firebase_id;
  const { data: blocksResponse, isLoading: isBlocksQueryLoading } =
    useBlocksQuery(userFirebaseId);
  const { data: questionsResponse, isLoading: isQuestionsQueryLoading } =
    useQuestionsQuery(blockIdSelected);

  const blocks: Block[] = blocksResponse?.data;
  const questions: Question[] = questionsResponse?.data;

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
            {isBlocksQueryLoading || isQuestionsQueryLoading ? (
              <LoadingLayout />
            ) : (
              <>
                <div className="mb-2 block">
                  <Label htmlFor="nextQuestionTitle" value="Próxima questão" />
                </div>
                <Select
                  options={selectOptions}
                  error={!!formState.errors.next_question_id}
                  errorMessage={formState.errors.next_question_id?.message}
                  {...register('next_question_id')}
                />
              </>
            )}
          </div>
          <div className="w-full flex justify-end">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-24"
              disabled
            >
              {modalButtonTitle}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
