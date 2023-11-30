import { useState } from 'react';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/Form/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';

type LoginFormData = {
  email: string;
  password: string;
};

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('Por favor insira um E-mail')
    .email('E-mail inválido'),
  password: yup.string().required('Por favor insira uma senha.'),
});

export function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: yupResolver(loginFormSchema),
  });

  const handleLogin: SubmitHandler<LoginFormData> = async ({
    email,
    password,
  }) => {
    try {
      setLoginError(false);
      setIsSubmitting(true);

      await login({ email, password });
    } catch (err) {
      setLoginError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {loginError && (
        <div className="flex justify-center p-0.5 rounded-md">
          <span className="ml-1 text-red-500">
            Combinação de email e senha incorreta.
          </span>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleLogin)}>
        <div className="flex flex-col space-y-4 rounded-md">
          <Input
            id="email-address"
            type="email"
            autoComplete="email"
            placeholder="Email"
            error={!!formState.errors.email}
            errorMessage={formState.errors.email?.message}
            {...register('email')}
          />
          <Input
            id="password"
            type="password"
            placeholder="Senha"
            error={!!formState.errors.password}
            errorMessage={formState.errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="flex flex-row justify-between">
          <a
            onClick={() => navigate('/sign-up')}
            className="text-sm mr-2 font-medium cursor-pointer text-blue-700 hover:text-blue-500"
          >
            Faça o seu cadastro
          </a>
          <a
            onClick={() => navigate('/forgot-password')}
            className="text-sm mr-2 font-medium cursor-pointer text-blue-700 hover:text-blue-500"
          >
            Esqueceu a sua senha?
          </a>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? 'Entrando' : 'Entrar'}
        </Button>
      </form>
    </>
  );
}
