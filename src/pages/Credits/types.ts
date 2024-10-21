import * as yup from 'yup';

export const months = [
  { label: '01', value: 1 },
  { label: '02', value: 2 },
  { label: '03', value: 3 },
  { label: '04', value: 4 },
  { label: '05', value: 5 },
  { label: '06', value: 6 },
  { label: '07', value: 7 },
  { label: '08', value: 8 },
  { label: '09', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '', value: 0 },
];

export type CardData = {
  holder: string;
  number: string;
  expMonth: string;
  expYear: string;
  securityCode: string;
};

export type AddCreditsFormData = {
  cardData: CardData;
  holderIndentificationNumber: string;
  value: number;
};

export const addCreditsFormSchema = yup.object().shape({
  value: yup.number().typeError('Valor inválido').required('Insira o valor'),
  holderIndentificationNumber: yup
    .string()
    .required('Por favor insira o CPF do titular do cartão de crédito.')
    .test(
      'len',
      'CPF incorreto.',
      val =>
        val.replace('.', '').replace('.', '').replace('-', '').replace(' ', '')
          .length === 11,
    )
    .transform(value => value.replace(/[.-]/g, '')),
  cardData: yup.object().shape({
    holder: yup.string().required('Digite o nome no cartão'),
    number: yup
      .string()
      .required('Digite o número do cartão')
      .transform(value => value.replace(/\s+/g, ''))
      .matches(/^\d{16}$/, 'Cartão inválido'),
    expMonth: yup
      .string()
      .required('Selecione a data de expiração')
      .matches(/^(0[1-9]|1[0-2])$/, 'Selecione a data de expiração'),
    expYear: yup
      .string()
      .required('Selecione a data de expiração')
      .matches(/^\d{4}$/, 'Selecione a data de expiração'),
    securityCode: yup
      .string()
      .required('Digite o CCV do cartão')
      .matches(/^\d{3,4}$/, 'CCV inválido'),
  }),
});
