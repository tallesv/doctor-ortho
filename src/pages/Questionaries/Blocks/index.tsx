import { HiDotsVertical } from 'react-icons/hi';
import { Button } from '../../../components/Button';
import { Dropdown } from 'flowbite-react';
import { useState } from 'react';
import { BlockFormData, BlockModal } from './components/BlockModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../../client/api';
import { LoadingLayout } from '../../../layout/LoadingLayout';
import { queryClient } from '../../../config/queryClient';
import { DeleteBlockModal } from './components/DeleteBlockModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth';

export type Block = {
  id: number;
  name: string;
  user_id: number;
  updated_at: string;
};

export function Blocks() {
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockToEdit, setBlockToEdit] = useState<Block | undefined>(undefined);
  const [blockToDelete, setBlockToDelete] = useState<Block | undefined>(
    undefined,
  );

  const { user } = useAuth();

  const userFirebaseId = user.firebase_id;

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['blocks', userFirebaseId],
    queryFn: () => api.get(`/users/${userFirebaseId}/questions_sets`),
  });

  const { mutate: createBlock, isPending: isCreateBlockPending } = useMutation({
    mutationFn: async (data: BlockFormData): Promise<{ data: Block }> => {
      return api.post(`/users/${userFirebaseId}/questions_sets`, data);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: blockResponse => {
      const { data: newBlock } = blockResponse;

      queryClient.setQueryData(
        ['blocks', userFirebaseId],
        (response: { data: Block[] }) => {
          response.data = [...response.data, newBlock];
          return response;
        },
      );
    },
    onSettled: () => {
      setShowBlockModal(false);
    },
  });

  const { mutate: editBlock, isPending: isEditBlockPending } = useMutation({
    mutationFn: async (data: {
      name: string;
      id: number;
    }): Promise<{ data: Block }> => {
      return api.put(
        `/users/${userFirebaseId}/questions_sets/${data.id}`,
        data,
      );
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: blockResponse => {
      const { data: updatedBlock } = blockResponse;

      queryClient.setQueryData(
        ['blocks', userFirebaseId],
        (response: { data: Block[] }) => {
          response.data = response.data.map(item =>
            item.id === updatedBlock.id ? updatedBlock : item,
          );
          return response;
        },
      );
    },
    onSettled: () => {
      setBlockToEdit(undefined);
    },
  });

  const { mutate: deleteBlock, isPending: isDeleteBlockPending } = useMutation({
    mutationFn: async (id: number): Promise<{ data: Block }> => {
      return api.delete(
        `/users/UkfzPFN5F5Zh5UFTxsJSPkDw2In1/questions_sets/${id}`,
      );
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: (_, blockId) => {
      queryClient.setQueryData(
        ['blocks', userFirebaseId],
        (response: { data: Block[] }) => {
          response.data = blocks.filter(item => item.id !== blockId);
          return response;
        },
      );
      setBlockToDelete(undefined);
    },
    onSettled: () => {
      setShowBlockModal(false);
    },
  });

  if (isLoading) {
    return <LoadingLayout />;
  }

  const blocks: Block[] = data?.data;

  function handleCloseBlockModal() {
    if (showBlockModal) {
      setShowBlockModal(false);
    }
    if (blockToEdit) {
      setBlockToEdit(undefined);
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
              Blocos
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
              <div className="py-8 px-4 mx-auto max-w-screen-md">
                <div className="flex justify-end">
                  <Button
                    color="light"
                    type="button"
                    onClick={() => setShowBlockModal(true)}
                  >
                    Adcionar Bloco
                  </Button>
                </div>
                <ul
                  role="list"
                  className="divide-y divide-gray-200 dark:divide-gray-600"
                >
                  {blocks?.map(block => (
                    <li
                      key={block.id}
                      className="flex justify-between gap-x-6 py-5"
                    >
                      <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200">
                            {block.name}
                          </p>
                          <time className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-gray-400">
                            {`Atualizado em  ${new Date(
                              block.updated_at,
                            ).toLocaleDateString()} às ${new Date(
                              block.updated_at,
                            ).toLocaleTimeString()}`}
                          </time>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center">
                        <Button
                          color="light"
                          onClick={() =>
                            navigate(`/questions?block_id=${block.id}`)
                          }
                        >
                          Questões
                        </Button>
                        <Dropdown
                          label="User menu dropdown"
                          renderTrigger={() => (
                            <button
                              type="button"
                              className="px-0 py-2.5 border-0 mr-2 mb-2 focus:ring-0 "
                              id="user-menu-button"
                              aria-expanded="false"
                            >
                              <HiDotsVertical className="w-5 h-5" />
                            </button>
                          )}
                        >
                          <Dropdown.Item onClick={() => setBlockToEdit(block)}>
                            Editar
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setBlockToDelete(block)}
                          >
                            Deletar
                          </Dropdown.Item>
                        </Dropdown>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
