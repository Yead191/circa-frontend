
import EarningOverview from './EarningOverview'
import AnalyticsCharts from './AnalyticsCharts'
import RecentTransaction from './RecentTransaction'
import { Statistics } from '@/types'

const EarningPage = ({ statistics }: { statistics: Statistics }) => {
  return (
    <div>
      <EarningOverview statistics={statistics} />
      <AnalyticsCharts />
      <RecentTransaction />
    </div>
  )
}

export default EarningPage