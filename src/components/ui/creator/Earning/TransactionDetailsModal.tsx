"use client";

import {
    Calendar,
    Hash,
    User,
    CheckCircle2,
    AlertCircle,
    ArrowRightLeft,
    TrendingUp,
} from 'lucide-react';
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';

interface TransactionDetailsModalProps {
    tx: Transaction;
}

// ─────────────────────────────────────────────
// HELPERS (Local to Modal)
// ─────────────────────────────────────────────
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};

export const getStatusColor = (status: string) => {
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

const TransactionDetailsModal = ({ tx }: TransactionDetailsModalProps) => {
    if (!tx) return null;

    return (
        <DialogContent className="bg-[#0d0d12] border-[#2a2a35] text-white max-w-md p-0 overflow-hidden rounded-3xl  ">
            <div className="flex-1  px-8">
                <DialogHeader className="mb-8 pr-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-white mb-1">Transaction Details</DialogTitle>
                            <p className="text-sm text-gray-500 font-medium">Full summary of this activity</p>
                        </div>
                        <div className={`p-3 rounded-2xl ${getStatusColor(tx.status)} border bg-opacity-20 flex items-center justify-center`}>
                            {tx.status === 'Success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar flex flex-col">
                    {/* Status & Amount Hero */}
                    <div className="bg-[#16161e] border border-[#2a2a35] rounded-3xl p-6 text-center space-y-2">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Total Price</p>
                        <h3 className="text-4xl font-black text-emerald-400">
                            {formatCurrency(tx.total_price)}
                        </h3>
                        <div className="pt-2">
                            <Badge className={`${getStatusColor(tx.status)} border-none py-1 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider`}>
                                {tx.status} Transaction
                            </Badge>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Structure</h4>
                        <div className="bg-[#121218] border border-[#2a2a35] rounded-2xl overflow-hidden divide-y divide-[#2a2a35]">
                            <DetailItem icon={<User size={14} />} label="From" value={tx.user?.name} highlight />
                            <DetailItem icon={<TrendingUp size={14} />} label="Category" value={tx.category} />
                            <DetailItem icon={<ArrowRightLeft size={14} />} label="Type" value={tx.type} />
                            <DetailItem icon={<Hash size={14} />} label="Trx ID" value={tx.transaction_id} />
                            <DetailItem icon={<Calendar size={14} />} label="Date" value={formatDate(tx.createdAt)} />
                        </div>
                    </div>

                    {/* Financial Detail */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Financial Detail</h4>
                        <div className="bg-[#121218] border border-[#2a2a35] rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Total Price</span>
                                <span className="text-white font-medium">{formatCurrency(tx.total_price)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Platform Fee</span>
                                <span className="text-rose-400 font-medium">-{formatCurrency(tx.platform_fee)}</span>
                            </div>
                            <div className="h-px bg-[#2a2a35] my-1" />
                            <div className="flex justify-between text-base font-bold">
                                <span className="text-white">Net Total</span>
                                <span className="text-emerald-400 underline underline-offset-4 decoration-emerald-500/30">
                                    {formatCurrency(tx.total_price - tx.platform_fee)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#16161e] p-6 text-center border-t border-[#2a2a35] shrink-0">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">Encrypted Transaction Reference</p>
            </div>
        </DialogContent>
    );
};

const DetailItem = ({ icon, label, value, highlight = false }: any) => (
    <div className="flex items-center justify-between p-4 px-5">
        <div className="flex items-center gap-3 text-gray-400">
            <div className="w-8 h-8 rounded-lg bg-[#1a1a23] border border-[#2a2a35] flex items-center justify-center text-gray-500">
                {icon}
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider">{label}</span>
        </div>
        <span className={`text-[14px] font-semibold ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</span>
    </div>
);

export default TransactionDetailsModal;
