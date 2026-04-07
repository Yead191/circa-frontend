"use client"
import { Ban, User, Calendar, Info, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { myFetch } from "../../../../../helpers/myFetch";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/getImageUrl";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface BlockRowProps {
  member: any;
  onUnblock: (id: string) => void;
  onViewDetails: (member: any) => void;
}

function Avatar({ src, name, size = 44 }: any) {
  return (
    <img
      src={getImageUrl(src) || "/user.png"}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover bg-[#1e1f35] shrink-0"
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
                <p className="text-indigo-400 text-sm font-medium">Blocked User</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a1a23] p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
                    <User size={12} /> Age
                  </div>
                  <div className="text-white font-semibold">{member.age} Years</div>
                </div>
                <div className="bg-[#1a1a23] p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
                    <Calendar size={12} /> Born
                  </div>
                  <div className="text-white font-semibold">
                    {new Date(member.date_of_birth).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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

function BlockRow({ member, onUnblock, onViewDetails }: BlockRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group">
      <div className="flex items-center gap-4">
        <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => onViewDetails(member)}>
          <Avatar src={member.image} name={member.name} size={48} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span
            className="text-white text-[15px] font-semibold block hover:text-indigo-400 cursor-pointer transition-colors"
            onClick={() => onViewDetails(member)}
          >
            {member.name}
          </span>
          <span className="text-gray-500 text-xs flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            {member.age} Years Old
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewDetails(member)}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          title="View Details"
        >
          <Info size={16} />
        </button>
        <button
          onClick={() => onUnblock(member._id)}
          className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
          title="Unblock"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export default function BlockList({ blockList }: { blockList: any[] }) {
  const [blocked, setBlocked] = useState<any[]>(blockList || []);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUnblock = (id: string) => {
    const userToUnblock = blocked.find((u) => u._id === id);

    toast.promise(
      myFetch(`/user/block`, {
        method: "POST",
        body: {
          user: id,
        },
      }),
      {
        loading: `Unblocking ${userToUnblock?.name || "user"}...`,
        success: (res) => {
          if (res?.success) {
            setBlocked((prev) => prev.filter((m) => m._id !== id));
            return res?.message || `Unblocked ${userToUnblock?.name || "user"}`;
          }
          throw new Error(res?.message || "Failed to unblock");
        },
        error: (err) => err?.message || "Failed to unblock",
      }
    );
  };

  if (blocked.length === 0) {
    return (
      <div className="bg-[#13141f] rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
            <Ban size={28} className="text-gray-600" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-white font-semibold">No blocked users</p>
            <p className="text-gray-500 text-sm max-w-[200px] mt-1 mx-auto">
              Users you block will appear here for management.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#13141f] rounded-2xl border border-white/5 px-5 py-2">
        {blocked?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <ShieldCheck size={22} className="text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-400">No blocked users</p>
            <p className="text-xs text-gray-600">People you block will appear here</p>
          </div>
        ) : (
          blocked?.map((m) => (
            <BlockRow
              key={m._id}
              member={m}
              onUnblock={handleUnblock}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </div>

      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={selectedUser}
      />
    </>
  );
}