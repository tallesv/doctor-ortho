import { api } from '@/client/api';
import { queryClient } from '@/config/queryClient';
import { useMutation } from '@tanstack/react-query';

type CreateReportData = {
  patient_age: number;
  patient_gender: string;
  patient_name: string;
  questions: string;
};

export function useCreateReportMutation(userFirebaseId: string) {
  return useMutation({
    mutationFn: async (
      data: CreateReportData,
    ): Promise<{ data: CreateReportData }> => {
      return api.post(`/users/${userFirebaseId}/reports`, data);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: reportResponse => {
      const { data: newReport } = reportResponse;

      queryClient.setQueryData(
        ['reports', userFirebaseId],
        (response: { data: CreateReportData[] }) => {
          response.data = [...response.data, newReport];
          return response;
        },
      );
    },
  });
}
