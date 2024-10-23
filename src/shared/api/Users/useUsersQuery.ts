import { api } from '@/client/api';
import { useQuery } from '@tanstack/react-query';
import { parseCookies } from 'nookies';

const fetchUser = async (firebaseId: string) => {
  const { data } = await api.get(`/users/${firebaseId}`);
  return data;
};

export function useUsersQuery() {
  const cookies = parseCookies();
  const firebaseId = cookies['doctor-ortho.user-firebase-id'];

  return useQuery({
    queryKey: ['user', firebaseId],
    queryFn: () => fetchUser(firebaseId),
    enabled: !!firebaseId,
  });
}
