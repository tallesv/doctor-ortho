import { Table } from 'flowbite-react';
import { BlockType, QuestionType } from '../../Questionaries/types';
import Pagination from '../../../components/Pagination';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Radio from '../../../components/Form/Radio';
import { TreatmentType } from '..';

interface RepliesTableProps {
  blocks: BlockType[];
  questions: QuestionType[];
  treatment?: TreatmentType;
}

export function RepliesTable({
  blocks,
  questions,
  treatment,
}: RepliesTableProps) {
  const [termSearched, setTermSearched] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const contentPerPage = 4;

  const { register, control, watch, setValue, resetField, getValues } =
    useFormContext();

  watch();

  function getBlockNameByQuestionId(questionId: number) {
    let findBlockName;

    blocks.some(block =>
      block.questions.some(question => {
        if (questionId === question.id) {
          findBlockName = block.name;
        }
        return questionId === question.id;
      }),
    );

    return findBlockName;
  }

  const questionsSearched = termSearched
    .split(',')
    .map(item => item.trim().toLowerCase());

  const filterQuestionsByCoordinates = (
    questions: QuestionType[],
    questionsSearched: string[],
  ) => {
    if (
      questionsSearched.length === 0 ||
      (questionsSearched.length === 1 && questionsSearched[0] === '')
    ) {
      return questions;
    }

    return questions
      .map(question => {
        const filteredReplies = question.replies.filter(reply =>
          questionsSearched.some(
            term =>
              (reply.coordinate &&
                String(reply.coordinate).toLowerCase().includes(term)) ||
              reply.answer.toLowerCase().includes(term),
          ),
        );

        if (filteredReplies.length > 0) {
          return { ...question, replies: filteredReplies };
        }
        return null;
      })
      .filter(question => question !== null) as QuestionType[];
  };

  const questionsFiltered = filterQuestionsByCoordinates(
    questions,
    questionsSearched,
  );

  useEffect(() => {
    const fields = Object.keys(getValues());
    fields.forEach(field => resetField(field));
    const treatmentReplies = treatment?.replies;
    if (treatmentReplies && treatmentReplies.length > 0) {
      treatmentReplies.forEach(reply => {
        const question = questions.find(
          question => question.id === reply.question_id,
        );
        if (question) setValue(question?.id.toString(), String(reply.id));
      });
    }
  }, [treatment]);

  return (
    <div className="overflow-x-auto sm:rounded-lg">
      <div className="flex m-2 max-w-xs">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            placeholder="Ex: B1,B2,C2..."
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={e => setTermSearched(e.target.value)}
          />
        </div>
      </div>
      {questionsFiltered
        .slice((currentPage - 1) * contentPerPage, contentPerPage * currentPage)
        .map(question => (
          <Table key={question.id} hoverable>
            <Table.Head>
              <Table.HeadCell>{question.query}</Table.HeadCell>
              <Table.HeadCell className="flex justify-end">
                {getBlockNameByQuestionId(question.id)}
              </Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {question.replies.map(reply => (
                <Table.Row
                  key={reply.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {`${reply.coordinate} - ${reply.answer}`}
                  </Table.Cell>
                  <Table.Cell className="flex justify-end mx-4">
                    <Controller
                      name={question.id.toString()}
                      control={control}
                      render={() => (
                        <Radio
                          {...register(question.id.toString())}
                          value={reply.id}
                        />
                      )}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ))}

      <Pagination
        currentPage={currentPage}
        totalQuantityOfData={
          questionsSearched[0] != ''
            ? questionsFiltered.length
            : questions.length
        }
        dataPerPage={contentPerPage}
        onPageChange={page => setCurrentPage(page)}
      />
    </div>
  );
}
