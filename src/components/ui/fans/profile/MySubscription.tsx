"use client";
import { Check } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../dialog";

// ── Static data ────────────────────────────────────────────────────────────────
const SUBS = [
  { id: 1, name: "Cameron", exp: "11 Oct, 2025", tier: "Sweety", price: "$4.99", status: "Active", seed: "cam1" },
  { id: 2, name: "Cameron", exp: "11 Oct, 2025", tier: "Sweety", price: "$4.99", status: "Active", seed: "cam2" },
  { id: 3, name: "Cameron", exp: "11 Oct, 2025", tier: "Sweety", price: "$4.99", status: "Active", seed: "cam3" },
  { id: 4, name: "Cameron", exp: "11 Oct, 2025", tier: "Sweety", price: "$4.99", status: "Expired", seed: "cam4" },
  { id: 5, name: "Cameron", exp: "11 Oct, 2025", tier: "Sweety", price: "$4.99", status: "Active", seed: "cam5" },
  { id: 6, name: "Cameron", exp: "11 Oct, 2025", tier: "Diamond", price: "$9.99", status: "Active", seed: "cam6" },
  { id: 7, name: "Cameron", exp: "11 Oct, 2025", tier: "Diamond", price: "$9.99", status: "Expired", seed: "cam7" },
  { id: 8, name: "Cameron", exp: "11 Oct, 2025", tier: "Sweety", price: "$4.99", status: "Active", seed: "cam8" },
];

const FEATURES = [
  "Follow to updates",
  "See all post",
  "New feature unlock",
  "See all post",
  "Follow to updates",
];

export default function MySubscription() {
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (sub: any) => {
    setSelected(sub);
    setOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {SUBS.map((sub) => (
          <button
            key={sub.id}
            onClick={() => handleOpen(sub)}
            className="flex items-center justify-between bg-[#13141f] rounded-xl px-4 py-3.5 cursor-pointer hover:bg-[#1a1b2e] transition"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <img
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${sub.seed}`}
                className="w-11.5 h-11.5 rounded-full bg-[#1a1b2e]"
              />
              <div className="text-left">
                <div className="text-white text-sm font-medium">{sub.name}</div>
                <div className="text-gray-400 text-xs">Exp: {sub.exp}</div>
              </div>
            </div>

            {/* Middle */}
            <div className="text-right">
              <div className="text-pink-400 text-sm font-medium">{sub.tier}</div>
              <div className="text-gray-400 text-xs">{sub.price}</div>
            </div>

            {/* Right */}
            <div
              className={`text-sm font-medium ${
                sub.status === "Active" ? "text-green-500" : "text-red-500"
              }`}
            >
              {sub.status}
            </div>
          </button>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#13141f] border-none max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              Subscription Detail
            </DialogTitle>
          </DialogHeader>

          <SubscriptionDetail sub={selected} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function SubscriptionDetail({ sub }: { sub: any | null }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#13141f] rounded-2xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${sub?.seed ?? "robert"}`}
              className="w-12.5 h-12.5 rounded-full bg-[#1a1b2e]"
            />
            <div>
              <div className="text-white font-semibold text-sm">
                {sub?.name ?? "Robert Fox"}
              </div>
              <div className="text-gray-500 text-xs">
                {sub?.exp ?? "11 Oct, 2025"}
              </div>
            </div>
          </div>

          <span className="bg-green-500/20 text-green-500 text-xs font-semibold px-3 py-1 rounded-md">
            Active
          </span>
        </div>

        {/* Plan */}
        <div className="text-[#8b7cf8] font-semibold text-base mb-1">
          Diamond Plan
        </div>

        <div className="mb-2">
          <span className="text-white font-bold text-2xl">$4.99</span>
          <span className="text-gray-500 text-sm"> /m</span>
        </div>

        {/* Info */}
        <div className="text-gray-500 text-xs mb-1">
          Follow along for public updates
        </div>
        <div className="text-gray-500 text-xs mb-1">
          Purchase Date: 17/1/2026
        </div>
        <div className="text-gray-500 text-xs mb-4">
          Expired Date: 17/2/2026
        </div>

        {/* Features */}
        <div className="border-t border-white/10 pt-4 flex flex-col gap-2.5">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5.5 h-5.5 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-gray-200 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}