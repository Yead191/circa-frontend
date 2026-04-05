"use client";
import { useState } from "react";

const BLOCKED_USERS = [
  { id: 1, name: "Alex Johnson", handle: "@alexj", seed: "alex1" },
  { id: 2, name: "Maria Garcia", handle: "@mgarcia", seed: "maria1" },
  { id: 3, name: "James Smith", handle: "@jsmith", seed: "james1" },
];

export default function BlockList() {
  const [list, setList] = useState(BLOCKED_USERS);

  return (
    <div className="flex flex-col gap-2.5">
      {list.length === 0 && (
        <p className="text-gray-500 text-center py-10">
          No blocked users
        </p>
      )}

      {list.map((u) => (
        <div
          key={u.id}
          className="flex items-center justify-between bg-[#13141f] rounded-xl px-4 py-3 gap-3"
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${u?.seed ?? "robert"}`}
              alt=""
              className="w-10.5 h-10.5 rounded-full object-cover flex-shrink-0 bg-[#1a1b2e]"
            />

            <div>
              <div className="text-white font-semibold text-sm">
                {u.name}
              </div>
              <div className="text-gray-500 text-xs">
                {u.handle}
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={() =>
              setList((l) => l.filter((x) => x.id !== u.id))
            }
            className="bg-red-500/10 text-red-500 rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-red-500/20 transition"
          >
            Unblock
          </button>
        </div>
      ))}
    </div>
  );
}