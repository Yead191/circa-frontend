import { Statistics } from "@/types"

const EarningOverview = ({ statistics }: { statistics: Statistics }) => {
  console.log(statistics)
  return (
    <div className="mb-5">
      <div className="bg-cardBg text-white p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">

        <div className="space-y-2">
          <h3 className="text-gray-400 text-sm font-medium">Total Earning</h3>
          <div className="flex items-baseline gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#b085f5]">${(statistics?.analatys?.totalEarning).toFixed(2)}</h1>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded-full text-xs font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              12%
            </span>
            <span className="text-gray-500 text-sm">vs last month</span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between gap-6 md:h-full">
          <div className="text-right">
            <div className="bg-[#2d2412] border border-[#fcc419]/30 text-[#fcc419] px-4 py-2 rounded-xl flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1m5 1a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z" clip-rule="evenodd" />
              </svg>
              <span className="font-medium text-sm">Balance : {statistics?.balance} Coins</span>
            </div>
            <p className="text-gray-500 text-xs mt-2 mr-1">1 coin = 0.5 USD</p>
          </div>

          <button className="group flex items-center gap-2 border border-[#7c66dc] text-[#7c66dc] hover:bg-[#7c66dc] hover:text-white transition-all duration-300 px-2 py-3 rounded-xl font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Withdraw
          </button>
        </div>

      </div>
    </div>
  )
}

export default EarningOverview