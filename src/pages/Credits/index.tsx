import { Table } from 'flowbite-react';
import { useState } from 'react';
import Pagination from '../../components/Pagination';
import { LoadingLayout } from '../../layout/LoadingLayout';
import { useAuth } from '@/hooks/auth';
import { useOrdersQuery } from '@/shared/api/Credits/useCreditsQuery';
import { Button } from '@/components/Button';
import { AddCreditsModal } from './components/AddCreditsModal';

export type ReportsProps = {
  id: number;
  patient_name: string;
  patient_gender: string;
  patient_age: number;
  fields: string;
  created_at: string;
};

export function Credits() {
  const [currentPage, setCurrentPage] = useState(1);
  const contentPerPage = 10;
  const [isAddCreditsModalOpen, setIsAddCreditsModalOpen] = useState(false);

  //const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuth();
  const userFirebaseId = user.firebase_id;

  const { data: ordersData, isLoading: isOrdersDataLoading } =
    useOrdersQuery(userFirebaseId);

  if (isOrdersDataLoading) {
    return <LoadingLayout />;
  }

  const orders = ordersData?.data ?? [];

  //const termSearched = searchParams.get('search') || '';
  /* const filteredData = orders?.filter((report: ReportsProps) =>
    report.patient_name.toLowerCase().includes(termSearched.toLowerCase()),
  ); */

  /*   function handleSearchContent(data: string) {
    setCurrentPage(1);
    setSearchParams(state => {
      if (data === '') {
        state.delete('search');
      } else {
        state.set('search', data);
      }
      return state;
    });
  } */

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <AddCreditsModal
        showModal={isAddCreditsModalOpen}
        onCloseModal={() => setIsAddCreditsModalOpen(false)}
      />
      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <h2 className="my-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
              Créditos
            </h2>
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex items-center justify-between m-5">
                <Button onClick={() => setIsAddCreditsModalOpen(true)}>
                  Adicionar créditos
                </Button>

                <div>{`Saldo: R$ ${user.currency_amount ?? 0}`}</div>
              </div>
              <div className="overflow-x-auto sm:rounded-lg">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Transação</Table.HeadCell>
                    <Table.HeadCell>Quantidade</Table.HeadCell>
                    <Table.HeadCell>Valor</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Data</Table.HeadCell>
                    <Table.HeadCell>
                      <span className="sr-only">Delete</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {orders
                      ?.slice(
                        (currentPage - 1) * contentPerPage,
                        contentPerPage * currentPage,
                      )
                      .map(order => (
                        <Table.Row
                          key={order.id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {order.order_transaction}
                          </Table.Cell>
                          <Table.Cell>{order.quantity}</Table.Cell>
                          <Table.Cell>{`R$ ${order.value}`}</Table.Cell>
                          <Table.Cell>{order.status}</Table.Cell>
                          <Table.Cell>
                            {new Date(order.created_at).toLocaleDateString(
                              'pt-BR',
                            )}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table>

                <Pagination
                  currentPage={currentPage}
                  onPageChange={page => setCurrentPage(page)}
                  totalQuantityOfData={orders.length}
                  dataPerPage={contentPerPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
