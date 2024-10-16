import { api } from '@/client/api';
import { queryClient } from '@/config/queryClient';
import { useMutation } from '@tanstack/react-query';

type CreatePatientData = {
  name: string;
  gender: string;
  age: number;
};

interface CreatePatientResponse extends CreatePatientData {
  id: number;
}

export function useCreatePatientMutation(userFirebaseId: string) {
  return useMutation({
    mutationFn: async (data: CreatePatientData) => {
      const response = await api.post<CreatePatientResponse>(
        `/users/${userFirebaseId}/patients`,
        data,
      );
      return response.data;
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: newPatient => {
      queryClient.setQueryData(
        ['patients', userFirebaseId],
        (response: { data: CreatePatientResponse[] }) => {
          if (!response) {
            return { data: [newPatient] };
          }

          return {
            ...response,
            data: [...response.data, newPatient],
          };
        },
      );
    },
  });
}
