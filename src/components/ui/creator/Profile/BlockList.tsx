import { Ban, Gem, Heart, Star } from "lucide-react";
import { useState } from "react";

interface BlockRowProps {
  member: any;
  onUnblock: (id: number) => void;
}

const MEMBERS: any[] = [
  { id: 1, name: "Theresa Webb", handle: "@criss001", tier: "Sweety", tierColor: "#e879a0", tierIcon: <Heart size={10} />, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=theresa" },
  { id: 2, name: "Dianne Russell", handle: "@criss001", tier: "Diamond", tierColor: "#a78bfa", tierIcon: <Gem size={10} />, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=dianne" },
  { id: 3, name: "Robert Fox", handle: "@criss001", tier: "Free", tierColor: "#6b7280", tierIcon: <Star size={10} />, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=robert" },
  { id: 4, name: "Arlene McCoy", handle: "@criss001", tier: "Sweety", tierColor: "#e879a0", tierIcon: <Heart size={10} />, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=arlene" },
  { id: 5, name: "Courtney Henry", handle: "@criss001", tier: "Sweety", tierColor: "#e879a0", tierIcon: <Heart size={10} />, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=courtney" },
  { id: 6, name: "Kathryn Murphy", handle: "@criss001", tier: "Diamond", tierColor: "#a78bfa", tierIcon: <Gem size={10} />, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=kathryn" },
  { id: 7, name: "Annette Black", handle: "@criss001", tier: "Diamond", tierColor: "#a78bfa", tierIcon: <Gem size={10} />, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=annette" },
  { id: 8, name: "Jane Cooper", handle: "@criss001", tier: "Sweety", tierColor: "#e879a0", tierIcon: <Heart size={10} />, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=jane" },
];

function Avatar({ src, name, size = 44 }: any) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover bg-[#1e1f35] flex-shrink-0"
    />
  );
}

function BlockRow({ member, onUnblock }: BlockRowProps) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <Avatar src={member.avatar} name={member.name} size={44} />
        <div>
          <span className="text-white text-sm font-semibold block">{member.name}</span>
          <span className="text-gray-500 text-xs">{member.handle}</span>
        </div>
      </div>

      <button
        onClick={() => onUnblock(member.id)}
        className="text-gray-600 hover:text-red-400 transition-colors p-1"
        title="Unblock"
      >
        <Ban size={17} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default function BlockList({ blockList }: { blockList: any[] }) {
  console.log(blockList)
  const [blocked, setBlocked] = useState<any[]>(MEMBERS.slice(0, 7));

  const unblock = (id: number) => setBlocked((b) => b.filter((m) => m.id !== id));

  if (blocked.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <Ban size={36} className="text-gray-600" strokeWidth={1.2} />
        <p className="text-gray-500 text-sm">No blocked users</p>
      </div>
    );
  }

  return (
    <div className="bg-[#13141f] rounded-2xl border border-white/5 px-4">
      {blocked.map((m) => <BlockRow key={m.id} member={m} onUnblock={unblock} />)}
    </div>
  );
}