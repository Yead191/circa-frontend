
import EarningOverview from './EarningOverview'
import AnalyticsCharts from './AnalyticsCharts'
import RecentTransaction from './RecentTransaction'
import { Statistics, Transaction } from '@/types'

interface EarningPageProps {
  statistics: Statistics;
  tierData: any[];
  messageData: any[];
  shopData: any[];
  transactionData: Transaction[];
}

const EarningPage = ({ statistics, tierData, messageData, shopData, transactionData }: EarningPageProps) => {
  return (
    <div>
      <EarningOverview statistics={statistics} />
      <AnalyticsCharts
        tierData={tierData}
        messageData={messageData}
        shopData={shopData}
      />
      <RecentTransaction transactionData={transactionData} />
    </div>
  )
}

export default EarningPage