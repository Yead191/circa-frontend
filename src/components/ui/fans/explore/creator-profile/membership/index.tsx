"use client"
import { Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { myFetch } from "../../../../../../../helpers/myFetch";


const Membership = ({ plans }: any) => {
  console.log("sdfds", plans)
  if (!plans || plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">💎</span>
        <h3 className="text-xl font-semibold text-white mb-2">No Plans Available</h3>
        <p className="text-gray-400 text-sm max-w-sm">
          There are no membership plans to display at the moment. Please check back later.
        </p>
      </div>
    );
  }

  const handleSubscribe = async (plan: any) => {
    console.log("plan", plan);
    try {
      const res = await myFetch(`/subscription/subscribe/${plan?._id}`, {
        method: "POST",
      });
      console.log(res)
      if (res?.success && res?.data) {
        window.location.href = res.data;
      } else {
        console.error("Order submission failed:", res?.message || res?.error);
      }
    } catch (error) {
      console.error("Order submission error:", error);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan: any) => (
        <div key={plan._id} className="bg-[#16161e] border border-[#2a2a35] rounded-3xl p-5 flex flex-col gap-4 relative group hover:border-indigo-500/40 transition-all duration-300 shadow-xl overflow-hidden">

          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-500" />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{plan.emoji || '🚀'}</span>
              <div className="text-left">
                <h3 className="text-white font-black text-sm uppercase tracking-wide leading-tight">{plan.name}</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{plan.category}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">${plan.price}</span>
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">/ {plan.duration} {plan.duration > 1 ? 'Months' : 'Month'}</span>
            </div>

            {plan.subtitle && <p className="text-gray-400 text-xs leading-relaxed italic">{plan.subtitle}</p>}
          </div>

          {/* Features List */}
          <div className="space-y-2 flex-1 pt-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Plan Features</p>
            <div className="grid grid-cols-1 gap-2">
              {plan.features?.filter((f: any) => f.status).map((f: any) => (
                <div key={f._id} className="flex items-center justify-between px-3 py-2 bg-[#1a1a24] rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-gray-300 text-[11px] font-medium">{f.name}</span>
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

          <Button
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors mt-2"
            onClick={() => handleSubscribe(plan)}
            disabled={plan.isSubscribed}
          >
            {plan.isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Membership;