import bindClassNames from '../utils/bindClassNames';
import { Link, useLocation } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';

export const docsItens = [
  {
    label: 'FAQ',
    path: '/faq',
  },
  {
    label: 'Termos de Uso',
    path: '/terms',
  },
  {
    label: 'Política de Privacidade',
    path: '/privacy-policy',
  },
];

export function DocMenu() {
  const { pathname } = useLocation();

  return (
    <div className="">
      <ul role="list" className="px-2 py-3 text-gray-900 dark:text-gray-200">
        {docsItens.map(
          item =>
            !!item.path && (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={bindClassNames(
                    'flex items-center justify-between px-2 my-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md',
                    pathname === item.path
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : '',
                  )}
                >
                  <span className="block px-2 py-3">{item.label}</span>
                  {pathname === item.path && (
                    <HiCheckCircle className="h-5 w-5" />
                  )}
                </Link>
              </li>
            ),
        )}
      </ul>
    </div>
  );
}
