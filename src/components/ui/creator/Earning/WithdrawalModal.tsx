"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { myFetch } from "../../../../../helpers/myFetch";

interface WithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
}

export function WithdrawalModal({ open, onOpenChange, balance }: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Assuming coins to USD conversion is 1 coin = 0.5 USD as per UI
    const maxUsd = balance * 0.5;
    if (value > maxUsd) {
      toast.error(`You cannot withdraw more than $${maxUsd.toFixed(2)}`);
      return;
    }

    setIsProcessing(true);

    // 
    // {amount}
    toast.promise(
      myFetch("/wallet/withdraw", {
        method: "POST",
        body: { amount: Number(amount) },
      }).then((res) => {
        if (!res.success) {
          throw new Error(res.message);
        }
        setIsProcessing(false);
        onOpenChange(false);
        return res;
      }),
      {
        loading: "Withdrawing...",
        success: (res) => res.message,
        error: (err) => err.message,
      }
    );

  };

  const maxUsd = balance * 0.5;
  const setPercent = (pct: number) => setAmount((maxUsd * pct).toFixed(2));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-110 overflow-hidden border border-white/10 bg-cardBg text-white shadow-2xl shadow-black/50 rounded-3xl p-0">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-[#7c66dc]/25 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative p-6 sm:p-7">
          <DialogHeader className="space-y-2 text-left">
            <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7c66dc]/15 ring-1 ring-[#7c66dc]/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#b085f5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <DialogTitle className="text-xl font-semibold tracking-tight">Withdraw Funds</DialogTitle>
            <DialogDescription className="text-sm text-zinc-400">
              Enter the amount you would like to withdraw to your Stripe account.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-5">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">Available Balance</span>
                <div className="text-right">
                  <span className="block text-lg font-semibold text-[#b085f5]">${maxUsd.toFixed(2)}</span>
                  <span className="text-xs text-zinc-500">{balance} Coins</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">Amount (USD)</label>
                <div className="flex gap-1.5">
                  {[0.25, 0.5, 1].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPercent(pct)}
                      className="rounded-lg bg-white/5 px-2 py-0.5 text-xs font-medium text-zinc-400 ring-1 ring-white/10 transition-colors hover:bg-[#7c66dc]/20 hover:text-[#b085f5]"
                    >
                      {pct === 1 ? "Max" : `${pct * 100}%`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <DollarSign className="h-5 w-5 text-zinc-500" />
                </div>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 rounded-xl border-white/10 bg-white/3 pl-10 text-xl font-semibold text-white transition-all placeholder:text-zinc-600 focus-visible:border-[#b085f5]/50 focus-visible:ring-[#b085f5]/40"
                />
              </div>
              <p className="mt-1.5 flex justify-end gap-1 text-xs text-zinc-500">
                <span>≈</span>
                <span className="font-medium text-zinc-400">{(parseFloat(amount || "0") * 2).toFixed(2)} Coins</span>
              </p>
            </div>
          </div>

          <DialogFooter className="items-center gap-3 sm:justify-between">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={isProcessing || !amount}
              className="group relative w-full min-w-40 overflow-hidden rounded-xl bg-linear-to-r from-[#7c66dc] to-[#9b7bf0] font-medium text-white shadow-lg shadow-[#7c66dc]/30 transition-all hover:brightness-110 disabled:opacity-60 sm:w-auto"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center">
                  Continue to Stripe <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SuccessModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const router = useRouter();

  const handleClose = () => {
    onOpenChange(false);
    // Remove query param cleanly using router
    router.replace(window.location.pathname, { scroll: false });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-100 overflow-hidden border border-white/10 bg-cardBg text-white shadow-2xl shadow-black/50 rounded-3xl p-0">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-green-400/40 to-transparent" />

        <div className="relative flex flex-col items-center gap-0 p-8 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-400 ring-8 ring-green-500/5">
            <CheckCircle className="h-10 w-10" />
          </div>
          <DialogTitle className="mb-2 text-2xl font-bold tracking-tight">Success!</DialogTitle>
          <DialogDescription className="mb-8 text-base text-zinc-400">
            Your withdrawal has been initiated. Funds will arrive in your Stripe account shortly.
          </DialogDescription>
          <Button
            onClick={handleClose}
            className="h-12 w-full rounded-xl bg-linear-to-r from-[#7c66dc] to-[#9b7bf0] font-medium text-white shadow-lg shadow-[#7c66dc]/30 transition-all hover:brightness-110"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
