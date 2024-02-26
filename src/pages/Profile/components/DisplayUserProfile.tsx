import { Avatar } from 'flowbite-react';
import { HiOutlinePencilAlt } from 'react-icons/hi';

interface DisplayUserProfileProps {
  user: UserProps;
  onClickEditUser: () => void;
}

export function DisplayUserProfile({
  user,
  onClickEditUser,
}: DisplayUserProfileProps) {
  return (
    <form action="#" className="space-y-4">
      <div className="flex pb-2 justify-between items-center">
        <Avatar img={user.avatar} size={'lg'} />
        <button
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          type="button"
          onClick={() => onClickEditUser()}
        >
          <HiOutlinePencilAlt className="mr-1.5 w-4 h-4" />
          Editar
        </button>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
          Nome
        </span>
        <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {user.name}
        </span>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
          Email
        </span>
        <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {user.email}
        </span>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
          CPF
        </span>
        <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {user.cpf}
        </span>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
          Telefone
        </span>
        <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {user.phone_number}
        </span>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
          Data de nascimento
        </span>
        <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {new Date(user.birthdate).toLocaleDateString()}
        </span>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
          Escpecialidade
        </span>
        <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {user.specialty}
        </span>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
          Endereço
        </span>
        <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {`${user.street}, ${user.number}, ${user.city} - ${user.state}, ${user.postal_code}`}
        </span>
      </div>
    </form>
  );
}
