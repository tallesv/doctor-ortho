import { ReactNode, useState } from 'react';
import { UserMenuDropdown } from './components/UserMenuDropdown';
import { SideBar } from './components/SideBar';
import logo from '../../assets/LogoDrOrtho.png';
import { Outlet } from 'react-router-dom';
import { parseCookies, setCookie } from 'nookies';
import { useAuth } from '../../hooks/auth';
import { LoadingLayout } from '../LoadingLayout';
import { SidebarDialog } from './components/SidebarDialog';
import bindClassNames from '../../utils/bindClassNames';
import { CreditData } from './components/CreditData';

interface DefaultLayoutProps {
  children?: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const cookies = parseCookies();
  const themeSaved = cookies['doctor-ortho.theme'];

  const [theme, setTheme] = useState(themeSaved ?? 'white');
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const { user } = useAuth();

  document.body.classList.add(theme);

  function handleChangeTheme(themeToUse: string) {
    document.body.classList.remove(theme);
    setCookie(undefined, 'doctor-ortho.theme', themeToUse);
    setTheme(themeToUse);
    document.body.classList.add(themeToUse);
  }

  return (
    <div className={`antialiased bg-gray-50 dark:bg-gray-900`}>
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            <button
              className={bindClassNames(
                'p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden dark:text-gray-400',
                sidebarIsOpen
                  ? ' bg-gray-100 ring-2 ring-gray-100 dark:ring-gray-700 dark:bg-gray-700 hover:text-gray-900 hover:bg-gray-100  dark:hover:bg-gray-700'
                  : '',
              )}
              onClick={() => setSidebarIsOpen(true)}
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                aria-hidden="true"
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Toggle sidebar</span>
            </button>

            <a href="/" className="flex items-center justify-between mr-4">
              <img src={logo} className=" h-12" alt="Flowbite Logo" />
              {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Flowbite
              </span> */}
            </a>
          </div>
          <div className="flex items-center space-x-2 lg:order-2">
            <CreditData userCurrencyAmount={user.credit_amount ?? 0} />

            {/* <!-- Theme --> */}
            <button
              type="button"
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={() =>
                handleChangeTheme(theme === 'white' ? 'dark' : 'white')
              }
            >
              <span className="sr-only">Change theme</span>
              {/* <!-- Icon --> */}
              {theme === 'dark' ? (
                <svg
                  className="w-5 h-5 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z" />
                </svg>
              )}
            </button>
            {/* <!-- Dropdown menu --> */}

            {/* <!-- Dropdown menu --> */}
            <UserMenuDropdown />
          </div>
        </div>
      </nav>

      {/* <!-- Sidebar --> */}

      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full md:translate-x-0 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <SideBar />
        <SidebarDialog
          isOpen={sidebarIsOpen}
          handleClose={() => setSidebarIsOpen(false)}
        />
      </aside>

      <main className="h-screen overflow-auto  p-4 md:ml-64 pt-20 bg-gray-100 dark:bg-gray-900">
        {user.id ? children ?? <Outlet /> : <LoadingLayout />}
      </main>
    </div>
  );
}
