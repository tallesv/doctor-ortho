import { Sidebar } from 'flowbite-react';
import { HiChartPie, HiInbox, HiShoppingBag, HiUser } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const paths = [
  {
    label: 'Dashboard',
    path: '/',
    icon: HiChartPie,
  },
  {
    label: 'Produtos',
    icon: HiShoppingBag,
    children: [
      {
        label: 'Produto 1',
        path: '/',
      },
      {
        label: 'Produto 2',
        path: '/',
      },
    ],
  },
  {
    label: 'Inbox',
    path: '/',
    icon: HiInbox,
  },
  {
    label: 'Users',
    path: '/users',
    icon: HiUser,
  },
];

export function SideBar() {
  const navigate = useNavigate();

  function handleClickItem(path: string) {
    navigate(path);
  }

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="border-r border-gray-200 dark:border-gray-700"
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {paths.map(path => {
            return path.children ? (
              <Sidebar.Collapse
                key={path.label}
                icon={path.icon}
                label={path.label}
              >
                {path.children.map(pathChildren => (
                  <Sidebar.Item
                    key={pathChildren.label}
                    onClick={() => handleClickItem(pathChildren.path)}
                  >
                    {pathChildren.label}
                  </Sidebar.Item>
                ))}
              </Sidebar.Collapse>
            ) : (
              <Sidebar.Item
                key={path.label}
                onClick={() => handleClickItem(path.path)}
                icon={path.icon}
                className="cursor-pointer"
              >
                <p>{path.label}</p>
              </Sidebar.Item>
            );
          })}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
