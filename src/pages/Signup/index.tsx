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
import Datepicker from '../../components/Form/Datepicker/index';
import CountrySelector from '../../components/Form/CountrySelector';
import { specialitiesType } from './types';

type SignupFormData = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birth_date: string;
  password: string;
  password_confirmation: string;
  speciality: string;
  speciality_input?: string;
  postal_code: string;
  state: string;
  city: string;
  street: string;
  number: string;
};

const signupFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('Por favor insira um E-mail.')
    .email('E-mail inválido.'),
  cpf: yup.string().required('Por favor insira o seu CPF.'),
  phone: yup.string().required('Por favor insira o seu telefone.'),
  birth_date: yup
    .string()
    .required('Por favor insira a sua data de nascimento.'),
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
  speciality: yup.string().required(),
  speciality_input: yup
    .string()
    .test('Required', 'Por favor insira a sua especialidade.', (value, ctx) => {
      if (ctx.parent.speciality === 'Outro') {
        return value!.length > 0;
      } else {
        return true;
      }
    }),
  postal_code: yup.string().required('Por favor insira o seu CEP.'),
  state: yup.string().required('Por favor insira um estado.'),
  city: yup.string().required('Por favor insira uma cidade.'),
  street: yup.string().required('Por favor insira uma rua.'),
  number: yup.string().required('Por favor insira um Número.'),
});

export function Signup() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);

  const { register, handleSubmit, formState, setValue, clearErrors, watch } =
    useForm<SignupFormData>({
      resolver: yupResolver(signupFormSchema),
    });

  const watchSpeciality = watch('speciality');

  async function handleFillAddress(cep: string) {
    if (cep && (cep.length === 8 || cep.length === 9)) {
      const formatedCep = cep.replace(/-/g, '');
      const { state, city, street } = await cepPromise(formatedCep);
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

      navigate('/');
    } catch (err) {
      setFormError(true);
    } finally {
      setIsSubmitting(false);
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
      <form className="space-y-6" onSubmit={handleSubmit(handleSignup)}>
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

          <div className="flex flex-col">
            <label className="block mb-2 ml-1 text-sm font-medium text-gray-900">
              {<span className="text-red-500 mr-1">*</span>}
              Telefone
            </label>
            <div className="flex">
              <div className="sm:w-2/6 w-full">
                <CountrySelector
                  required
                  className="rounded-r-none rounded-l-lg"
                  error={!!formState.errors.state}
                  errorMessage={formState.errors.state?.message}
                />
              </div>
              <div className="w-full">
                <Input
                  autoComplete="phone"
                  required
                  className="rounded-l-none rounded-r-lg"
                  error={!!formState.errors.phone}
                  errorMessage={formState.errors.phone?.message}
                  {...register('phone')}
                />
              </div>
            </div>
          </div>

          <Datepicker
            label="Data de nascimento"
            required
            error={!!formState.errors.birth_date}
            errorMessage={formState.errors.birth_date?.message}
            {...register('birth_date')}
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

          <Select
            required
            label="Especialidade"
            options={specialitiesType.map(item => ({
              value: item,
              label: item,
            }))}
            error={!!formState.errors.speciality}
            errorMessage={formState.errors.speciality?.message}
            {...register('speciality')}
          />

          {watchSpeciality === 'Outro' && (
            <Input
              label="Especialidade"
              required
              error={!!formState.errors.speciality_input}
              errorMessage={formState.errors.speciality_input?.message}
              {...register('speciality_input')}
            />
          )}

          <div className="flex flex-col">
            <div className="flex">
              <div className="w-full">
                <Input
                  required
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
                  required
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
            required
            label="Cidade"
            error={!!formState.errors.city}
            errorMessage={formState.errors.city?.message}
            {...register('city')}
          />

          <div className="flex flex-col">
            <div className="flex">
              <div className="w-full">
                <Input
                  required
                  label="Rua"
                  className="rounded-l-lg rounded-r-none"
                  error={!!formState.errors.street}
                  errorMessage={formState.errors.street?.message}
                  {...register('street')}
                />
              </div>
              <div className="w-1/3">
                <Input
                  required
                  label="Número"
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
