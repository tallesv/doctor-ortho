import { api } from '@/client/api';
import { useQuery } from '@tanstack/react-query';

export function useReportsQuery(userFirebaseId: string, patientId: string) {
  return useQuery({
    queryKey: ['reports', userFirebaseId, patientId], // Include both userFirebaseId and patientId in the query key
    queryFn: () =>
      api.get(`users/${userFirebaseId}/patients/${patientId}/reports`),
  });
}
