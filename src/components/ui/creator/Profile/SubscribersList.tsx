import { Filter, MoreVertical, Search, Trash2, User } from "lucide-react";
import { useState } from "react";



const SUBSCRIBERS = [
  { name: "Thomas Black", handle: "@thomas_b", plan: "Lover", planColor: "text-red-400", avatar: "thomas" },
  { name: "Gianna Kovas", handle: "@giannak", plan: "Free", planColor: "text-yellow-300", avatar: "gianna" },
  { name: "Juneth Lin", handle: "@juneth_lin", plan: "Hobby", planColor: "text-indigo-400", avatar: "juneth" },
  { name: "Alicia McCoy", handle: "@aliciamcc", plan: "Lover", planColor: "text-red-400", avatar: "alicia" },
  { name: "Gael Thermaly", handle: "@gaelt", plan: "Free", planColor: "text-yellow-300", avatar: "gael" },
  { name: "Ruthlyn Murphy", handle: "@ruthlynm", plan: "Hobby", planColor: "text-indigo-400", avatar: "ruthlyn" },
  { name: "Annette Black", handle: "@annetteb", plan: "Lover", planColor: "text-red-400", avatar: "annette" },
  { name: "Grant Cooper", handle: "@grantcoop", plan: "Free", planColor: "text-yellow-300", avatar: "grant" },
];

export default function SubscribersList({ onViewUser }: { onViewUser: (name: string) => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState(SUBSCRIBERS);

  const filtered = subscribers.filter((s: any) =>
    (filter === "All" || s.plan === filter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.handle.includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search subscribers..."
            className="w-full bg-[#1a1b2e] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-400/40 border-0"
          />
        </div>
        <div className="relative">
          <select
            value={filter} onChange={e => setFilter(e.target.value)}
            className="bg-[#1a1b2e] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none appearance-none cursor-pointer border-0 pr-7"
          >
            {["All", "Lover", "Free", "Hobby"].map(o => <option key={o} value={o} className="bg-[#1a1b2e]">{o}</option>)}
          </select>
          <Filter size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: subscribers.length, color: "text-white" },
          { label: "Paid", value: subscribers.filter((s: any) => s.plan !== "Free").length, color: "text-indigo-400" },
          { label: "Free", value: subscribers.filter((s: any) => s.plan === "Free").length, color: "text-yellow-300" },
        ].map(stat => (
          <div key={stat.label} className="bg-[#1a1b2e] rounded-xl p-3 text-center">
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-500 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="space-y-1.5">
        {filtered.map((sub: any, i: any) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[#1a1b2e] rounded-xl hover:bg-[#1f2040] transition-colors group">
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${sub.avatar}`}
              className="w-9 h-9 rounded-full bg-[#0d0e16] shrink-0 cursor-pointer"
              onClick={() => onViewUser(sub.name)}
              alt=""
            />
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onViewUser(sub.name)}>
              <div className="flex items-center gap-1.5">
                <p className="text-white text-sm font-medium truncate">{sub.name}</p>
                <span className={`text-[10px] font-semibold ${sub.planColor}`}>{sub.plan}</span>
              </div>
              <p className="text-gray-500 text-xs">{sub.handle}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onViewUser(sub.name)}
                className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/25 transition-colors"
              >
                <User size={12} />
              </button>
              <button
                onClick={() => setDeleteTarget(sub.name)}
                className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <button className="text-gray-600 hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100">
              <MoreVertical size={14} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-600">
            <User size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No subscribers found</p>
          </div>
        )}
      </div>
    </div>
  );
}