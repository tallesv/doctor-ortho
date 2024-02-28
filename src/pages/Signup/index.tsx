import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/Form/Input';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import Select from '../../components/Form/Select';
import { brazilianStates } from '../../utils/states';
import cepPromise from 'cep-promise';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';
import Datepicker from '../../components/Form/Datepicker/index';
import {
  CreateUserProps,
  SignupFormData,
  signupFormSchema,
  specialitiesType,
} from './types';
import InputMask from '../../components/Form/InputMask';
import Checkbox from '../../components/Form/Checkbox';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../client/api';
import { FirebaseError } from 'firebase/app';

export function Signup() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUpFinished, setIsSignUpFinished] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    clearErrors,
    watch,
    control,
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupFormSchema),
    defaultValues: { speciality: [] },
  });

  const watchSpeciality = watch('speciality');

  async function handleFillAddress(cep: string) {
    const formatedCep = cep.replace(/[ -]/g, '');
    if (formatedCep && (formatedCep.length === 8 || formatedCep.length === 9)) {
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

  const { mutate } = useMutation({
    mutationFn: (data: CreateUserProps) => {
      return api.post('/users', data);
    },
    onError: () => {
      setFormError('Tente novamente');
    },
    onSuccess: () => {
      setIsSignUpFinished(true);
    },
  });

  const handleSignup: SubmitHandler<SignupFormData> = async data => {
    try {
      setFormError(undefined);
      setIsSubmitting(true);
      const firebaseResponse = await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password,
      );

      const { password, password_confirmation, ...formData } = data;
      let specialityFormatted = '';
      data.speciality.forEach((item, index) => {
        if (item !== 'Outro') {
          if (index === data.speciality.length - 1) {
            specialityFormatted += `${item}`;
          } else {
            specialityFormatted += `${item},`;
          }
        }
      });
      const createUserData = {
        ...formData,
        phone_number: data.ddi + data.phone_number,
        specialty: data.speciality.includes('Outro')
          ? `${specialityFormatted}${data.speciality_input}`
          : specialityFormatted,
        firebase_id: firebaseResponse.user.uid,
      };

      delete createUserData['ddi'];
      delete createUserData.speciality_input;

      mutate(createUserData);
    } catch (err) {
      if (
        err instanceof FirebaseError &&
        err.code === 'auth/email-already-in-use'
      ) {
        setFormError('O Email já está sendo utilizado');
      } else {
        setFormError('Tente novamente');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ease-in-out */}
      {isSignUpFinished ? (
        <div className="animate-up-down">
          <div className="flex flex-col items-center p-0.5 rounded-md">
            <span className="font-medium text-xl text-sky-700">Parabéns!</span>
            <p className="text-gray-900">A sua conta foi criada com sucesso.</p>

            <Button className="mt-8 w-full" onClick={() => navigate('/login')}>
              Fazer login
            </Button>
          </div>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit(handleSignup)}>
          <div className="flex p-0.5 rounded-md">
            <span className="text-xl text-gray-900">Criar conta</span>
          </div>

          {formError && (
            <div className="flex justify-center p-0.5 rounded-md">
              <span className="ml-1 text-red-500">{formError}</span>
            </div>
          )}

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

            <InputMask
              format="###.###.###-##"
              autoComplete="cpf"
              label="CPF"
              required
              error={!!formState.errors.cpf}
              errorMessage={formState.errors.cpf?.message}
              {...register('cpf')}
            />

            <div className="flex flex-col">
              <div className="flex">
                <div className="sm:w-2/6 w-full">
                  <InputMask
                    format="+###"
                    mask="+"
                    label="DDI"
                    required
                    placeholder="+55"
                    className="rounded-r-none rounded-l-lg"
                    error={!!formState.errors.ddi}
                    errorMessage={formState.errors.ddi?.message}
                    {...register('ddi')}
                  />
                </div>
                <div className="w-full">
                  <Input
                    label="Telefone"
                    autoComplete="phone_number"
                    type="number"
                    required
                    placeholder="99 99999 9999"
                    className="rounded-l-none rounded-r-lg"
                    error={!!formState.errors.phone_number}
                    errorMessage={formState.errors.phone_number?.message}
                    {...register('phone_number')}
                  />
                </div>
              </div>
            </div>

            <Datepicker
              label="Data de nascimento"
              required
              placeholderText="dd/mm/aaaa"
              control={control}
              error={!!formState.errors.birthdate}
              errorMessage={formState.errors.birthdate?.message}
              {...register('birthdate')}
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

            <div className="flex max-w-md flex-col gap-3" id="checkbox">
              <label className="block ml-1 text-sm font-medium text-gray-900">
                {<span className="text-red-500 mr-1">*</span>}
                Especialidade
              </label>
              {specialitiesType.map(speciality => (
                <Checkbox
                  key={speciality}
                  label={speciality}
                  value={speciality}
                  error={!!formState.errors.speciality}
                  {...register('speciality')}
                />
              ))}
              {formState.errors.speciality && (
                <span className="mt-2 text-sm text-red-600">
                  {formState.errors.speciality.message}
                </span>
              )}
            </div>

            {watchSpeciality?.includes('Outro') && (
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
                  <InputMask
                    required
                    format="#####-###"
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
      )}
    </>
  );
}
