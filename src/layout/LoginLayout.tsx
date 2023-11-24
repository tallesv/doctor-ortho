import { ReactNode, useEffect } from 'react';
import logo from '../assets/LogoDrOrtho.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

interface LogiinLayoutProps {
  children: ReactNode;
}

export function LoginLayout({ children }: LogiinLayoutProps) {
  const navigate = useNavigate();
  const { isLogged } = useAuth();

  useEffect(() => {
    if (isLogged) {
      navigate('/', { replace: true });
    }
  }, [isLogged]);

  return (
    <div className="flex min-h-full items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-3 m-auto">
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

        {children}
      </div>
    </div>
  );
}
