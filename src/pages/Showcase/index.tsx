import { Label } from 'flowbite-react';

import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { useAuth } from '../../hooks/auth';
import { useBlocksQuery } from '../Questionaries/useQuestionariesQuery';
import { LoadingLayout } from '../../layout/LoadingLayout';
import { BlockType } from '../Questionaries/types';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../components/Button';
import Radio from '../../components/Form/Radio';
import Checkbox from '../../components/Form/Checkbox';

export type AddReplyFormData = {
  block_id: number;
  question_id: number;
  reply_ids: string[];
};

const addReplyFormSchema = yup.object().shape({
  block_id: yup.number().required('Por favor escolha um bloco.'),
  question_id: yup.number().required('Por favor escolha uma questão.'),
  reply_ids: yup
    .array()
    .of(yup.string().required())
    .required('Por favor escolha uma resposta.'),
});

export function Showcase() {
  const [_, setMobileFiltersOpen] = useState(false);

  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  const { register, formState, watch } = useForm<AddReplyFormData>({
    resolver: yupResolver(addReplyFormSchema),
    defaultValues: {
      reply_ids: [],
    },
    shouldUnregister: false,
  });

  const questioIdnSelected = watch('question_id');
  const repliesIdSelected = watch('reply_ids');

  const { data: blocksQuery, isLoading: isLoadingBlocksQuery } =
    useBlocksQuery(userFirebaseId);

  if (isLoadingBlocksQuery) {
    return <LoadingLayout />;
  }

  const blocks: BlockType[] = blocksQuery?.data;
  const questions = blocks.map(block => block.questions).flat(1);
  const questionSelected = questions?.find(question =>
    questioIdnSelected
      ? question.id === +questioIdnSelected
      : question.id === questions[0].id,
  );

  const replies = blocks
    .map(block => block.questions.map(question => question.replies))
    .flat(2);

  const repliesSelected = replies.filter(reply =>
    repliesIdSelected.includes(String(reply.id)),
  );

  console.log(repliesSelected);

  return (
    <div className="bg-white">
      <div>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Tratamentos
            </h1>

            <div className="flex items-center">
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <HiChevronDown className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                {/*                 <div className="border-b border-gray-200 py-6">
                  <Select
                    options={blocks.map(block => ({
                      value: block.id,
                      label: block.name,
                    }))}
                    error={!!formState.errors.block_id}
                    errorMessage={formState.errors.block_id?.message}
                    {...register('block_id')}
                  />
                </div>
 */}
                <div className="border-b border-gray-200 py-6">
                  <fieldset className="flex max-w-md flex-col gap-4">
                    <legend className="mb-4">Questões</legend>
                    {questions?.map(question => (
                      <div
                        key={question.id}
                        className="flex items-center gap-2"
                      >
                        <Radio
                          id={question.query}
                          value={question.id}
                          error={!!formState.errors.question_id}
                          {...register('question_id')}
                        />
                        <Label htmlFor="germany">{question.query}</Label>
                      </div>
                    ))}
                  </fieldset>
                </div>

                <div className="border-b border-gray-200 py-6">
                  <h3 className="-my-3 flow-root">
                    <div className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">
                        Respostas
                      </span>
                    </div>
                  </h3>
                  <div className="pt-6">
                    <div className="space-y-4">
                      {replies?.map(reply => (
                        <div
                          key={reply.id}
                          className="flex items-center"
                          style={{
                            display:
                              reply.question_id === questionSelected?.id
                                ? 'block'
                                : 'none',
                          }}
                        >
                          <Checkbox
                            key={reply.id}
                            label={reply.answer}
                            value={reply.id}
                            error={!!formState.errors.reply_ids}
                            {...register('reply_ids')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button type="submit">Adicionar</Button>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {/*  <RepliesTable
                  blocks={blocks}
                  repliesSelected={repliesSelected}
                /> */}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
