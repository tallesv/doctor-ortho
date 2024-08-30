import { api } from '@/client/api';
import { queryClient } from '@/config/queryClient';
import { useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

type CreateReportData = {
  patient_age: number;
  patient_gender: string;
  patient_name: string;
  fields: string;
};

type ReportProps = {
  id: number;
  patient_name: string;
  patient_gender: string;
  patient_age: number;
  fields: string;
  created_at: string;
};

type SetReportType = Dispatch<SetStateAction<ReportProps | undefined>>;

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

export function useDeleteReportMutation(
  userFirebaseId: string,
  setReportToDelete: SetReportType,
) {
  return useMutation({
    mutationFn: async (id: number): Promise<{ data: ReportProps }> => {
      return api.delete(`/users/${userFirebaseId}/reports/${id}`);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: (_, blockId) => {
      queryClient.setQueryData(
        ['reports', userFirebaseId],
        (response: { data: ReportProps[] }) => {
          response.data = response.data.filter(item => item.id !== blockId);
          return response;
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setReportToDelete(undefined);
    },
  });
}
