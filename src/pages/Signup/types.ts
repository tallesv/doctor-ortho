import * as yup from 'yup';

export type SignupFormData = {
  name: string;
  email: string;
  cpf: string;
  ddi?: string;
  phone_number: string;
  birthdate: Date;
  password: string;
  password_confirmation: string;
  speciality: string[];
  speciality_input?: string;
  postal_code: string;
  state: string;
  city: string;
  street: string;
  number: string;
};

export type CreateUserProps = {
  name: string;
  email: string;
  cpf: string;
  ddi?: string;
  phone_number: string;
  birthdate: Date;
  password: string;
  password_confirmation: string;
  speciality: (string | undefined)[];
  speciality_input?: string;
  postal_code: string;
  state: string;
  city: string;
  street: string;
  number: string;
  firebase_id: string;
};

export const signupFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('Por favor insira um E-mail.')
    .email('E-mail inválido.'),
  cpf: yup
    .string()
    .required('Por favor insira o seu CPF.')
    .test(
      'len',
      'CPF incorreto.',
      val =>
        val.replace('.', '').replace('.', '').replace('-', '').replace(' ', '')
          .length === 11,
    ),
  ddi: yup
    .string()
    .test(
      'Required',
      'Por favor insira o DDI do seu telefone.',
      value => value!.length > 0,
    ),
  phone_number: yup.string().required('Por favor insira o seu telefone.'),
  birthdate: yup.date().required('Por favor insira a sua data de nascimento.'),
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
  speciality: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Por favor selecione pelo menos uma especialidade.')
    .required(),
  speciality_input: yup
    .string()
    .test('Required', 'Por favor insira a sua especialidade.', (value, ctx) => {
      if (ctx.parent.speciality.includes('Outro')) {
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

export const specialitiesType = [
  'Ortodontia',
  'Ortopedia',
  'Cirurgião bucomaxilo',
  'Harmonização facial',
  'Odontopediatria',
  'Outro',
];
