import { Label, Modal } from 'flowbite-react';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { BlockType } from '../../../Questionaries/types';
import Select from '../../../../components/Form/Select';
import { Button } from '../../../../components/Button';

interface AddReplyModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  onAddReply: (data: AddReplyFormData) => void;
  isSubmitting: boolean;
  blocks: BlockType[];
}

export type AddReplyFormData = {
  reply_id: number;
};

const addReplyFormSchema = yup.object().shape({
  reply_id: yup.number().required('Por favor escolha uma resposta.'),
});

export function AddReplyModal({
  showModal,
  onCloseModal,
  onAddReply,
  isSubmitting,
  blocks,
}: AddReplyModalProps) {
  const [blockIdSelected, setBlockIdSelected] = useState(blocks[0].id);
  const [questionIdSelected, setQuestionIdSelected] = useState<number>(
    blocks[0].questions[0].id,
  );

  const { register, handleSubmit, formState } = useForm<AddReplyFormData>({
    resolver: yupResolver(addReplyFormSchema),
  });

  const handleCreateQuestion: SubmitHandler<AddReplyFormData> = async ({
    reply_id,
  }) => {
    try {
      onAddReply({ reply_id });
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  function handleChangeBlock(blockId: number) {
    setBlockIdSelected(blockId);
    const blockSelected = blocks.find(block => block.id === blockId);
    const questions = blockSelected?.questions;
    if (questions) {
      setQuestionIdSelected(questions[0].id);
    }
  }

  const blockSelected = blocks.find(block => block.id === blockIdSelected);
  const questions = blockSelected?.questions;
  const questionSelected = questions?.find(
    question => question.id === questionIdSelected,
  );
  const replies = questionSelected?.replies;

  useEffect(() => {
    if (showModal) {
      handleChangeBlock(blocks[0].id);
    }
  }, [showModal]);

  return (
    <Modal dismissible show={showModal} onClose={onCloseModal}>
      <Modal.Header>Adicionar resposta ao tratamento</Modal.Header>
      <Modal.Body>
        <form
          onSubmit={handleSubmit(handleCreateQuestion)}
          className="space-y-6"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="blockTitle" value="Bloco" />
            </div>
            <Select
              //value={blockIdSelected}
              options={blocks.map(block => ({
                label: block.name,
                value: block.id,
              }))}
              onChange={e => handleChangeBlock(+e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="questionTitle" value="Questões" />
            </div>
            <Select
              //value={questionIdSelected}
              options={
                questions
                  ? questions.map(question => ({
                      label: question.query,
                      value: question.id,
                    }))
                  : []
              }
              onChange={e => setQuestionIdSelected(+e.target.value)}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="replyTitle" value="Respostas" />
            </div>
            <Select
              options={
                replies
                  ? replies.map(reply => ({
                      label: reply.answer,
                      value: reply.id,
                    }))
                  : []
              }
              error={!!formState.errors.reply_id}
              errorMessage={formState.errors.reply_id?.message}
              {...register('reply_id')}
            />
          </div>
          <div className="w-full flex justify-end">
            <Button type="submit" isLoading={isSubmitting} className="w-24">
              Adicionar resposta
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
