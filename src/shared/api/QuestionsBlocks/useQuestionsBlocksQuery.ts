import { api } from '@/client/api';
import { BlockType } from '@/pages/Questionaries/types';
import { useQuery } from '@tanstack/react-query';

export function useQuestionsBlockQuery(userFirebaseId: string) {
  return useQuery<BlockType[]>({
    queryKey: ['questions-blocks', userFirebaseId],
    queryFn: () =>
      api
        .get(`/users/${userFirebaseId}/questions_sets`)
        .then(response => response.data),
  });
}
