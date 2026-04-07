"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { myFetch } from "../../../helpers/myFetch";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export function ReportModal({ isOpen, onClose, userId, userName }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for reporting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await myFetch(`/user/report`, {
        method: "POST",
        body: {
          user: userId,
          reason: reason,
        },
      });

      if (res?.success) {
        toast.success(res?.message || `Successfully reported ${userName}`);
        setReason("");
        onClose();
      } else {
        toast.error(res?.message || "Failed to report user");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#121218] border-[#2a2a35] text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Report User
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Why are you reporting <span className="text-white font-semibold">{userName}</span>? 
            This information will help our team investigate.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue here..."
            className="w-full h-32 bg-[#1a1a23] border border-[#2a2a35] rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all resize-none"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent border-[#2a2a35] text-gray-400 hover:bg-[#1a1a23] hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all shadow-lg shadow-amber-600/20"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
