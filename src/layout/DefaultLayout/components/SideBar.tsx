import { Sidebar } from 'flowbite-react';
import { HiChartPie, HiInbox, HiShoppingBag, HiUser } from 'react-icons/hi';

export function SideBar() {
  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="border-r border-gray-200 dark:border-gray-700"
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/" icon={HiChartPie}>
            <p>Dashboard</p>
          </Sidebar.Item>
          <Sidebar.Collapse open icon={HiShoppingBag} label="Produtos">
            <Sidebar.Item href="#">Produto 1</Sidebar.Item>
            <Sidebar.Item href="#">Produto 2</Sidebar.Item>
            <Sidebar.Item href="#">Produto 3</Sidebar.Item>
            <Sidebar.Item href="#">Produto 4</Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Item href="/login" icon={HiInbox}>
            <p>Inbox</p>
          </Sidebar.Item>
          <Sidebar.Item href="/users" icon={HiUser}>
            <p>Users</p>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
