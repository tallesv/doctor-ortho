import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/Form/Input';
import { Button } from '../../components/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { toast } from 'react-toastify';

type ResetPasswordFormData = {
  new_password: string;
  new_password_confirmation: string;
};

const resetPasswordFormSchema = yup.object().shape({
  new_password: yup
    .string()
    .required('Por favor insira uma Senha.')
    .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  new_password_confirmation: yup
    .string()
    .required('Por favor insira a confirmação da senha.')
    .min(6, 'A senha deve ter no mínimo 6 caracteres.')
    .oneOf([yup.ref('new_password')], 'As senhas precisam ser iguais.'),
});

export function ResetPassword() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchParams] = useSearchParams();

  const code = searchParams.get('oobCode');

  const { register, handleSubmit, formState } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordFormSchema),
  });

  const handleResetPassword: SubmitHandler<ResetPasswordFormData> = async ({
    new_password,
  }) => {
    try {
      setIsSubmitting(true);
      await auth.confirmPasswordReset(code!, new_password);
      toast.success('Senha alterada.');
      navigate('/');
    } catch (err) {
      toast.error(
        'Ocorreu um erro ao alterar a senha, por favor tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  async function verifyCode(code: string) {
    try {
      await auth.verifyPasswordResetCode(code);
    } catch (err) {
      toast.warning('O link para resetar a senha expirou!');
      navigate('/login');
    }
  }

  useEffect(() => {
    if (code) {
      verifyCode(code);
    } else {
      navigate('/');
    }
  }, []);

  return (
    <>
      <div className="flex p-0.5 rounded-md">
        <span className="text-xl text-gray-900">Alterar senha</span>
      </div>

      <form
        className="mt-6 space-y-6"
        onSubmit={handleSubmit(handleResetPassword)}
      >
        <div className="flex flex-col space-y-4 rounded-md">
          <Input
            type="password"
            label="Nova senha"
            error={!!formState.errors.new_password}
            errorMessage={formState.errors.new_password?.message}
            {...register('new_password')}
          />

          <Input
            type="password"
            label="Confirmação da senha"
            error={!!formState.errors.new_password_confirmation}
            errorMessage={formState.errors.new_password_confirmation?.message}
            {...register('new_password_confirmation')}
          />
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? 'Alterarndo' : 'Alterar'}
        </Button>
      </form>
    </>
  );
}
