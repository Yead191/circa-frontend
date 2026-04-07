"use client";

import { getImageUrl } from "@/utils/getImageUrl";
import { Ban, Flag, MoreVertical, User, Calendar, Mail, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { myFetch } from "../../../../../helpers/myFetch";
import { ReportModal } from "@/components/ui/ReportModal";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { revalidateTags } from "../../../../../helpers/revalidateTags";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

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
  onBlock: (id: string) => void;
  onReport: (member: Member) => void;
  onViewProfile: (member: Member) => void;
}

function Avatar({ src, name, size = 44 }: any) {
  return (
    <img
      src={getImageUrl(src) || "/user.png"}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover bg-[#1e1f35] shrink-0 border border-white/10 shadow-lg"
    />
  );
}

function UserDetailsModal({ isOpen, onClose, member }: { isOpen: boolean; onClose: () => void; member: any }) {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#121218] border-[#2a2a35] text-white sm:max-w-[450px] overflow-hidden p-0">
        <div className="relative">
          {/* Header/Cover background */}
          <div className="h-32 bg-linear-to-br from-indigo-600/20 to-purple-600/20 border-b border-white/5" />

          {/* Profile Area */}
          <div className="px-6 pb-6">
            <div className="relative -mt-16 mb-4 flex justify-center sm:justify-start">
              <div className="p-1 rounded-full bg-[#121218] border border-[#2a2a35]">
                <Avatar src={member.image} name={member.name} size={110} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                <p className="text-indigo-400 text-sm font-medium">Community Member</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a1a23] p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
                    <User size={12} /> Age
                  </div>
                  <div className="text-white font-semibold">{member.age || "N/A"} Years</div>
                </div>
                <div className="bg-[#1a1a23] p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
                    <Calendar size={12} /> Born
                  </div>
                  <div className="text-white font-semibold">
                    {member.date_of_birth ? formatDate(member.date_of_birth) : "N/A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-[#1a1a23] p-3 rounded-xl border border-white/5">
                  <p className="text-[9px] text-gray-600 mb-1 uppercase font-black tracking-widest leading-none">Subscribed Since</p>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar size={11} className="text-indigo-400" />
                    <span className="text-xs font-bold">{formatDate(member.start_date)}</span>
                  </div>
                </div>
                <div className="bg-[#1a1a23] p-3 rounded-xl border border-white/5">
                  <p className="text-[9px] text-gray-600 mb-1 uppercase font-black tracking-widest leading-none">Valid Until</p>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar size={11} className="text-emerald-400" />
                    <span className="text-xs font-bold">{formatDate(member.end_date)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a23] p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-2">
                  <Info size={12} /> About
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {member.short_bio || "No biography provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MemberRow({ member, onBlock, onReport, onViewProfile }: MemberRowProps) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "View Profile", icon: <User size={13} />, action: () => onViewProfile(member) },
    // { label: "Block User", icon: <Ban size={13} />, action: () => onBlock(member._id) },
    { label: "Report", icon: <Flag size={13} />, danger: true, action: () => onReport(member) },
  ];


  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group hover:bg-white/1 transition-all px-2 -mx-2 rounded-xl">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => onViewProfile(member)}>
          <Avatar src={member.image} name={member.name} size={48} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-white text-[13px] font-black uppercase tracking-tight truncate hover:text-indigo-400 cursor-pointer transition-colors"
              onClick={() => onViewProfile(member)}
            >
              {member.name}
            </span>
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

function ContextMenu({ items, onClose }: { items: any[]; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-10 z-50 bg-[#0d0d12] border border-[#2a2a35] rounded-2xl shadow-2xl py-2 min-w-[160px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        {items.map(({ label, icon, danger, action }: any) => (
          <button
            key={label}
            onClick={() => {
              action();
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-white/5 ${danger ? "text-red-400" : "text-gray-300"}`}
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
  console.log(memberList)
  const [selectedUser, setSelectedUser] = useState<Member | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleViewProfile = (member: Member) => {
    setSelectedUser(member);
    setIsDetailModalOpen(true);
  };

  const handleReport = (member: Member) => {
    setSelectedUser(member);
    setIsReportModalOpen(true);
  };

  const handleBlock = (id: string) => {
    const userToBlock = memberList.find((u) => u._id === id);

    toast.promise(
      myFetch(`/user/block`, {
        method: "POST",
        body: {
          user: id,
        },
      }),
      {
        loading: `Blocking ${userToBlock?.name || "user"}...`,
        success: (res) => {
          if (res?.success) {
            revalidateTags(['memberlist'])
            return res?.message || `Blocked ${userToBlock?.name || "user"}`;
          }
          throw new Error(res?.message || "Failed to block");
        },
        error: (err) => err?.message || "Failed to block",
      }
    );
  };

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
    <>
      <div className="space-y-1">
        <div className="bg-[#111118] border border-white/5 rounded-3xl p-4 shadow-2xl">
          <div className="divide-y divide-white/5">
            {memberList.map((m) => (
              <MemberRow
                key={m._id}
                member={m}
                onBlock={handleBlock}
                onReport={handleReport}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        </div>
      </div>

      <UserDetailsModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        member={selectedUser}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userId={selectedUser?._id || ""}
        userName={selectedUser?.name || ""}
      />
    </>
  );
}