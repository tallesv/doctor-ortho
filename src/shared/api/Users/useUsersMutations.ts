import { firebaseAuth } from '@/config/firebase';
import { queryClient } from '@/config/queryClient';
import { useMutation } from '@tanstack/react-query';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { setCookie, destroyCookie } from 'nookies';

interface LoginProps {
  email: string;
  password: string;
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: async ({ email, password }: LoginProps) => {
      const signInResponse = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );

      const token = await signInResponse.user.getIdTokenResult();
      const userFirebaseId = signInResponse.user.uid;

      setCookie(undefined, 'doctor-ortho.token', token.token, {
        maxAge: 60 * 60 * 24 * 1,
        path: '/',
      });
      setCookie(undefined, 'doctor-ortho.user-firebase-id', userFirebaseId, {
        maxAge: 60 * 60 * 24 * 1,
        path: '/',
      });

      return { token: token.token, userFirebaseId };
    },
    onSuccess: async ({ userFirebaseId }) => {
      queryClient.invalidateQueries({ queryKey: ['user', userFirebaseId] });
    },
    onError: (err: any) => {
      console.error('Login error: ', err);
    },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      await signOut(firebaseAuth);

      destroyCookie(undefined, 'doctor-ortho.token');
      destroyCookie(undefined, 'doctor-ortho.user-firebase-id');

      queryClient.clear();
    },
  });
}
