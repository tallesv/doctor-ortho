import { api } from '@/client/api';
import { useQuery } from '@tanstack/react-query';

export function useReportsQuery(userFirebaseId: string) {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => api.get(`users/${userFirebaseId}/reports`),
  });
}
