import { getImageUrl } from "@/utils/getImageUrl";
import { Ban, Flag, MoreVertical, User, Calendar, Mail } from "lucide-react";
import { useState } from "react";

interface Member {
  _id: string;
  name: string;
  email: string;
  image: string;
  date_of_birth?: string;
  age?: number;
  short_bio?: string;
  start_date: string;
  end_date: string;
}

interface MemberRowProps {
  member: Member;
}

interface ContextMenuItem {
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
}

function Avatar({ src, name, size = 44 }: any) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover bg-[#1e1f35] shrink-0 border border-white/10 shadow-lg"
    />
  );
}

function MemberRow({ member }: MemberRowProps) {
  const [open, setOpen] = useState(false);

  const menuItems: ContextMenuItem[] = [
    { label: "View Profile", icon: <User size={13} /> },
    { label: "Block User", icon: <Ban size={13} />, danger: false },
    { label: "Report", icon: <Flag size={13} />, danger: true },
  ];

  const formatDate = (dateStr: string) => {
      if (!dateStr) return "N/A";
      return new Date(dateStr).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
      });
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group hover:bg-white/[0.01] transition-all px-2 -mx-2 rounded-xl">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Avatar src={getImageUrl(member?.image)} name={member.name} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-white text-[13px] font-black uppercase tracking-tight truncate">{member.name}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Mail size={10} className="shrink-0" />
            <span className="text-[10px] font-bold truncate tracking-tight">{member.email}</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <div className="text-left w-32">
              <p className="text-[9px] text-gray-600 mb-1 leading-none">Subscribed Since</p>
              <div className="flex items-center gap-1.5 text-gray-400">
                  <Calendar size={11} className="text-indigo-400" />
                  {formatDate(member.start_date)}
              </div>
          </div>
          <div className="text-left w-32">
              <p className="text-[9px] text-gray-600 mb-1 leading-none">Valid Until</p>
              <div className="flex items-center gap-1.5 text-gray-400">
                  <Calendar size={11} className="text-emerald-400" />
                  {formatDate(member.end_date)}
              </div>
          </div>
      </div>

      <div className="relative shrink-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all"
        >
          <MoreVertical size={16} />
        </button>
        {open && <ContextMenu items={menuItems} onClose={() => setOpen(false)} />}
      </div>
    </div>
  );
}

function ContextMenu({ items, onClose }: any) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-10 z-50 bg-[#0d0d12] border border-[#2a2a35] rounded-2xl shadow-2xl py-2 min-w-[160px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        {items.map(({ label, icon, danger }: any) => (
          <button
            key={label}
            onClick={onClose}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-white/5 ${danger ? "text-red-400" : "text-gray-300"
              }`}
          >
            <span className={danger ? "text-red-400" : "text-indigo-400"}>{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

export default function MemberList({ memberList }: { memberList: Member[] }) {
  if (!memberList || memberList.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600 mb-4 border border-white/5">
                  <User size={28} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1">No members found</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">You don't have any active subscribers yet.</p>
          </div>
      );
  }

  return (
    <div className="space-y-1">
      <div className="bg-[#111118] border border-white/5 rounded-3xl p-4 shadow-2xl">
        <div className="divide-y divide-white/5">
            {memberList.map((m) => <MemberRow key={m._id} member={m} />)}
        </div>
      </div>
    </div>
  );
}