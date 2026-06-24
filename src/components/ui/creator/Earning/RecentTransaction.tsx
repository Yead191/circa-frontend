"use client";

import { Transaction } from '@/types';
import {
    ArrowUpRight,
    MoreHorizontal,
    CheckCircle2,
    AlertCircle,
    ArrowRightLeft,
    TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
    Dialog,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import TransactionDetailsModal from './TransactionDetailsModal';
import { getImageUrl } from '@/utils/getImageUrl';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'success':
            return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'pending':
            return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case 'failed':
            return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
        default:
            return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const RecentTransactions = ({ transactionData }: { transactionData: Transaction[] }) => {
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    return (
        <div className="mt-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-semibold text-white tracking-tight">Recent Transactions</h2>
            </div>
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500 font-medium">Your latest financial activity</p>
                <Link
                    href="/transactions"
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-all flex items-center gap-1 group"
                >
                    View All Activity
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
            </div>

            {/* Transaction List */}
            <div className="space-y-2">
                {transactionData?.length > 0 ? (
                    transactionData?.map((tx, index) => (
                        <Dialog key={tx._id || index}>
                            <DialogTrigger asChild>
                                <div
                                    onClick={() => setSelectedTx(tx)}
                                    className="group flex items-center gap-4 px-4 py-4 rounded-2xl border border-[#2a2a35]/30 bg-[#121218]/50 hover:bg-[#16161e] hover:border-emerald-500/30 transition-all duration-300 cursor-pointer shadow-sm active:scale-[0.995]"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#2a2a35] bg-[#1a1a23]">
                                            <img
                                                src={getImageUrl(tx?.user?.image) || "/api/placeholder/48/48"}
                                                alt={tx?.user?.name || "User"}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0d0d12] border border-[#2a2a35] flex items-center justify-center`}>
                                            {tx.status === 'Success' ? (
                                                <CheckCircle2 size={12} className="text-emerald-500" />
                                            ) : (
                                                <AlertCircle size={12} className="text-amber-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-[15px] text-white truncate group-hover:text-emerald-400 transition-colors">
                                                {tx?.user?.name || "Unknown User"}
                                            </span>
                                            <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider py-0 px-1.5 h-4 ${getStatusColor(tx.status)}`}>
                                                {tx.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-[13px] flex items-center gap-1">
                                                <TrendingUp size={12} /> {tx.category}
                                            </span>
                                            <span className="text-gray-600 font-bold text-[13px]">•</span>
                                            <span className="text-gray-500 text-[13px] shrink-0 font-medium">{formatDate(tx.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="shrink-0 text-right">
                                        <div className={`font-bold text-lg ${tx.type === 'Credit' ? 'text-emerald-400' : 'text-gray-300'}`}>
                                            {tx.type === 'Credit' ? '+' : ''}{formatCurrency(tx.credit_received || tx.total_price)}
                                        </div>
                                        <div className="flex items-center justify-end gap-1 text-[11px] font-bold uppercase tracking-widest text-[#4a4a58]">
                                            {tx.type} <MoreHorizontal size={10} />
                                        </div>
                                    </div>
                                </div>
                            </DialogTrigger>

                            <TransactionDetailsModal tx={tx} />
                        </Dialog>
                    ))
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center bg-[#121218] border border-dashed border-[#2a2a35] rounded-3xl">
                        <ArrowRightLeft className="text-gray-700 mb-3" size={32} />
                        <p className="text-gray-500 font-medium">No recent activity found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;