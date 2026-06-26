'use client';

import VideoPlayer from "@/components/shared/VideoPlayer";
import { getImageUrl } from "@/utils/getImageUrl";

export default function PostCardVideo({ src }: { src: string }) {
  return (
    // Stop clicks from bubbling to the card's wrapping <Link> so interacting
    // with the player (play/seek/fullscreen) doesn't navigate to the post.
    <div
      className="relative w-full h-72 lg:h-96 overflow-hidden mb-5 rounded-lg bg-black"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <VideoPlayer src={getImageUrl(src) || ''} fill />
    </div>
  );
}
