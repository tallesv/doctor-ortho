import { api } from '@/client/api';
import { useQuery } from '@tanstack/react-query';

interface OrderQueryResponse {
  data: OrderProps[];
}

export function useOrdersQuery(userFirebaseId: string) {
  return useQuery<OrderQueryResponse>({
    queryKey: ['orders'],
    queryFn: () => api.get(`users/${userFirebaseId}/orders`),
  });
}
