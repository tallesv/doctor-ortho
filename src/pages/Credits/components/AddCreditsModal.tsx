import { Button } from '@/components/Button';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import { Modal } from 'flowbite-react';
import Cards from 'react-credit-cards-2';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import InputMask from '@/components/Form/InputMask';

interface AddCreditsModalProps {
  showModal: boolean;
  onCloseModal: () => void;
}

const months = [
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

type CardData = {
  holder: string;
  number: string;
  expMonth: string;
  expYear: string;
  securityCode: string;
};

type AddCreditsFormData = {
  cardData: CardData;
};

const addCreditsFormSchema = yup.object().shape({
  cardData: yup.object().shape({
    holder: yup.string().required('Digite o nome no cartão'),
    number: yup
      .string()
      .required('Digite o número do cartão')
      .matches(/^\d{4} \d{4} \d{4} \d{4}$/, 'Cartão inválido'),
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

export function AddCreditsModal({
  showModal,
  onCloseModal,
}: AddCreditsModalProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const yearsOptions = [
    { label: '', value: 0 },
    ...Array(15)
      .fill(currentYear)
      .map((year, index) => ({ label: year + index, value: year + index })),
  ];

  const { register, handleSubmit, formState, watch, reset } =
    useForm<AddCreditsFormData>({
      resolver: yupResolver(addCreditsFormSchema),
    });

  const handleAddCredits: SubmitHandler<AddCreditsFormData> = async data => {
    console.log(data);
  };

  function handleCloseModal() {
    reset();
    onCloseModal();
  }

  const watchCardData = watch('cardData');

  return (
    <Modal dismissible show={showModal} onClose={handleCloseModal}>
      <Modal.Header>Adicionar Créditos</Modal.Header>
      <Modal.Body>
        <Cards
          number={watchCardData?.number}
          expiry={`${watchCardData?.expMonth}${watchCardData?.expYear}`}
          cvc={watchCardData?.securityCode}
          name={watchCardData?.holder}
          placeholders={{ name: 'Nome' }}
          //focused={false}
        />

        <form
          className="my-6 space-y-4"
          onSubmit={handleSubmit(handleAddCredits)}
        >
          <InputMask
            format="#### #### #### ####"
            label="Número do cartão"
            error={!!formState.errors.cardData?.number}
            errorMessage={formState.errors.cardData?.number?.message}
            {...register('cardData.number')}
          />

          <Input
            label="Nome no cartão"
            error={!!formState.errors.cardData?.holder}
            errorMessage={formState.errors.cardData?.holder?.message}
            {...register('cardData.holder')}
          />

          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-4 lg:col-span-2">
              <label className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">
                Data de expiração
              </label>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <Select
                    defaultValue={0}
                    options={months.slice(currentMonth)}
                    error={!!formState.errors.cardData?.expMonth}
                    errorMessage={formState.errors.cardData?.expMonth?.message}
                    {...register('cardData.expMonth')}
                  ></Select>
                </div>

                <div className="col-span-3 lg:col-span-2">
                  <Select
                    defaultValue={0}
                    options={yearsOptions}
                    error={!!formState.errors.cardData?.expYear}
                    errorMessage={formState.errors.cardData?.expYear?.message}
                    {...register('cardData.expYear')}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-4 lg:col-span-2">
              <InputMask
                format="###"
                label="Código de segurança (CVV)"
                error={!!formState.errors.cardData?.securityCode}
                errorMessage={formState.errors.cardData?.securityCode?.message}
                {...register('cardData.securityCode')}
              />
            </div>
          </div>

          <div className="pt-1">
            <Button type="submit" className="w-full">
              Comprar créditos
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
