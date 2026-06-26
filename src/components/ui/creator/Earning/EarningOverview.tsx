"use client";

import { Statistics } from "@/types"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { WithdrawalModal, SuccessModal } from "./WithdrawalModal"

const EarningOverview = ({ statistics }: { statistics: Statistics }) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setIsSuccessModalOpen(true)
    }
  }, [searchParams])

  const totalEarning = statistics?.analatys?.totalEarning ?? 0
  const usdBalance = (statistics?.credit ?? 0) * 0.5

  return (
    <div className="mb-5">
      <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-cardBg text-white shadow-2xl shadow-black/40">

        {/* Ambient gradient glow */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#7c66dc]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-10 h-64 w-64 rounded-full bg-[#b085f5]/15 blur-3xl" />
        {/* Subtle top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative flex flex-col gap-8 p-6 md:flex-row md:items-center md:justify-between md:p-8">

          {/* Earnings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7c66dc]/15 ring-1 ring-[#7c66dc]/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#b085f5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8M21 7v5h-5" />
                </svg>
              </span>
              <h3 className="text-sm font-medium tracking-wide text-gray-400">Total Earning</h3>
            </div>

            <h1 className="bg-linear-to-br from-white via-[#d7c8ff] to-[#b085f5] bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
              ${totalEarning.toFixed(2)}
            </h1>

            <div className="flex items-center gap-2 pt-1">
              <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-400 ring-1 ring-green-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                12%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>

          {/* Balance + action */}
          <div className="flex flex-col items-stretch gap-4 md:items-end">
            <div className="grid grid-cols-2 gap-3">
              {/* Credit */}
              <div className="rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#fcc419]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1m5 1a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Credit</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-white">{statistics?.credit ?? 0}<span className="ml-1 text-sm font-normal text-gray-500">Coins</span></p>
              </div>

              {/* Balance */}
              <div className="rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#7ee787]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Balance</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-white">{statistics?.balance ?? 0}<span className="ml-1 text-sm font-normal text-gray-500">USD</span></p>
              </div>
            </div>

            <p className="text-right text-xs text-gray-500">1 coin = 0.5 USD · ≈ ${usdBalance.toFixed(2)} withdrawable</p>

            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-[#7c66dc] to-[#9b7bf0] px-6 py-3 font-semibold text-white shadow-lg shadow-[#7c66dc]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#7c66dc]/40 hover:brightness-110 active:scale-[0.98]"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Withdraw Funds
            </button>
          </div>

        </div>
      </div>

      <WithdrawalModal
        open={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        balance={statistics?.credit || 0}
      />
      <SuccessModal
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      />
    </div>
  )
}

export default EarningOverview