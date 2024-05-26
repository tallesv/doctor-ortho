import { Sidebar } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../paths';

export function SideBar() {
  const navigate = useNavigate();

  function handleClickItem(path: string) {
    navigate(path);
  }

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="border-r border-gray-200 dark:border-gray-700 py-4"
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
                onClick={() => path.path && handleClickItem(path.path)}
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
