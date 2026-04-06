import EarningPage from '@/components/ui/creator/Earning'
import { myFetch } from '../../../../../helpers/myFetch'


const page = async () => {
  const statisticsRes = await myFetch('/wallet', {
    method: "GET"
  })
  const statistics = statisticsRes?.data || {};
  return (
    <EarningPage statistics={statistics} />
  )
}

export default page