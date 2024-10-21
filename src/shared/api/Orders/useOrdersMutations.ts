import { api } from '@/client/api';
import { queryClient } from '@/config/queryClient';
import { useMutation } from '@tanstack/react-query';

export type CreateOrdertData = {
  value: number;
  credit_card_name_holder: string;
  credit_card_tax_id: string;
  envirionment: string;
  card_encrypted: string;
};

export function useCreateOrderMutation(userFirebaseId: string) {
  return useMutation({
    mutationFn: async (createOrderData: CreateOrdertData) => {
      const response = await api.post<CreateOrdertData>(
        `users/${userFirebaseId}/orders`,
        {
          quantity: 1,
          ...createOrderData,
        },
      );
      return response.data;
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: newOrder => {
      queryClient.setQueryData(
        ['orders', userFirebaseId],
        (response: { data: CreateOrdertData[] }) => {
          if (!response) {
            return { data: [newOrder] };
          }

          return {
            ...response,
            data: [...response.data, newOrder],
          };
        },
      );
    },
  });
}
