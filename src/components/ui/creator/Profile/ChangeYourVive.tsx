import { VibeCategory } from "@/types";
import { useState } from "react";
import { getImageUrl } from "@/utils/getImageUrl";
import { myFetch } from "../../../../../helpers/myFetch";
import { toast } from "sonner";
import { revalidateTags } from "../../../../../helpers/revalidateTags";
import Image from "next/image";

const SOCIAL_TAGS = ["Friends", "Flirty", "Passionate"];

export default function ChangeYourVive({ categories, user }: { categories: VibeCategory[], user: any }) {
  // Initialize from user data
  const initialCategories = user?.categories?.map((c: any) => typeof c === 'string' ? c : c._id) || [];
  const initialSocialTags = user?.friends_and_flirty_category || [];
  const initialFlirting = user?.friends_and_flirty_mode || false;

  const [selected, setSelected] = useState<string[]>(initialCategories);
  const [flirting, setFlirting] = useState(initialFlirting);
  const [selectedSocialTags, setSelectedSocialTags] = useState<string[]>(initialSocialTags);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleSocialTag = (tag: string) => {
    setSelectedSocialTags((prev) => (prev.includes(tag) ? [] : [tag]));
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    if (flirting && selectedSocialTags.length === 0) {
      toast.error("Please select at least one social tag");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    // Append categories
    selected.forEach(id => formData.append('categories[]', id));

    // Append flirting mode
    formData.append('friends_and_flirty_mode', String(flirting));

    // Append social tags
    selectedSocialTags.forEach(tag => formData.append('friends_and_flirty_category[]', tag));

    toast.promise(myFetch('/user/profile', {
      method: 'PATCH',
      body: formData,
    }), {
      loading: 'Updating your vibe...',
      success: (res: any) => {
        if (res?.success) {
          revalidateTags(['user']);
          return res?.message || 'Vibe updated successfully';
        }
        throw new Error(res?.message || 'Failed to update vibe');
      },
      error: (err) => err?.message || 'Failed to update vibe',
      finally: () => setIsSubmitting(false)
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Categories Section */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Categories</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories?.map((cat) => {
            const active = selected.includes(cat._id);
            return (
              <button
                key={cat._id}
                onClick={() => toggleCategory(cat._id)}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 group
                  ${active
                    ? "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    : "bg-[#13141f] border-white/5 hover:border-white/10 hover:bg-[#1a1b2e]"
                  }`}
              >
                <div className={`relative w-24 h-24 transition-transform duration-500 ${active ? "scale-110" : "group-hover:scale-105"}`}>
                  <Image
                    src={getImageUrl(cat?.image)}
                    alt={cat.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className={`text-[13px] font-semibold transition-colors duration-300 uppercase tracking-wider
                  ${active ? "text-indigo-400" : "text-white/60 group-hover:text-white/80"}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Permission & Social Tags */}
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Privacy & Interactions</p>
          <div className="flex items-center justify-between px-6 py-5 rounded-2xl bg-[#13141f] border border-white/5 shadow-inner">
            <div className="space-y-1">
              <span className="text-[15px] font-semibold text-white/90 block">Enable Friends & Flirting Mode</span>
              <p className="text-xs text-gray-500">Allow users to connect with you for casual conversations</p>
            </div>
            <button
              onClick={() => {
                setFlirting((v: boolean) => !v);
                if (!flirting) setSelectedSocialTags([]); // Reset social tags if turning off
              }}
              style={{ width: 48, height: 26 }}
              className={`rounded-full relative transition-all duration-300 shrink-0 ${flirting ? "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]" : "bg-[#2a2b40]"}`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1.5 transition-all duration-300 shadow-lg ${flirting ? "left-[26px]" : "left-[6px]"}`}
              />
            </button>
          </div>
        </div>

        {/* Social Tags Selection - Only visible if flirting mode is enabled */}
        {flirting && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Social Categories</p>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_TAGS.map((tag) => {
                const isActive = selectedSocialTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleSocialTag(tag)}
                    className={`px-6 py-2.5 rounded-full border text-[13px] font-semibold transition-all duration-300
                        ${isActive
                        ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-transparent border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.98]
            ${isSubmitting
              ? 'bg-indigo-600/50 text-white/50 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40'}`}
        >
          {isSubmitting ? 'Saving Changes...' : 'Update Vibe Settings'}
        </button>
      </div>
    </div>
  );
}
