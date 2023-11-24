import { useState } from 'react';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/Form/Input';
import { LoginLayout } from '../../layout/LoginLayout';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';

type ForgotPasswordFormData = {
  email: string;
};

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('Por favor insira um E-mail')
    .email('E-mail inválido'),
});

export function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);

  const { register, handleSubmit, formState } = useForm<ForgotPasswordFormData>(
    {
      resolver: yupResolver(loginFormSchema),
    },
  );

  const handleForgotPassword: SubmitHandler<ForgotPasswordFormData> = async ({
    email,
  }) => {
    try {
      setFormError(false);
      setIsSubmitting(true);
      console.log(email);
    } catch (err) {
      setFormError(true);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/');
      }, 4000);
    }
  };

  return (
    <LoginLayout>
      <div className="flex justify-center p-0.5 rounded-md">
        <span className="ml-1 text-gray-900 text-center">
          Informe o seu email e enviaremos um link para você resetar a sua
          senha.
        </span>
      </div>

      {formError && (
        <div className="flex justify-center p-0.5 rounded-md">
          <span className="ml-1 text-red-500">Tente novamente.</span>
        </div>
      )}

      <form
        className="mt-8 space-y-6"
        onSubmit={handleSubmit(handleForgotPassword)}
      >
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
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? 'Enviando' : 'Enviar'}
        </Button>
      </form>
    </LoginLayout>
  );
}
