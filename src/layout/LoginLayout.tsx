import { ReactNode } from 'react';
import logo from '../assets/LogoDrOrtho.png';
import { Outlet } from 'react-router-dom';

interface LogiinLayoutProps {
  children?: ReactNode;
}

export function LoginLayout({ children }: LogiinLayoutProps) {
  return (
    <div className="flex min-h-full items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm lg:max-w-md space-y-3 m-auto">
        <div>
          <img
            className="mx-auto w-4/5  sm:w-auto"
            src={logo}
            alt="Your Company"
          />
          {/* <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Doctor Ortho
          </h2> */}
        </div>

        {children ?? <Outlet />}
      </div>
    </div>
  );
}
