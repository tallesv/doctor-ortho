import Input from '../../../components/Form/Input';
import InputMask from '../../../components/Form/InputMask';
import Checkbox from '../../../components/Form/Checkbox';
import { specialitiesType } from '../../Signup/types';
import Select from '../../../components/Form/Select';
import { brazilianStates } from '../../../utils/states';
import Datepicker from '../../../components/Form/Datepicker';
import { Button } from '../../../components/Button';
import {
  EditUserFormData,
  EditUserProps,
  editUserFormSchema,
  formatDefaultEditUserData,
} from '../types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import cepPromise from 'cep-promise';
import { useState } from 'react';
import { AvatarComponent } from './AvatarComponent';
import uploadFile from '../../../utils/uploadFile';
import deleteFile from '../../../utils/deleteFile';

interface EditUserprofileProps {
  user: UserProps;
  onClickCancelEdit: () => void;
  onClickEditUser: (editUserData: EditUserProps) => void;
}

export function EditUserprofile({
  user,
  onClickCancelEdit,
  onClickEditUser,
}: EditUserprofileProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userFormData = formatDefaultEditUserData(user);

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    clearErrors,
    watch,
    control,
    getValues,
  } = useForm<EditUserFormData>({
    resolver: yupResolver(editUserFormSchema),
    defaultValues: userFormData,
  });

  const watchSpeciality = watch('speciality');
  watch('avatar');

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

  const handleEditUser: SubmitHandler<EditUserFormData> = async data => {
    try {
      setIsSubmitting(true);
      const formData = data;
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

      console.log(userFormData.avatar);

      let userAvatar = formData.avatar;
      if (typeof formData.avatar === 'object') {
        userAvatar = await uploadFile(formData.avatar);
      }

      if (userFormData.avatar && formData.avatar !== userFormData.avatar) {
        await deleteFile(userFormData.avatar);
      }

      const editUserData = {
        ...formData,
        avatar: userAvatar ? userAvatar.toString() : null,
        phone_number: data.ddi + data.phone_number,
        specialty: data.speciality.includes('Outro')
          ? `${specialityFormatted}${data.speciality_input}`
          : specialityFormatted,
      };

      delete editUserData['ddi'];
      delete editUserData.speciality_input;

      onClickEditUser(editUserData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleEditUser)}>
      <div className="flex pb-2 justify-between items-center">
        <AvatarComponent
          showTooltip={!!getValues().avatar}
          avatarUrl={getValues().avatar?.toString()}
          handleRemoveAvatar={() => setValue('avatar', undefined)}
          handleAddAvatar={imageFile => setValue('avatar', imageFile)}
        />
      </div>

      <div className="flex flex-col space-y-2 rounded-md">
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
          disabled
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
          defaultValue={user.cpf}
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
                placeholder="+055"
                defaultValue={user.phone_number.slice(0, 4)}
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
          control={control}
          error={!!formState.errors.birthdate}
          errorMessage={formState.errors.birthdate?.message}
          {...register('birthdate')}
        />

        <div className="flex max-w-md flex-col gap-3" id="checkbox">
          <label className="block ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">
            {<span className="text-red-500 mr-1">*</span>}
            Especialidade
          </label>
          {specialitiesType.map(speciality => (
            <Checkbox
              key={speciality}
              label={speciality}
              value={speciality}
              defaultChecked={userFormData.speciality.includes(speciality)}
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
                defaultValue={userFormData.postal_code}
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

      <div className="flex items-center justify-evenly pt-2">
        <button
          onClick={() => onClickCancelEdit()}
          className="flex items-center justify-center px-5 py-2.5 mr-2 mb-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Cancelar
        </button>
        <Button type="submit" isLoading={isSubmitting}>
          Atualizar
        </Button>
      </div>
    </form>
  );
}
