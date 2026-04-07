import TransactionsPage from '@/components/ui/creator/CreatorDashboard/TransactionsPage'
import { myFetch } from '../../../../../helpers/myFetch';
import { Pagination } from '@/types';

const page = async ({ searchParams }: { searchParams: Promise<{ page?: string }> }) => {
  // TRANSACTION
  const transactionRes = await myFetch(`/transaction?page=${(await searchParams).page}`, {
    method: "GET",
    cache: "no-store"
  })
  const transactionData = transactionRes?.data || [];
  const pagination: Pagination = transactionRes?.pagination || {
    total: 0,
    limit: 10,
    page: 1,
    totalPage: 0,
  };
  return (
    <TransactionsPage transactionData={transactionData} pagination={pagination} />
  )
}

export default page