"use client";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../dialog";
import { imageFormatter } from "../../../../../helpers/imageFormatter";
// import { Button } from "@/components/ui/button";

export default function MySubscription({ data = [] }: { data: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (sub: any) => {
    setSelected(sub);
    setOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {data.length > 0 ? (
          data.map((sub: any) => (
            <button
              key={sub._id}
              onClick={() => handleOpen(sub)}
              className="flex items-center justify-between bg-[#13141f] rounded-xl px-4 py-3.5 cursor-pointer hover:bg-[#1a1b2e] transition group"
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <img
                  src={imageFormatter(sub.image)}
                  alt={sub.name}
                  className="w-11.5 h-11.5 rounded-full object-cover bg-[#1a1b2e]"
                />
                <div className="text-left">
                  <div className="text-white text-sm font-medium group-hover:text-indigo-400 transition-colors">
                    {sub.name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    Exp: {new Date(sub.end_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Middle */}
              <div className="text-right">
                <div className="text-[#8b7cf8] text-sm font-medium">
                  {sub.plan} {sub.icon}
                </div>
                <div className="text-gray-400 text-xs">
                  Started: {new Date(sub.start_date).toLocaleDateString()}
                </div>
              </div>

              {/* Right */}
              <div className="text-sm font-medium text-green-500">Active</div>
            </button>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            No active subscriptions found.
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#13141f] border-none max-w-md p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-white">
              Subscription Detail
            </DialogTitle>
          </DialogHeader>

          <div className="p-6">
            <SubscriptionDetail sub={selected} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SubscriptionDetail({ sub }: { sub: any | null }) {
  if (!sub || !sub.planDetails) return null;

  const plan = sub.planDetails;

  return (
    <div className="bg-[#16161e] border border-[#2a2a35] rounded-3xl p-5 flex flex-col gap-4 relative group hover:border-indigo-500/40 transition-all duration-300 shadow-xl overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-500" />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{sub.icon || "🚀"}</span>
          <div className="text-left">
            <h3 className="text-white font-black text-sm uppercase tracking-wide leading-tight">
              {plan.name}
            </h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {plan.category || "Subscription"}
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-white">${plan.price}</span>
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            / {plan.duration || 1}{" "}
            {(plan.duration || 1) > 1 ? "Months" : "Month"}
          </span>
        </div>

        {plan.subtitle && (
          <p className="text-gray-400 text-xs leading-relaxed italic">
            {plan.subtitle}
          </p>
        )}
      </div>

      {/* Features List */}
      <div className="space-y-2 flex-1 pt-2">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
          Plan Features
        </p>
        <div className="grid grid-cols-1 gap-2">
          {plan.features
            ?.filter((f: any) => f.status)
            .map((f: any) => (
              <div
                key={f._id}
                className="flex items-center justify-between px-3 py-2 bg-[#1a1a24] rounded-xl border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-gray-300 text-[11px] font-medium">
                    {f.name}
                  </span>
                </div>
                {f.discount > 0 && (
                  <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                    {f.discount}% OFF
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* <Button
        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors mt-2"
        disabled={true}
      >
        Subscribed
      </Button> */}
    </div>
  );
}