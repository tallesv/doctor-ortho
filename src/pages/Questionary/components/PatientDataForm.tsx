import Input from '@/components/Form/Input';
import { useFormContext } from 'react-hook-form';
import { QuestionaryFormData } from '..';
import { Button } from '@/components/Button';
import Select from '@/components/Form/Select';
import { Label } from 'flowbite-react';

interface PatientDataFormProps {
  onSubmitPatientData: () => void;
}

const patientGenderOptions = [
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Feminino', value: 'Feminino' },
];

export function PatientDataForm({ onSubmitPatientData }: PatientDataFormProps) {
  const { register, trigger, formState } =
    useFormContext<QuestionaryFormData>();

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
  return (
    <div className="flex flex-col space-y-8 w-72 lg:w-96 mx-auto">
      <h2 className="mt-4 text-3xl tracking-tight font-bold text-gray-800 dark:text-white">
        Dados do paciente
      </h2>
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
      </div>

      <Button onClick={() => handleSubmitPatientData()}>Seguir</Button>
    </div>
  );
}
