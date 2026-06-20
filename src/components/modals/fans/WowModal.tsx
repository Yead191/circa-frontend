"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { myFetch } from "../../../../helpers/myFetch";
import { toast } from "sonner";
import { revalidateTags } from "../../../../helpers/revalidateTags";

interface WowModalProps {
  children: React.ReactNode;
  friend: any,
}

const WowModal = ({ children, friend }: WowModalProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendWow = async () => {
    try {
      const response = await myFetch(`/gift/wow/${friend?._id}`, { method: "POST" });

      if (response?.success) {
        toast?.success(response?.message);
        revalidateTags(["wallet"])
        setOpen(false)
      } else {
        if (response?.error && Array.isArray(response.error)) {
          response.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "friends" });
          });
        } else {
          toast.error(response?.message || "Something went wrong!", {
            id: "friends",
          });
        }
      }

    } catch (error) {
      console.log("error", error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[540px] bg-[#1c1c20] border-none text-white p-7 sm:rounded-[24px] shadow-2xl [&>button]:text-zinc-400 [&>button]:hover:text-white">
        <DialogHeader className="flex flex-col items-center justify-center p-0 space-y-0">
          <div className="relative mb-2 mt-2">
            <div
              className="text-[64px] leading-none"
              style={{ filter: "drop-shadow(0 0 25px rgba(255, 180, 0, 0.4))" }}
            >
              🎁
            </div>
          </div>

          <DialogTitle className="text-[22px] font-bold mt-2 text-center text-white">
            Send a Wow!
          </DialogTitle>
          <div className="text-[#A1A1AA] text-[15px] mt-1 text-center">
            Stand out and jump to the top of their inbox
          </div>

          <div className="mt-5 px-5 py-2 rounded-full bg-[#2E2819] text-[#EFC341] text-[14px] flex items-center justify-center gap-1.5 font-medium">
            <span className="text-[14px]">🪙</span>
            10 Credits
          </div>
        </DialogHeader>

        <div className="mt-3">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= 140) {
                  setMessage(e.target.value);
                }
              }}
              className="w-full bg-[#26262D] text-white p-4 pb-9 rounded-[16px] border border-transparent resize-none focus:ring-1 focus:ring-[#9DA8FD] focus:border-[#9DA8FD] outline-none placeholder:text-[#676771] min-h-[120px] text-[15px]"
              placeholder="Write something fun or flirty..."
            />
            <span className="absolute bottom-3 right-4 text-[13px] text-[#676771]">
              {message.length}/140
            </span>
          </div>

          <button onClick={() => handleSendWow()} className="w-full mt-3 py-3.5 rounded-[12px] bg-[#9EA4F9] hover:bg-[#8D94F5] text-white font-medium text-[15.5px] transition-colors duration-200">
            Send Wow
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WowModal;
