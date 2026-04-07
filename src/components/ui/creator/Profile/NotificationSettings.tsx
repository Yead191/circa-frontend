import { useState } from "react";
import { User } from "@/types";
import { myFetch } from "../../../../../helpers/myFetch";
import { revalidateTags } from "../../../../../helpers/revalidateTags";
import { toast } from "sonner";
import { BellRing, MessageSquare, Phone, ShoppingBag, Gift, ShieldCheck } from "lucide-react";

function ToggleRow({ label, icon, value, onChange }: { label: string; icon: React.ReactNode; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-[#16161e] border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all group">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${value ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-500/10 text-gray-500'}`}>
          {icon}
        </div>
        <div>
          <span className="text-white text-[13px] font-bold uppercase tracking-tight">{label}</span>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-0.5">{value ? 'Enabled' : 'Disabled'}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative transition-all duration-300 ring-4 ring-transparent active:ring-indigo-500/20 ${value ? "bg-indigo-500 shadow-lg shadow-indigo-500/20" : "bg-[#2a2a35]"}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-md ${value ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

export default function NotificationSettings({ notification }: { notification: any }) {
  const [messages, setMessages] = useState(notification?.messages ?? true);
  const [calls, setCalls] = useState(notification?.calls ?? true);
  const [shop, setShop] = useState(notification?.shop ?? true);
  const [gift, setGift] = useState(notification?.gift ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    const payload = { messages, calls, shop, gift };

    toast.promise(myFetch('/user/update-notification', {
      method: "POST",
      body: payload
    }), {
      loading: "Saving notification settings...",
      success: (res) => {
        if (res?.success) {
          revalidateTags(['notification-settings']);
          return res?.message || "Settings updated successfully";
        }
        throw new Error(res?.message || "Failed to update settings");
      },
      error: (err) => err?.message || "Failed to update settings",
      finally: () => setIsSubmitting(false)
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2 px-1">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <BellRing size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight text-white uppercase">Notification Center</h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Manage your alerts and privacy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <ToggleRow icon={<MessageSquare size={18} />} label="Direct Messages" value={messages} onChange={setMessages} />
        <ToggleRow icon={<Phone size={18} />} label="Incoming Calls" value={calls} onChange={setCalls} />
        <ToggleRow icon={<ShoppingBag size={18} />} label="Shop Orders" value={shop} onChange={setShop} />
        <ToggleRow icon={<Gift size={18} />} label="Gifts & Tips" value={gift} onChange={setGift} />
      </div>

      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] ${isSubmitting
            ? 'bg-[#1a1a24] text-gray-600 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 hover:-translate-y-0.5'}`}
        >
          {isSubmitting ? "Updating..." : <><ShieldCheck size={16} /> Save Preferences</>}
        </button>
      </div>
    </div>
  );
}