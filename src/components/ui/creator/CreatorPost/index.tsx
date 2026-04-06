'use client'

import { ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import UploadProductDialog from "./UploadProductForm";


// ─── Option Card ──────────────────────────────────────────────────────────────

function OptionCard({ icon: Icon, title, description, accent, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left bg-[#12131a] border border-white/8 rounded-2xl p-6 hover:border-white/16 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 overflow-hidden`}
    >
      {/* Glow */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${accent === "indigo" ? "bg-indigo-500" : "bg-purple-500"}`} />

      <div className="relative">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${accent === "indigo" ? "bg-indigo-500/15" : "bg-purple-500/15"}`}>
          <Icon size={22} className={accent === "indigo" ? "text-indigo-400" : "text-purple-400"} />
        </div>
        <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        <div className={`bg-primary cursor-pointer py-3 rounded-md text-center mt-4 flex items-center  justify-center gap-1 text-sm font-semibold ${accent === "indigo" ? "text-indigo-800" : "text-purple-800"}`}>
          Create <ChevronRight size={14} />
        </div>
      </div>
    </button>
  );
}

export default function CreatorPost() {
  const [postOpen, setPostOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-5 px-6 py-12 w-full md:w-3/5 mx-auto">
        <OptionCard
          icon={Sparkles}
          title="Create Post"
          description="Share content with your audience — photos, text, and exclusive posts for subscribers."
          accent="purple"
          onClick={() => setPostOpen(true)}
        />
        <OptionCard
          icon={ShoppingBag}
          title="Upload Product"
          description="Sell physical or digital items — merchandise, files, PDFs, presets, and more."
          accent="indigo"
          onClick={() => setProductOpen(true)}
        />
      </div>

      <CreatePostModal isOpen={postOpen} onClose={() => setPostOpen(false)} />
      <UploadProductDialog isOpen={productOpen} onClose={() => setProductOpen(false)} />


    </div>
  );
}



