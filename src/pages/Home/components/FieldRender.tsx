import { Label } from 'flowbite-react';
import Input from '../../../components/Form/Input';
import { FormField, FormTreeNode } from '../../../utils/mockedQuestionary';
import { useFormController } from '../useFormController';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import Radio from '../../../components/Form/Radio';
import bindClassNames from '../../../utils/bindClassNames';

type FormData = {
  [key: string]: string;
};

interface FieldRenderProps {
  field: FormField;
  form: FormTreeNode[];
}

export function FieldRender({ field, form }: FieldRenderProps) {
  const { getValues, formState, register, unregister, watch } =
    useFormContext<FormData>();

  const watchedLinkedField = watch(field.linked_id || '');

  const { findFieldByLinkedIdInTree } = useFormController();

  const linkedField = field.linked_id
    ? findFieldByLinkedIdInTree(field.linked_id, form)
    : null;

  const showField =
    !field.linked_id ||
    (linkedField?.id === field.linked_id &&
      getValues(field.linked_id) === field.linked_awnswer);

  useEffect(() => {
    if (!showField) {
      if (getValues(field.id) !== undefined) unregister(field.id);
    }
  }, [watchedLinkedField]);

  if (showField) {
    return (
      <div className="mb-2">
        <label
          className={bindClassNames(
            '',
            !!formState.errors[field.id] ? 'text-red-600' : '',
          )}
          htmlFor={field.id}
        >
          {field.label}
        </label>
        {field.type === 'text' ? (
          <Input id={field.id} />
        ) : (
          <>
            {field.options &&
              field.options.map(option => (
                <div key={option} className="flex items-center gap-2 mt-1">
                  <Radio
                    id={option}
                    value={option}
                    error={!!formState.errors[field.id]}
                    {...register(field.id)}
                  />
                  <Label className="font-normal">{option}</Label>
                </div>
              ))}
          </>
        )}

        {!!formState.errors[field.id] && (
          <span className="ml-1 text-red-500">
            {formState.errors[field.id]?.message}
          </span>
        )}
      </div>
    );
  }
}
