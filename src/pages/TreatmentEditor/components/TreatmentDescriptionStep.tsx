import { Label } from 'flowbite-react';
import Textarea from '../../../components/Form/Textarea';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { TreatmentFormData } from '..';

interface TreatmentDescriptionStepProps {
  description?: string;
}

export function TreatmentDescriptionStep({
  description,
}: TreatmentDescriptionStepProps) {
  const { register, formState, setValue } = useFormContext<TreatmentFormData>();

  useEffect(() => {
    if (description) {
      setValue('description', description);
    }
  }, []);

  return (
    <div className="animate-up-down">
      <div className="w-2/4 mx-auto my-10">
        <div className="mb-2 block">
          <Label htmlFor="blockTitle" value="Descrição do tratamento" />
        </div>
        <Textarea
          error={!!formState.errors.description}
          errorMessage={formState.errors.description?.message}
          {...register('description')}
        />
      </div>
    </div>
  );
}
