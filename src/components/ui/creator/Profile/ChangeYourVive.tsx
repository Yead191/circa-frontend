import { Cpu, Gamepad2, GraduationCap, Music, Palette, Video } from "lucide-react";
import { useState } from "react";


interface VibeCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const VIBE_CATEGORIES: VibeCategory[] = [
  { id: "music", label: "Music", icon: <Music size={22} /> },
  { id: "art", label: "Art", icon: <Palette size={22} /> },
  { id: "vlog", label: "Vlog", icon: <Video size={22} /> },
  { id: "gaming", label: "Gaming", icon: <Gamepad2 size={22} /> },
  { id: "technology", label: "Technology", icon: <Cpu size={22} /> },
  { id: "education", label: "Education", icon: <GraduationCap size={22} /> },
];


export default function ChangeYourVive() {
  const [selected, setSelected] = useState<string[]>([
    "music", "art", "vlog", "gaming", "technology", "education",
  ]);
  const [flirting, setFlirting] = useState(true);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-6">
      {/* Category grid */}
      <div className="grid grid-cols-4 2xl:grid-cols-6 gap-3">
        {VIBE_CATEGORIES.map((cat) => {
          const active = selected.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              className={`flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border transition-all duration-200 ${active
                ? "bg-[#1e1f35] border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                : "bg-[#13141f] border-white/5 hover:border-white/10"
                }`}
            >
              <span className={`transition-colors ${active ? "text-pink-400" : "text-gray-500"}`}>
                {cat.icon}
              </span>
              <span className="text-xs font-medium text-white/80">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Permission toggle */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Permission</p>
        <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#13141f] border border-white/5">
          <span className="text-sm text-white/80">Enable Friends &amp; Flirting Mode</span>
          <button
            onClick={() => setFlirting((v) => !v)}
            style={{ width: 44, height: 24 }}
            className={`rounded-full relative transition-all flex-shrink-0 ${flirting ? "bg-indigo-500" : "bg-[#2a2b40]"}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-[4px] transition-all shadow ${flirting ? "left-[24px]" : "left-[4px]"
                }`}
            />
          </button>
        </div>
      </div>

      {/* Save */}
      <button className="w-full py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold transition-colors">
        Save Changes
      </button>
    </div>
  );
}