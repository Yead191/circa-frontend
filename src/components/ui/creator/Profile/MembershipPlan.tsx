'use client';

import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Plan } from "@/types";
import { myFetch } from "../../../../../helpers/myFetch";
import { revalidateTags } from "../../../../../helpers/revalidateTags";
import { toast } from "sonner";
import PlanEditModal from "./PlanEditModal";
import ConfirmModal from "../../ConfirmModal";

export default function MembershipPlan({ onCreate, plans, features }: { onCreate: () => void, plans: Plan[], features: string[] }) {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const handleDeletePlan = async (id: string) => {
    toast.promise(myFetch(`/plan/${id}`, {
      method: 'DELETE',
    }), {
      loading: 'Deleting plan...',
      success: (res) => {
        if (res?.success) {
          revalidateTags(['plan']);
          return res?.message || 'Plan deleted successfully';
        }
        throw new Error(res?.message || 'Failed to delete plan');
      },
      error: (err) => err?.message || 'Failed to delete plan',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> Add New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans?.map((plan) => (
          <div key={plan._id} className="bg-[#16161e] border border-[#2a2a35] rounded-3xl p-5 flex flex-col gap-4 relative group hover:border-indigo-500/40 transition-all duration-300 shadow-xl overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-500" />

            {/* Delete Button */}
            <ConfirmModal
              trigger={
                <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10">
                  <Trash2 size={14} />
                </button>
              }
              title="Delete this plan?"
              description={`This will permanently delete "${plan.name}".`}
              confirmText="Yes, delete"
              onConfirm={() => handleDeletePlan(plan._id)}
            />

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
                {plan.features?.filter(f => f.status).map((f) => (
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

            {/* Footer Action */}
            <div className="pt-2">
              <button
                onClick={() => setEditingPlan(plan)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#1c1d27] border border-white/5 text-gray-400 text-xs font-black uppercase tracking-widest hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-300 transition-all"
              >
                <Edit2 size={13} /> Edit Membership
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPlan && (
        <PlanEditModal
          isOpen={!!editingPlan}
          onClose={() => setEditingPlan(null)}
          plan={editingPlan}
          features={features}
        />
      )}
    </div>
  );
}