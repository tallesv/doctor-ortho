import Input from '@/components/Form/Input';
import { useFormContext } from 'react-hook-form';
import { QuestionaryFormData } from '..';
import { Button } from '@/components/Button';
import Select from '@/components/Form/Select';
import { Label } from 'flowbite-react';
import { usePatientsQuery } from '@/shared/api/Patients/usePatientsQuery';
import { useAuth } from '@/hooks/auth';
import { LoadingLayout } from '@/layout/LoadingLayout';
import Checkbox from '@/components/Form/Checkbox';

interface PatientDataFormProps {
  onSubmitPatientData: () => void;
}

const patientGenderOptions = [
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Feminino', value: 'Feminino' },
];

export function PatientDataForm({ onSubmitPatientData }: PatientDataFormProps) {
  const {
    register,
    trigger,
    formState,
    setValue,
    watch,
    getValues,
    resetField,
  } = useFormContext<QuestionaryFormData>();

  const watchAddNewPatient = watch('add_new_pacient');

  const { user } = useAuth();

  const userFirebaseId = user.firebase_id;

  const { data: patientsData, isLoading: isPatientQueryLoading } =
    usePatientsQuery(userFirebaseId);

  const patientDataOptions = [
    {
      label: '',
      value: undefined,
    },
    ...(patientsData?.map(patient => ({
      label: `${patient.name} - ${patient.gender} - ${patient.age}`,
      value: patient.id,
    })) || []),
  ];

  async function handleSubmitPatientData() {
    const isPatientDataValid = await trigger([
      'patient_age',
      'patient_gender',
      'patient_name',
    ]);
    if (isPatientDataValid) {
      onSubmitPatientData();
    }
  }

  function handleSelectPatient(patientId: string) {
    const findPatient = patientsData?.find(
      patient => patient.id === +patientId,
    );
    if (findPatient) {
      setValue('patient_id', findPatient.id);
      setValue('patient_name', findPatient.name);
      setValue('patient_gender', findPatient.gender);
      setValue('patient_age', findPatient.age);
    }
  }

  function handleAddNewPatient() {
    const { add_new_pacient } = getValues();
    setValue('add_new_pacient', !add_new_pacient);
    resetField('patient_id');
    resetField('patient_name');
    resetField('patient_gender');
    resetField('patient_age');
  }

  if (isPatientQueryLoading) {
    return <LoadingLayout />;
  }

  return (
    <div className="flex flex-col space-y-8 w-72 lg:w-96 mx-auto">
      <h2 className="mt-4 text-3xl tracking-tight font-bold text-gray-800 dark:text-white">
        Dados do paciente
      </h2>

      {!watchAddNewPatient && (
        <Select
          options={patientDataOptions}
          label="Paciente"
          onChange={e => handleSelectPatient(e.target.value)}
          error={!!formState.errors.patient_name}
          errorMessage={formState.errors.patient_name?.message}
        />
      )}

      <Checkbox
        label="Adicionar novo paciente"
        onChange={() => handleAddNewPatient()}
        //{...register('add_new_pacient')}
      />

      {watchAddNewPatient && (
        <>
          <Input
            label="Nome"
            {...register('patient_name')}
            error={!!formState.errors.patient_name}
            errorMessage={formState.errors.patient_name?.message}
          />
          <Input
            label="Idade"
            type="number"
            {...register('patient_age')}
            error={!!formState.errors.patient_age}
            errorMessage={formState.errors.patient_age?.message}
          />
          <div>
            <Label className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">
              Sexo
            </Label>
            <Select
              options={patientGenderOptions}
              {...register('patient_gender')}
              error={!!formState.errors.patient_gender}
              errorMessage={formState.errors.patient_gender?.message}
            />
          </div>{' '}
        </>
      )}

      <Button onClick={() => handleSubmitPatientData()}>Seguir</Button>
    </div>
  );
}
