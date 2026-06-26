'use client'
import React, { useEffect, useState } from 'react'
import { RiSearch2Line } from 'react-icons/ri';
import { myFetch } from '../../../../../../helpers/myFetch';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const CreatorFilter = ({ categories }: {
  categories?: {
    _id: string;
    name: string;
    image: string;
  }[]
}) => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelectCategory = (category: any) => {
    setActiveTab(category?._id); // ✅ Fix 2: Store _id, not the whole object
    const params = new URLSearchParams(searchParams.toString()); // ✅ Fix 3: Create params inside handler
    params.set("category", category?._id);
    router.push(`${pathname}?${params.toString()}`);
  };

  const removeCategory = () => {
    setActiveTab("All");
    const params = new URLSearchParams(searchParams.toString()); // ✅ Fix 3: Create params inside handler
    params.delete("category");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-3 overflow-x-hidden flex-col-reverse md:flex-row md:items-center justify-between mb-6">
      <div className="flex gap-3 overflow-x-scroll scrollbar-none">
        <button
          onClick={() => removeCategory()}
          className={`px-6 py-2 rounded-full text-[14px] font-medium transition-colors whitespace-nowrap outline-none ${activeTab === "All"
            ? "bg-[#9EA4F9] text-white"
            : "bg-[#1A1A1F] text-[#A1A1AA] border border-[#2A2A30] hover:bg-[#2A2A30] hover:text-white"
            }`}
        >
          All
        </button>
        {categories?.map((category: {
          _id: string;
          name: string;
          image: string;
        }, index: number) => (
          <button
            key={index}
            onClick={() => handleSelectCategory(category)}
            className={`px-6 py-2 rounded-full text-[14px] font-medium transition-colors whitespace-nowrap outline-none ${activeTab === category?._id
              ? "bg-[#9EA4F9] text-white"
              : "bg-[#1A1A1F] text-[#A1A1AA] border border-[#2A2A30] hover:bg-[#2A2A30] hover:text-white"
              }`}
          >
            {category?.name}
          </button>
        ))}
      </div>
      <div className="items-center gap-4 md:gap-6">
        <label className="relative flex items-center">
          <span className="absolute left-3 text-gray-400 text-xl">
            <RiSearch2Line />
          </span>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#15131A] border border-[#242424] rounded-full py-1 pl-10 pr-4 text-sm w-full lg:max-w-sm text-white focus:outline-none focus:border-primary transition-colors h-12 placeholder:text-[#AFAFAF]"
          />
        </label>
      </div>
    </div>
  );
};

export default CreatorFilter;