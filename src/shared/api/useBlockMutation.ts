import { useMutation } from '@tanstack/react-query';
import { api } from '../../client/api';
import { BlockFormData } from '../../pages/Questionaries/Blocks/components/BlockModal';
import { BlockType } from '../../pages/Questionaries/types';
import { queryClient } from '../../config/queryClient';
import { Dispatch, SetStateAction } from 'react';

type SetBlockType = Dispatch<SetStateAction<BlockType | undefined>>;

export function useCreateBlockMutation(
  userFirebaseId: string,
  setShowBlockModal: Dispatch<SetStateAction<boolean>>,
) {
  return useMutation({
    mutationFn: async (data: BlockFormData): Promise<{ data: BlockType }> => {
      return api.post(`/users/${userFirebaseId}/questions_sets`, data);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: blockResponse => {
      const { data: newBlock } = blockResponse;

      queryClient.setQueryData(
        ['blocks', userFirebaseId],
        (response: { data: BlockType[] }) => {
          response.data = [...response.data, newBlock];
          return response;
        },
      );
    },
    onSettled: () => {
      setShowBlockModal(false);
    },
  });
}

export function useEditBlockMutation(
  userFirebaseId: string,
  setBlockToEdit: SetBlockType,
) {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      id: number;
    }): Promise<{ data: BlockType }> => {
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
        (response: { data: BlockType[] }) => {
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
}

export function useDeleteBlockMutation(
  userFirebaseId: string,
  setBlockToDelete: SetBlockType,
) {
  return useMutation({
    mutationFn: async (id: number): Promise<{ data: BlockType }> => {
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
        (response: { data: BlockType[] }) => {
          response.data = response.data.filter(item => item.id !== blockId);
          return response;
        },
      );
    },
    onSettled: () => {
      setBlockToDelete(undefined);
    },
  });
}
