import { getImageUrl } from "@/utils/getImageUrl";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const SOCIAL_TAGS = ["Friends", "Flirty", "Passonate"];

interface VibeData {
  categories: string[];
  friends_and_flirty_mode: boolean;
  friends_and_flirty_category: string[];
}

const Vive = ({
  onVibeComplete,
  categories,
}: {
  onVibeComplete: (data: VibeData) => void;
  categories: any[];
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [friendsMode, setFriendsMode] = useState(false);
  const [selectedSocialTags, setSelectedSocialTags] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleSocialTag = (tag: string) => {
    setSelectedSocialTags((prev) => (prev.includes(tag) ? [] : [tag]));
  };

  const handleConfirm = () => {
    if (!selectedCategories?.length) {
      return toast.error("Select minimum one category");
    }
    if (friendsMode && !selectedSocialTags?.length) {
      return toast.error("Select friends one category");
    }

    onVibeComplete({
      categories: selectedCategories,
      friends_and_flirty_mode: friendsMode,
      friends_and_flirty_category: selectedSocialTags,
    });
  };

  return (
    <div className="fade-in" style={{ color: "#fff" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
        What's Your Vibe?
      </h1>
      <p style={{ color: "#8a8a9a", fontSize: 14, marginBottom: 24 }}>
        You can select multiple categories.
      </p>

      {/* Category grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => toggleCategory(cat._id)}
            style={{
              background: selectedCategories.includes(cat._id)
                ? "#2a2450"
                : "var(--inputBg)",
              border: `1.5px solid ${selectedCategories.includes(cat._id) ? "#7c6ef5" : "#2a2a36"}`,
              borderRadius: 16,
              padding: "20px 12px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              transition: "all 0.18s",
            }}
          >
            <Image
              src={getImageUrl(cat?.image)}
              alt={cat.name}
              width={150}
              height={150}
              className="h-[80px] w-fit object-contain"
            />
            <span
              style={{
                color: selectedCategories.includes(cat.id)
                  ? "#a89af5"
                  : "#d4d4e8",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Permission toggle */}
      <div
        style={{
          background: "#18181f",
          borderRadius: 14,
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <span style={{ color: "#c8c8d8", fontSize: 14 }}>
          Enable Friends &amp; Flirting Mode
        </span>
        <button
          onClick={() => {
            setFriendsMode((v) => !v);
            if (friendsMode) setSelectedSocialTags([]);
          }}
          style={{
            width: 48,
            height: 26,
            borderRadius: 999,
            background: friendsMode ? "#7c6ef5" : "#3a3a4a",
            border: "none",
            cursor: "pointer",
            position: "relative",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 3,
              left: friendsMode ? 25 : 3,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.2s",
            }}
          />
        </button>
      </div>

      {/* Social Tags — only visible when Friends & Flirting Mode is ON */}
      {friendsMode && (
        <div style={{ marginBottom: 14, animation: "fadeIn 0.25s ease" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
            Categories
          </h3>
          <p style={{ color: "#8a8a9a", fontSize: 13, marginBottom: 14 }}>
            For users who want to chat, flirt, and make new connections—casual,
            fun, and respectful
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {SOCIAL_TAGS.map((tag) => {
              const isActive = selectedSocialTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleSocialTag(tag)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: `1.5px solid ${isActive ? "#7c6ef5" : "#3a3a4a"}`,
                    background: isActive ? "#2a2450" : "transparent",
                    color: isActive ? "#a89af5" : "#c8c8d8",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={handleConfirm}
        style={{
          width: "100%",
          padding: "17px",
          borderRadius: 14,
          background: "linear-gradient(135deg, #9d86f5, #7155e8)",
          color: "#fff",
          fontWeight: 600,
          fontSize: 16,
          border: "none",
          cursor: "pointer",
          marginTop: 16,
          boxShadow: "0 6px 24px rgba(113,85,232,0.38)",
        }}
      >
        Confirm
      </button>
    </div>
  );
};

export default Vive;
