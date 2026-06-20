"use client"
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { myFetch } from "../../../../helpers/myFetch";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";

interface Gift {
  _id: string;
  name: string;
  image: string;
  credit: number;
  status: string;
}

const SendGiftModal = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const getGiftsData = async () => {
    setLoading(true);
    try {
      const response = await myFetch('/gift');
      if (response?.success) {
        setGifts(response?.data);
      }
    } catch (err) {
      console.error("Failed to fetch gifts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGiftsData();
  }, []);

  const handleSendGift = async () => {
    if (!selectedGift) return;
    setSending(true);
    try {
      const response = await myFetch('/gift/send', {
        method: 'POST',
        body: JSON.stringify({ giftId: selectedGift._id, message }),
      });
      // console.log("Gift sent", response);
      setOpen(false);
      setSelectedGift(null);
      setMessage("");
    } catch (err) {
      console.error("Failed to send gift", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="absolute top-4 right-4 bg-white text-black font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <span>🎁</span> Send Gift
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[540px] bg-[#1c1c20] border-none text-white p-6 sm:rounded-[24px] shadow-2xl [&>button]:text-zinc-400 [&>button]:hover:text-white">
          <DialogHeader className="flex flex-col items-center justify-center p-0 space-y-0">
            <div className="relative mb-2 mt-2">
              <div className="text-[64px] leading-none" style={{ filter: "drop-shadow(0 0 25px rgba(255, 180, 0, 0.4))" }}>
                🎁
              </div>
            </div>
            <DialogTitle className="text-[22px] font-bold mt-2 text-center text-white">
              Send a Gift
            </DialogTitle>
            <div className="text-[#A1A1AA] text-[15px] mt-1 text-center">
              Stand out and jump to the top of their inbox
            </div>
            <div className="mt-5 px-5 py-2 rounded-full bg-[#2E2819] text-[#EFC341] text-[14px] flex items-center justify-center gap-2 font-medium">
              <svg width="15" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M21 7.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-1.5M18 12h4v-3h-4a2 2 0 00-2 2v1h-.5a.5.5 0 000 1h.5v1a2 2 0 002 2zM16 12a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              Current Balance : 120 Coins
            </div>
          </DialogHeader>

          <div className="mt-6">
            {/* Gift Selection Grid */}
            <label className="text-[15px] text-zinc-100 font-medium mb-3 block">
              Choose a Gift
            </label>

            {loading ? (
              <div className="flex items-center justify-center py-8 text-[#84848E] text-sm">
                Loading gifts...
              </div>
            ) : gifts.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-[#84848E] text-sm">
                No gifts available
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {gifts.map((gift) => {
                  const isSelected = selectedGift?._id === gift._id;
                  return (
                    <button
                      key={gift._id}
                      onClick={() => setSelectedGift(isSelected ? null : gift)}
                      className={`relative flex flex-col items-center gap-2 p-3 rounded-[16px] border transition-all duration-200 cursor-pointer
                        ${isSelected
                          ? "border-[#9EA4F9] bg-[#9EA4F9]/10 ring-1 ring-[#9EA4F9]"
                          : "border-transparent bg-[#26262D] hover:bg-[#2e2e38]"
                        }`}
                    >
                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#9EA4F9] flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}

                      {/* Gift Image */}
                      <div className=" rounded-full overflow-hidden  flex items-center justify-center">
                        <Image
                          src={getImageUrl(gift.image)}
                          height={80}
                          width={80}
                          alt={gift.name}
                          className="w-14 h-16 object-cover"
                        />
                      </div>

                      {/* Gift Name */}
                      <span className="text-white text-[12px] font-medium text-center leading-tight line-clamp-2">
                        {gift.name}
                      </span>

                      {/* Credit Cost */}
                      <div className="flex items-center gap-1 bg-[#2E2819] px-2 py-0.5 rounded-full">
                        <span className="text-[#EFC341] text-[11px] font-semibold">{gift.credit} {gift.image}</span>
                        <span className="text-[#EFC341] text-[10px]">coin{gift.credit !== 1 ? "s" : ""}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected Gift Summary */}
            {selectedGift && (
              <div className="mt-4 bg-[#26262D] rounded-[14px] p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#F2C047] w-[22px] h-[22px] rounded-full flex items-center justify-center text-[#1E1E22] text-[12px] font-bold font-serif">
                    $
                  </div>
                  <div>
                    <span className="text-white font-medium text-[14px]">{selectedGift.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#EFC341] font-semibold text-[14px]">{selectedGift.credit}</span>
                  <span className="text-[#84848E] text-[13px]">coins</span>
                </div>
              </div>
            )}

            {/* Message Textarea */}
            <div className="mt-5">
              <label className="text-[15px] text-zinc-100 font-medium mb-3 block">
                Say Something
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => {
                    if (e.target.value.length <= 140) setMessage(e.target.value);
                  }}
                  className="w-full bg-[#26262D] text-white p-4 pb-9 rounded-[16px] border border-transparent resize-none focus:ring-1 focus:ring-[#9DA8FD] focus:border-[#9DA8FD] outline-none placeholder:text-[#676771] min-h-[100px] text-[15px]"
                  placeholder="Add a short message...(optional)"
                />
                <span className="absolute bottom-3 right-4 text-[13px] text-[#676771]">
                  {message.length}/140
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSendGift}
              disabled={!selectedGift || sending}
              className={`w-full mt-6 py-3.5 rounded-[12px] font-semibold text-[15.5px] transition-all duration-200
                ${selectedGift && !sending
                  ? "bg-[#9EA4F9] hover:bg-[#8D94F5] text-white cursor-pointer"
                  : "bg-[#9EA4F9]/40 text-white/50 cursor-not-allowed"
                }`}
            >
              {sending ? "Sending..." : selectedGift ? `Send ${selectedGift.name}` : "Select a Gift"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendGiftModal;