'use client'
import { useState } from "react";
import PostCard from "./PostCard";
import ShopCard from "./ShopCard";
import { Post, Product } from "@/types";


const TabBarWithContent = ({ posts, shops }: { posts: Post[], shops: Product[] }) => {
  const [activeTab, setActiveTab] = useState('Post');

  return (
    <div className="">


      <div className="flex border-b border-gray-800 mb-6">
        {['Post', 'Shop'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full py-3 font-semibold transition-all relative ${activeTab === tab
              ? 'text-primary'
              : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {
        activeTab === 'Post' ? (
          <div className="space-y-2 pb-20">
            {posts?.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>) : (
          <div className="space-2 pb-20 grid grid-cols-1 md:grid-cols-2  gap-2">
            {shops?.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        )
      }
    </div>
  );
};

export default TabBarWithContent;