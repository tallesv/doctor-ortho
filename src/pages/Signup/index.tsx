import { useState } from 'react';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/Form/Input';
import { LoginLayout } from '../../layout/LoginLayout';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import Select from '../../components/Form/Select';
import { brazilianStates } from '../../utils/states';
import cepPromise from 'cep-promise';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';

type SignupFormData = {
  name: string;
  email: string;
  cpf: string;
  password: string;
  password_confirmation: string;
  postal_code?: string;
  state?: string;
  city?: string;
  street?: string;
  number?: string;
};

const signupFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('Por favor insira um E-mail.')
    .email('E-mail inválido.'),
  cpf: yup.string().required('Por favor insira o seu CPF.'),
  name: yup.string().required('Por favor insira o seu Nome.'),
  password: yup
    .string()
    .required('Por favor insira uma Senha.')
    .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  password_confirmation: yup
    .string()
    .required('Por favor insira a confirmação da senha.')
    .min(6, 'A senha deve ter no mínimo 6 caracteres.')
    .oneOf([yup.ref('password')], 'As senhas precisam ser iguais.'),
  postal_code: yup.string(),
  state: yup.string(),
  city: yup.string(),
  street: yup.string(),
  number: yup.string(),
});

export function Signup() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);

  const { register, handleSubmit, formState, setValue, clearErrors } =
    useForm<SignupFormData>({
      resolver: yupResolver(signupFormSchema),
    });

  async function handleFillAddress(cep: string) {
    if (cep && (cep.length === 8 || cep.length === 9)) {
      const formatedCep = cep.replace(/-/g, '');
      const { state, city, street } = await cepPromise(formatedCep);
      console.log(state);
      console.log(city);
      setValue(
        'state',
        String(brazilianStates.find(item => item.abbreviation === state)?.name),
      );
      setValue('city', city);
      setValue('street', street);
      clearErrors();
    }
  }

  const handleSignup: SubmitHandler<SignupFormData> = async data => {
    try {
      setFormError(false);
      setIsSubmitting(true);
      await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password,
      );
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
      <div className="flex p-0.5 rounded-md">
        <span className="text-xl text-gray-900">Criar conta</span>
      </div>

      {formError && (
        <div className="flex justify-center p-0.5 rounded-md">
          <span className="ml-1 text-red-500">Tente novamente.</span>
        </div>
      )}
      <form className="mt-6 space-y-6" onSubmit={handleSubmit(handleSignup)}>
        <div className="flex flex-col space-y-4 rounded-md">
          <Input
            autoComplete="name"
            label="Nome"
            required
            error={!!formState.errors.name}
            errorMessage={formState.errors.name?.message}
            {...register('name')}
          />
          <Input
            id="email-address"
            type="email"
            autoComplete="email"
            label="Email"
            required
            error={!!formState.errors.email}
            errorMessage={formState.errors.email?.message}
            {...register('email')}
          />
          <Input
            autoComplete="cpf"
            label="CPF"
            required
            error={!!formState.errors.cpf}
            errorMessage={formState.errors.cpf?.message}
            {...register('cpf')}
          />

          <Input
            type="password"
            label="Senha"
            required
            error={!!formState.errors.password}
            errorMessage={formState.errors.password?.message}
            {...register('password')}
          />

          <Input
            type="password"
            label="Confirmação da senha"
            required
            error={!!formState.errors.password_confirmation}
            errorMessage={formState.errors.password_confirmation?.message}
            {...register('password_confirmation')}
          />

          <div className="flex flex-col">
            <div className="flex">
              <div className="w-full">
                <Input
                  label="CEP"
                  className="rounded-l-lg rounded-r-none"
                  error={!!formState.errors.postal_code}
                  errorMessage={formState.errors.postal_code?.message}
                  {...register('postal_code')}
                  onChange={e => handleFillAddress(e.target.value)}
                />
              </div>
              <div className="sm:w-9/12 w-full">
                <Select
                  label="Estado"
                  className="rounded-l-none rounded-r-lg"
                  options={brazilianStates.map(item => ({
                    value: item.name,
                    label: item.name,
                  }))}
                  error={!!formState.errors.state}
                  errorMessage={formState.errors.state?.message}
                  {...register('state')}
                />
              </div>
            </div>
          </div>

          <Input
            label="Cidade"
            error={!!formState.errors.city}
            errorMessage={formState.errors.city?.message}
            {...register('city')}
          />

          <div className="flex flex-col">
            <div className="flex">
              <div className="w-full">
                <Input
                  label="Rua"
                  className="rounded-l-lg rounded-r-none"
                  error={!!formState.errors.street}
                  errorMessage={formState.errors.street?.message}
                  {...register('street')}
                />
              </div>
              <div className="w-1/3">
                <Input
                  label="Numero"
                  className="rounded-l-none rounded-r-lg"
                  error={!!formState.errors.number}
                  errorMessage={formState.errors.number?.message}
                  {...register('number')}
                />
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? 'Criando' : 'Criar'}
        </Button>
      </form>
    </LoginLayout>
  );
}
