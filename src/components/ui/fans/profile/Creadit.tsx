"use client";
import { Gem, Heart, Star, Trophy, Play } from "lucide-react";
import { useState } from "react";

const CREDIT_PACKS = [
  { credits: 50, original: "$25.00", save: "50%", final: "$25.00", icon: <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />, iconBg: "bg-pink-400/10" },
  { credits: 100, original: "$25.00", save: "50%", final: "$75.00", icon: <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />, iconBg: "bg-yellow-500/10", popular: true },
  { credits: 250, original: "$25.00", save: "50%", final: "$25.00", icon: <Gem className="w-6 h-6 text-[#8b7cf8]" />, iconBg: "bg-[#8b7cf8]/10" },
  { credits: 500, original: "$25.00", save: "50%", final: "$25.00", icon: <Trophy className="w-6 h-6 text-orange-500" />, iconBg: "bg-orange-500/10" },
  { credits: 250, original: "$25.00", save: "50%", final: "$25.00", icon: <Gem className="w-6 h-6 text-[#8b7cf8]" />, iconBg: "bg-[#8b7cf8]/10" },
  { credits: 50, original: "$25.00", save: "50%", final: "$25.00", icon: <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />, iconBg: "bg-pink-400/10" },
];

export default function Credits() {
  const [selected, setSelected] = useState<number>(1);

  return (
    <div className="pb-24">

      {/* Header */}
      <div className="flex flex-wrap justify-between gap-2 mb-4">
        <span className="text-gray-400 text-lg">
          1 Credits = $0.50 USD
        </span>

        <div className="flex items-center gap-2 bg-[#1a1b2e] border border-yellow-500/30 rounded-full px-4 py-1.5">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-yellow-500 text-sm font-medium">
            120 Credits
          </span>
        </div>
      </div>

      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-[#1a1040] via-[#0d0820] to-[#1a0d30] min-h-[148px]">
        
        <div className="absolute -top-10 -right-10 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,#4c1d9530_0%,transparent_65%)]" />
        <div className="absolute bottom-[-30px] right-[50px] w-[140px] h-[140px] rounded-full bg-[radial-gradient(circle,#8b7cf825_0%,transparent_65%)]" />

        <div className="p-6">
          <div className="inline-flex bg-[#8b7cf8] text-white rounded-full px-4 py-1.5 text-sm mb-10">
            🔥 One Time Offer
          </div>

          <div className="text-white text-lg">First Purchase</div>

          <div className="text-yellow-500 font-semibold text-3xl mb-1">
            50% OFF
          </div>

          <div className="text-gray-400 text-sm">
            Grab your offer at any branch of your choice
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-white text-lg mb-4">
        Select a package
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
        {CREDIT_PACKS.map((pack, i) => {
          const isSelected = selected === i;

          return (
            <div key={i} className="relative">
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-extrabold px-3 py-1 rounded-full z-10">
                  Most Popular
                </div>
              )}

              <button
                onClick={() => setSelected(i)}
                className={`w-full bg-[#13141f] rounded-xl px-3 py-4 text-left border-2 transition ${
                  isSelected ? "border-yellow-500" : "border-transparent"
                }`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 flex items-center justify-center rounded-md mb-10 ${pack.iconBg}`}>
                  {pack.icon}
                </div>

                {/* Credits */}
                <div className={`text-2xl font-semibold mb-1 ${
                  isSelected ? "text-yellow-500" : "text-white"
                }`}>
                  {pack.credits}
                </div>

                <div className="text-gray-400 text-sm mb-2">
                  Credits
                </div>

                <div className="border-t border-white/10 mb-2" />

                {/* Prices */}
                <div className="text-gray-500 text-sm line-through">
                  {pack.original}
                </div>

                <div className={`text-lg mb-2 ${
                  isSelected ? "text-yellow-500" : "text-white"
                }`}>
                  {pack.final}
                </div>

                {/* Save */}
                <div className="inline-block bg-green-500/20 text-green-500 rounded-full px-4 py-1 text-xs">
                  Save {pack.save}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Watch Ads */}
      <div className="flex justify-between items-center bg-[#13141f] border border-white/10 rounded-xl px-4 py-5 mt-10 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#8b7cf8]/20 flex items-center justify-center">
            <Play className="text-blue-400 fill-blue-400" />
          </div>

          <div>
            <div className="text-white text-lg font-medium">
              Watch Ads & Earn Coins
            </div>
            <div className="text-gray-400 text-sm">
              Get 5 free coins instantly
            </div>
          </div>
        </div>

        <button className="border border-[#8b7cf8] text-[#8b7cf8] rounded-md px-4 py-1.5 text-sm font-medium hover:bg-[#8b7cf8]/10 transition">
          Watch Ad
        </button>
      </div>

      {/* CTA */}
      <button className="w-full bg-[#8b7cf8] rounded-xl py-4 text-white font-bold text-base hover:opacity-90 transition">
        Buy Coins
      </button>

      <div className="text-gray-400 text-xs text-center mt-2">
        Coins are universal across all creators
      </div>
    </div>
  );
}