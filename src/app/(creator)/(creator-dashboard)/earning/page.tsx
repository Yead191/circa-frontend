import EarningPage from '@/components/ui/creator/Earning'
import { myFetch } from '../../../../../helpers/myFetch'


const page = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) => {
  const { tier_type = 'month', message_type = 'month', shop_type = 'month' } = await searchParams;

  // tierRes, messageRes, shopRes
  const [tierRes, messageRes, shopRes, statisticsRes, transactionRes] = await Promise.all([
    myFetch(`/dashboard/creator?type=${tier_type}&category=Membership`, { method: "GET", cache: "no-store" }),
    myFetch(`/dashboard/creator?type=${message_type}&category=Chat`, { method: "GET", cache: "no-store" }),
    myFetch(`/dashboard/creator?type=${shop_type}&category=Shop`, { method: "GET", cache: "no-store" }),
    myFetch('/wallet', {
      method: "GET",
      cache: "no-store"
    }),
    myFetch('/transaction', {
      method: "GET",
      cache: "no-store"
    })
  ]);


  const statistics = statisticsRes?.data || {};
  const tierData = tierRes?.data || [];
  const messageData = messageRes?.data || [];
  const shopData = shopRes?.data || [];
  const transactionData = transactionRes?.data || [];
  // console.log(transactionData)
  return (
    <EarningPage
      statistics={statistics}
      tierData={tierData}
      messageData={messageData}
      shopData={shopData}
      transactionData={transactionData}
    />
  )
}

export default page