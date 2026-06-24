"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
}

export function WithdrawalModal({ open, onOpenChange, balance }: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleWithdraw = () => {
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
    
    // Simulate API call to get Stripe link
    setTimeout(() => {
      // Fake redirect - appending success=true to the current URL
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("success", "true");
      window.location.href = currentUrl.toString();
      setIsProcessing(false);
      onOpenChange(false);
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border border-zinc-800/60 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl font-semibold tracking-tight">Withdraw Funds</DialogTitle>
          <DialogDescription className="text-sm text-zinc-400">
            Enter the amount you would like to withdraw to your Stripe account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/40 flex justify-between items-center">
            <span className="text-sm font-medium text-zinc-400">Available Balance</span>
            <div className="text-right">
              <span className="block font-semibold text-[#b085f5]">${(balance * 0.5).toFixed(2)}</span>
              <span className="text-xs text-zinc-500">{balance} Coins</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Amount (USD)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-zinc-500" />
              </div>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 bg-zinc-900/50 border-zinc-800 text-white h-12 text-lg focus-visible:ring-[#b085f5]/50 focus-visible:border-[#b085f5]/50 transition-all rounded-xl placeholder:text-zinc-600"
              />
            </div>
            <p className="text-xs text-zinc-500 text-right mt-1.5 flex justify-end gap-1">
              <span>≈</span>
              <span className="font-medium text-zinc-400">{(parseFloat(amount || "0") * 2).toFixed(2)} Coins</span>
            </p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw} 
            disabled={isProcessing || !amount}
            className="w-full sm:w-auto bg-[#7c66dc] hover:bg-[#6c56cc] text-white min-w-[140px] transition-all rounded-xl font-medium shadow-lg shadow-[#7c66dc]/20"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center">
                Continue to Stripe <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </DialogFooter>
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
      <DialogContent className="sm:max-w-[400px] bg-zinc-950 border border-zinc-800/60 text-white shadow-2xl rounded-2xl flex flex-col items-center text-center p-8 gap-0">
        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-5 ring-8 ring-green-500/5">
          <CheckCircle className="h-8 w-8" />
        </div>
        <DialogTitle className="text-2xl font-bold mb-2 tracking-tight">Success!</DialogTitle>
        <DialogDescription className="text-zinc-400 mb-8 text-base">
          Your withdrawal has been initiated. Funds will arrive in your Stripe account shortly.
        </DialogDescription>
        <Button 
          onClick={handleClose}
          className="w-full bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl h-12 font-medium"
        >
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}
