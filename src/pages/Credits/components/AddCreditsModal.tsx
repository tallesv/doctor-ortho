import { Button } from '@/components/Button';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import { Modal } from 'flowbite-react';
import Cards from 'react-credit-cards-2';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import InputMask from '@/components/Form/InputMask';
import { useAuth } from '@/hooks/auth';
import bindClassNames from '@/utils/bindClassNames';
import { encryptCardPagSeguro } from '../utils/encryptPagseguro';
import { useCreateOrderMutation } from '@/shared/api/Orders/useOrdersMutations';
import { toast } from 'react-toastify';
import { CreditValueCard } from './CreditValueCard';
import { AddCreditsFormData, addCreditsFormSchema, months } from '../types';
import { RadioGroup } from '@headlessui/react';

interface AddCreditsModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  onAddCredit: () => void;
}

export function AddCreditsModal({
  showModal,
  onCloseModal,
  onAddCredit,
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

  const { register, handleSubmit, formState, watch, reset, control } =
    useForm<AddCreditsFormData>({
      resolver: yupResolver(addCreditsFormSchema),
    });

  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  const { mutateAsync: createOrder, isPending: isCreateOrderPending } =
    useCreateOrderMutation(userFirebaseId);

  const handleAddCredits: SubmitHandler<AddCreditsFormData> = async data => {
    try {
      const { encryptedCard } = await encryptCardPagSeguro(data.cardData);

      const payload = {
        value: data.value,
        credit_card_name_holder: data.cardData.holder,
        credit_card_tax_id: data.holderIndentificationNumber,
        envirionment: import.meta.env.DEV ? 'DEV' : 'PROD',
        card_encrypted: encryptedCard,
      };
      await createOrder(payload);
      toast.success('Créditos adicionados!');
      onAddCredit();
      handleCloseModal();
    } catch (err) {
      console.log(err);
      toast.error('Ocorreu um erro no pagamento, por favor tente novamente.');
    }
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
          className={bindClassNames(
            'my-6 space-y-4',
            isCreateOrderPending ? 'pointer-events-none opacity-70' : '',
          )}
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

          <InputMask
            format="###.###.###-##"
            autoComplete="cpf"
            label="CPF do titular do cartão"
            error={!!formState.errors.holderIndentificationNumber}
            errorMessage={formState.errors.holderIndentificationNumber?.message}
            {...register('holderIndentificationNumber')}
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

          <div>
            <label className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">
              Valor
            </label>

            <Controller
              name="value"
              control={control}
              defaultValue={100}
              render={({ field: { onChange, value } }) => (
                <RadioGroup value={value} onChange={onChange} className="mt-4">
                  <div className="grid grid-cols-4 gap-4">
                    <CreditValueCard value={100} />

                    <CreditValueCard value={200} />

                    <CreditValueCard value={300} />
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="pt-1">
            <Button
              type="submit"
              className="w-full"
              isLoading={isCreateOrderPending}
            >
              Comprar créditos
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
