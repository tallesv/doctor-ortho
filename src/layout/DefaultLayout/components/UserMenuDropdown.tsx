import { Avatar, Dropdown } from 'flowbite-react';
import { useAuth } from '../../../hooks/auth';

export function UserMenuDropdown() {
  const { logout } = useAuth();

  async function handleSignOut() {
    logout();
  }

  return (
    <Dropdown
      label="User menu dropdown"
      renderTrigger={() => (
        <button
          type="button"
          className="flex mx-4 p-2 text-sm bg-gray-800 rounded-lg md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          id="user-menu-button"
          aria-expanded="false"
        >
          <span className="sr-only">Open user menu</span>

          <Avatar rounded className="w-4 h-4 " />
        </button>
      )}
    >
      <Dropdown.Header>
        <span className="block text-sm">usuario admin</span>
        <span className="block truncate text-sm font-medium">
          admin@doctor-ortho.com
        </span>
      </Dropdown.Header>
      <Dropdown.Item>Perfil</Dropdown.Item>
      {/* <Dropdown.Item>Settings</Dropdown.Item>
      <Dropdown.Item>Earnings</Dropdown.Item> */}
      <Dropdown.Divider />
      <Dropdown.Item onClick={handleSignOut}>Sair</Dropdown.Item>
    </Dropdown>
  );
}
