import { useQuery } from '@tanstack/react-query';
import { api } from '../../client/api';

export function useBlocksQuery(userFirebaseId: string) {
  return useQuery({
    queryKey: ['blocks', userFirebaseId],
    queryFn: () => api.get(`/users/${userFirebaseId}/questions_sets`),
  });
}

export function useQuestionsQuery(blockId: string) {
  return useQuery({
    queryKey: ['questions', blockId],
    queryFn: () => api.get(`questions_sets/${blockId}/questions`),
  });
}

export function useRepliesQuery(questionId: string) {
  return useQuery({
    queryKey: ['replies', questionId],
    queryFn: () => api.get(`/questions/${questionId}/replies`),
  });
}
