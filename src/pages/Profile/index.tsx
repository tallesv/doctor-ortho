import { useState } from 'react';
import { DisplayUserProfile } from './components/DisplayUserProfile';
import { EditUserprofile } from './components/EditUserProfile';
import { useAuth } from '../../hooks/auth';
import { LoadingLayout } from '../../layout/LoadingLayout';
import { useMutation } from '@tanstack/react-query';
import { EditUserProps } from './types';
import { api } from '../../client/api';

export function Profile() {
  const [action, setAction] = useState('view');
  const { user, setUser } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: EditUserProps): Promise<{ data: UserProps }> => {
      return api.put(`/users/${user.firebase_id}`, data);
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: editUserResponse => {
      setUser(editUserResponse.data);
      setAction('view');
    },
  });

  if (!user.name || isPending) {
    return <LoadingLayout />;
  }

  return (
    <section className="max-w-2xl my-4 bg-gray-50 dark:bg-gray-800 mx-auto rounded-lg shadow-md">
      <div className="py-8 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-700 dark:text-white">
          Perfil
        </h2>

        {action === 'view' && (
          <DisplayUserProfile
            user={user}
            onClickEditUser={() =>
              setAction(prevState => (prevState === 'view' ? 'edit' : 'view'))
            }
          />
        )}
        {action === 'edit' && (
          <EditUserprofile
            user={user}
            onClickCancelEdit={() => setAction('view')}
            onClickEditUser={editUserData => mutate(editUserData)}
          />
        )}
      </div>
    </section>
  );
}
