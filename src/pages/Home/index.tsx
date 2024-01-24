import * as yup from 'yup';
import {
  useForm,
  SubmitHandler,
  FormProvider,
  UseFormReturn,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { FormTreeNode, exampleForm } from '../../utils/mockedQuestionary';
import { Button } from '../../components/Button';
import { FieldRender } from './components/FieldRender';

type FormData = {
  [key: string]: string;
};

interface FormBuildProps {
  reactHookFormsMethods: UseFormReturn<FormData, any, undefined>;
  form: FormTreeNode[];
}

function FormBuild({ reactHookFormsMethods, form }: FormBuildProps) {
  const iterateFormTree = (node: FormTreeNode) => {
    const elements = [];

    elements.push(
      <FieldRender key={node.field.id} field={node.field} form={form} />,
    );

    if (node.children) {
      node.children.forEach(child => {
        elements.push(...iterateFormTree(child));
      });
    }
    return elements;
  };

  return (
    <FormProvider {...reactHookFormsMethods}>
      {form.map(item => iterateFormTree(item))}
    </FormProvider>
  );
}

export function Home() {
  const [fieldIndex, setFieldIndex] = useState(0);
  const form = exampleForm[fieldIndex].section;

  const { field } = form[0];

  const formSchema = yup.object().shape({});

  const reactHookFormsMethods = useForm<FormData>({
    resolver: yupResolver(formSchema),
  });

  const { handleSubmit, setError } = reactHookFormsMethods;

  function itareateFromChild(node: FormTreeNode) {
    const elements = [];

    elements.push(node.field.id);

    if (node.children) {
      node.children.forEach(child => {
        elements.push(...itareateFromChild(child));
      });
    }

    return elements;
  }

  const handleSubmitForm: SubmitHandler<FormData> = async data => {
    const fields = form.map(item => itareateFromChild(item)).flat();
    const emptyFields = fields.filter(item => data[item] === null);
    if (emptyFields.length > 0) {
      emptyFields.map(field =>
        setError(field, {
          type: 'required',
          message: 'Por favor escolha uma opcao',
        }),
      );
    } else {
      if (exampleForm.length - 1 === fieldIndex) {
        console.log(data);
      } else {
        setFieldIndex(prevState => prevState + 1);
      }
    }
  };

  return (
    <FormProvider {...reactHookFormsMethods}>
      <form
        className="flex-row justify-center"
        key={field.id}
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <FormBuild reactHookFormsMethods={reactHookFormsMethods} form={form} />

        <div className="flex mt-2">
          <Button
            disabled={fieldIndex === 0}
            onClick={() => setFieldIndex(prev => prev - 1)}
          >
            Voltar
          </Button>
          <Button type="submit">Seguir</Button>
        </div>
      </form>
    </FormProvider>
  );
}
