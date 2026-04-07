'use client'

import React from 'react';
import {
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination, Transaction } from '@/types';
import TransactionDetailsModal, {
  formatCurrency,
  formatDate,
  getStatusColor
} from '../../Earning/TransactionDetailsModal';

const TransactionsPage = ({ transactionData, pagination }: { transactionData: Transaction[], pagination: Pagination }) => {
  console.log(pagination)
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mt-8 mb-12">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">Financial History</h2>
        <p className="text-gray-500 font-medium">Track and manage every transaction in your dashboard</p>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {transactionData?.length > 0 ? (
          transactionData.map((tx, index) => (
            <Dialog key={tx._id || index}>
              <DialogTrigger asChild>
                <div
                  className="group flex items-center gap-4 px-6 py-5 rounded-3xl border border-[#2a2a35]/30 bg-[#121218]/50 hover:bg-[#16161e] hover:border-emerald-500/30 transition-all duration-300 cursor-pointer shadow-sm active:scale-[0.995]"
                >
                  {/* Thumbnail */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#2a2a35] bg-[#1a1a23]">
                      <img
                        src={tx?.user?.image || "/api/placeholder/56/56"}
                        alt={tx?.user?.name || "User"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0d0d12] border border-[#2a2a35] flex items-center justify-center`}>
                      {tx.status === 'Success' ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={14} className="text-amber-500" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-lg text-white truncate group-hover:text-emerald-400 transition-colors">
                        {tx?.user?.name || "Unknown User"}
                      </span>
                      <Badge variant="outline" className={`text-[11px] uppercase font-black tracking-widest py-0.5 px-2 h-5 ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm font-medium flex items-center gap-1.5">
                        <TrendingUp size={14} /> {tx.category}
                      </span>
                      <span className="text-gray-600 font-black">•</span>
                      <span className="text-gray-500 text-sm font-medium shrink-0">{formatDate(tx.createdAt)}</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="shrink-0 text-right">
                    <div className={`font-black text-xl ${tx.type === 'Credit' ? 'text-emerald-400' : 'text-gray-300'}`}>
                      {tx.type === 'Credit' ? '+' : ''}{formatCurrency(tx.credit_received || tx.total_price)}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#4a4a58] mt-0.5">
                      {tx.type} <MoreHorizontal size={12} />
                    </div>
                  </div>
                </div>
              </DialogTrigger>

              <TransactionDetailsModal tx={tx} />
            </Dialog>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center bg-[#121218] border border-dashed border-[#2a2a35] rounded-[2.5rem]">
            <ArrowRightLeft className="text-gray-800 mb-4" size={48} />
            <h3 className="text-white text-xl font-bold mb-1">No transaction history</h3>
            <p className="text-gray-600 font-medium">Your historical records will appear here</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination?.totalPage > 1 && (
        <div className="mt-12 flex items-center justify-between px-2">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
            Page <span className="text-white">{pagination.page}</span> of{" "}
            <span className="text-white">{pagination.totalPage}</span>
          </p>

          <div className="flex items-center gap-2">
            {/* Previous */}
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="cursor-pointer bg-[#121218] border-[#2a2a35] text-white hover:bg-[#1a1a23] disabled:opacity-30 rounded-xl px-4 h-10 font-bold group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: pagination.totalPage }, (_, i) => i + 1)
              .filter((page) => {
                const current = pagination.page;
                return (
                  page === 1 ||
                  page === pagination.totalPage ||
                  Math.abs(page - current) <= 1
                );
              })
              .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                  acc.push("...");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className="text-gray-500 px-1">
                    ...
                  </span>
                ) : (
                  <Button
                    key={item}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(item as number)}
                    className={`cursor-pointer rounded-xl w-10 h-10 font-bold text-sm transition-all
                ${pagination.page === item
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "bg-[#121218] border-[#2a2a35] text-gray-400 hover:bg-[#1a1a23] hover:text-white"
                      }`}
                  >
                    {item}
                  </Button>
                )
              )}

            {/* Next */}
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPage}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="cursor-pointer bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-30 rounded-xl px-4 h-10 font-bold group"
            >
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;