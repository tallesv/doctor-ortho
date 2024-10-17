import { api } from '@/client/api';
import { useQuery } from '@tanstack/react-query';

export function usePatientsQuery(userFirebaseId: string) {
  return useQuery<PatientProps[]>({
    queryKey: ['patients'],
    queryFn: () =>
      api
        .get(`users/${userFirebaseId}/patients`)
        .then(response => response.data),
  });
}
