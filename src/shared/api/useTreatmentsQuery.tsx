import { useQuery } from '@tanstack/react-query';
import { api } from '../../client/api';

export function useTreatmentsQuery() {
  return useQuery({
    queryKey: ['treatments'],
    queryFn: () => api.get(`treatments`),
  });
}
