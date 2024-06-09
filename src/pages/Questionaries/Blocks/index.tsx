import { Button } from '../../../components/Button';
import { useState } from 'react';
import { BlockModal } from './components/BlockModal';
import { LoadingLayout } from '../../../layout/LoadingLayout';
import { DeleteBlockModal } from './components/DeleteBlockModal';
import { useAuth } from '../../../hooks/auth';
import { useBlocksQuery } from '../useQuestionariesQuery';
import { BlockType } from '../types';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableBlock } from './components/SortableBlock';
import {
  useCreateBlockMutation,
  useDeleteBlockMutation,
  useEditBlockMutation,
} from '../../../shared/api/useBlockMutation';

export function Blocks() {
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockToEdit, setBlockToEdit] = useState<BlockType | undefined>(
    undefined,
  );
  const [blockToDelete, setBlockToDelete] = useState<BlockType | undefined>(
    undefined,
  );

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor),
  );

  const { user } = useAuth();

  const userFirebaseId = user.firebase_id;

  const { data, isLoading } = useBlocksQuery(userFirebaseId);

  const { mutate: createBlock, isPending: isCreateBlockPending } =
    useCreateBlockMutation(userFirebaseId, setShowBlockModal);

  const { mutate: editBlock, isPending: isEditBlockPending } =
    useEditBlockMutation(userFirebaseId, setBlockToEdit);

  const { mutate: deleteBlock, isPending: isDeleteBlockPending } =
    useDeleteBlockMutation(userFirebaseId, setBlockToDelete);

  if (isLoading) {
    return <LoadingLayout />;
  }

  const blocks: BlockType[] = data?.data.sort(
    (a: BlockType, b: BlockType) =>
      new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf(),
  );

  function handleCloseBlockModal() {
    if (showBlockModal) {
      setShowBlockModal(false);
    }
    if (blockToEdit) {
      setBlockToEdit(undefined);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id != over?.id) {
      //const oldIndex = blocks.findIndex(block => block.id === active.id);
      //const newIndex = blocks.findIndex(block => block.id === over.id);
      //const sortedBlocks = arrayMove(blocks, oldIndex, newIndex);
      //api.put(`/users/${userFirebaseId}/questions_sets/`, sortedBlocks);
      //console.log(sortedBlocks);
    }
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <BlockModal
        showModal={showBlockModal || !!blockToEdit?.id}
        onCloseModal={() => handleCloseBlockModal()}
        onCreate={data => createBlock(data)}
        onEdit={data => editBlock(data)}
        block={blockToEdit}
        type={blockToEdit ? 'edit' : 'create'}
        isSubmitting={isCreateBlockPending || isEditBlockPending}
      />
      {blockToDelete && (
        <DeleteBlockModal
          showModal={!!blockToDelete?.id}
          block={blockToDelete}
          onCloseModal={() => setBlockToDelete(undefined)}
          onSubmmit={blockId => deleteBlock(blockId)}
          isSubmitting={isDeleteBlockPending}
        />
      )}
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
        <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="max-w-2xl my-4 mx-auto">
            <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
              Blocos de perguntas
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
              <div className="py-8 px-4 mx-auto max-w-screen-md">
                <div className="flex justify-end">
                  <Button
                    color="light"
                    type="button"
                    onClick={() => setShowBlockModal(true)}
                  >
                    Adicionar Bloco
                  </Button>
                </div>
                <ul
                  role="list"
                  className="divide-y divide-gray-200 dark:divide-gray-600"
                >
                  <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                    sensors={sensors}
                  >
                    <SortableContext
                      items={blocks}
                      strategy={verticalListSortingStrategy}
                    >
                      {blocks?.map(block => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          onSelectBlockToEdit={block => setBlockToEdit(block)}
                          onSelectBlockToDelete={block =>
                            setBlockToDelete(block)
                          }
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
