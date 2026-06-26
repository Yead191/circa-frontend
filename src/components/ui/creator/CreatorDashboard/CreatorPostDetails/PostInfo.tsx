'use client';

import {
  ArrowLeft,
  Edit2,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import PostEditModal from './PostEditModal';
import { useRouter } from 'next/navigation';
import { Post } from '@/types';
import { getImageUrl } from '@/utils/getImageUrl';
import VideoPlayer from '@/components/shared/VideoPlayer';
import { myFetch } from '../../../../../../helpers/myFetch';
import { toast } from 'sonner';
import { revalidateTags } from '../../../../../../helpers/revalidateTags';
// import PostEditModal, { DEFAULT_POST_DATA } from './PostEditModal';


/* ─────────────────────────────────────────
   Delete Confirmation Modal
───────────────────────────────────────── */
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onCancel}
    >
      {/* Blurred dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        className="relative z-10 w-full sm:max-w-sm mx-4 mb-6 sm:mb-0 bg-[#16171f] border border-white/10 rounded-3xl shadow-2xl p-7 flex flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Trash2 size={24} className="text-red-400" />
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Delete Post
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Are you sure you want to delete this post?
            <br />
            This action <span className="text-red-400 font-medium">cannot be undone</span>.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full mt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-white/10 bg-white/5 text-gray-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-semibold transition-all shadow-lg shadow-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Dropdown Menu (replaces raw <div>)
───────────────────────────────────────── */
interface DropdownMenuProps {
  isOpen: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onEdit,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-9 z-20 w-40 bg-[#1c1d27] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1">
      <button
        onClick={onEdit}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
      >
        <Edit2 size={14} className="text-purple-400" />
        Edit post
      </button>

      {/* Divider */}
      <div className="mx-3 my-1 border-t border-white/5" />

      <button
        onClick={onDelete}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
const PostInfo = ({ post }: { post: Post }) => {

  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleEditClick = () => {
    setMenuOpen(false);
    setIsEditModalOpen(true);
    // console.log('Edit clicked');
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    // console.log('Deleting post id:', post._id);
    toast.promise(myFetch(`/post/${post._id}`, {
      method: 'DELETE',
    }), {
      loading: 'Deleting post...',
      success: (res) => {
        // console.log(res)
        if (res?.success) {
          revalidateTags(['post', 'posts']);
          router.back();
        }
        return res?.message || 'Post deleted successfully';
      },
      error: (err) => {
        console.log(err)
        return err?.message || 'Failed to delete post';
      },
    })
    // await deletePost(post._id);
  };

  const handleLike = async () => {
    if (!post._id) return;

    const res = await myFetch(`/post/like/${post._id}`, {
      method: "POST",
      body: {
        type: "post"
      }
    })

    if (res?.success) {
      revalidateTags(["post"])
    } else {
      toast.error("Failed to like post");
    }

    // console.log('Liking post id:', res);
    // Hit API logic here
  };

  const scrollToComments = () => {
    const element = document.getElementById('comments-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Focus the input if it exists
      const input = element.querySelector('input');
      if (input) input.focus();
    }
  };

  /* Carousel setup — images first, then the video as the last slide */
  const imageCount = post?.images?.length || 0;
  const mediaCount = imageCount + (post?.video ? 1 : 0);
  const videoSlideIndex = post?.video ? imageCount : -1;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div>
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-8">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
          <div onClick={() => router.back()} className="p-2 rounded-full group-hover:bg-white/5 cursor-pointer">
            <ArrowLeft size={20} />
          </div>
          <span className="font-semibold text-sm">Back</span>
        </button>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
          <Share2 size={20} />
        </button>
      </div>

      {/* ── Author row ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={getImageUrl(post?.user?.image) || '/default-avatar.png'}
              alt={post?.user?.name || "User"}
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/20"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d0d12]" />
          </div>
          <div>
            <h3 className="font-normal text-white leading-tight">
              {post?.user?.name}
            </h3>
            <p className="text-gray-500 text-xs">{post?.timeAgo}</p>
          </div>
        </div>

        {/* ── Three-dot menu with dropdown ── */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>

          <DropdownMenu
            isOpen={menuOpen}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* ── Main media carousel (images first, then video) ── */}
      {mediaCount > 0 ? (
        <div className="relative group mb-6">
          <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-[#1a1a24] embla" ref={emblaRef}>
            <div className="embla__container flex">
              {post?.images?.map((img, idx) => (
                <div key={`img-${idx}`} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                  <img
                    src={getImageUrl(img) || '/placeholder-image.png'}
                    alt={`${post.title} - ${idx + 1}`}
                    className="w-full aspect-4/5 sm:aspect-square object-cover h-125 sm:h-150"
                  />
                </div>
              ))}

              {post?.video && (
                <div key="video" className="embla__slide flex-[0_0_100%] min-w-0 relative h-125 sm:h-150 bg-black">
                  <VideoPlayer
                    src={getImageUrl(post.video) || ''}
                    fill
                    active={selectedIndex === videoSlideIndex}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Carousel Indicators */}
          {mediaCount > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {Array.from({ length: mediaCount }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all ${idx === selectedIndex ? 'bg-purple-500 w-6' : 'bg-white/20 w-2'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── Empty media state ── */
        <div className="mb-6 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-[#1a1a24] h-100 flex items-center justify-center text-gray-500">
          No media available
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleLike}
          className="cursor-pointer flex items-center gap-2.5 bg-[#1a1a24] border border-[#2a2a35] px-6 py-3 rounded-full hover:border-purple-500/50 transition-all group active:scale-95"
        >
          <Heart
            size={18}
            className={`text-purple-400 group-hover:scale-110 transition-transform ${post?.isLike ? "fill-purple-400" : ""}`}
          />
          <span className="text-purple-400 font-bold text-sm">
            {post?.like_count || 0}
          </span>
        </button>
        <button
          onClick={scrollToComments}
          className="cursor-pointer flex items-center gap-2.5 bg-[#1a1a24] border border-[#2a2a35] px-6 py-3 rounded-full hover:border-purple-500/50 transition-all group active:scale-95"
        >
          <MessageCircle
            size={18}
            className="text-purple-400 group-hover:scale-110 transition-transform"
          />
          <span className="text-purple-400 font-bold text-sm">
            {post?.comment_count || 0}
          </span>
        </button>
      </div>

      {/* ── Post content ── */}
      <article className="space-y-4 mb-10">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight leading-tight">
          {post?.title}{' '}
        </h1>
        <div className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-line opacity-90">
          {post?.description}
        </div>
      </article>

      {/* ── Delete confirmation modal ── */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* ── Edit modal (uncomment when PostEditModal is ready) ── */}
      <PostEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
      />
    </div>
  );
};

export default PostInfo;