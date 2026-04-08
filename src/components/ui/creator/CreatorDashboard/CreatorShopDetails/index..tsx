'use client';
import {
  ArrowLeft,
  Calendar,
  Edit2,
  Gift,
  MoreHorizontal,
  Share2,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ShopEditModal from './ShopEditModal';
import { Product } from '@/types';
import { getImageUrl } from '@/utils/getImageUrl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { myFetch } from '../../../../../../helpers/myFetch';
import { revalidateTags } from '../../../../../../helpers/revalidateTags';
// import ShopEditModal from './ShopEditModal';


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
            Delete Product
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Are you sure you want to delete this product?
            <br />
            This action{' '}
            <span className="text-red-400 font-medium">cannot be undone</span>.
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
   Dropdown Menu
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
        Edit product
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
const CreatorShopDetails: React.FC<{ product: Product }> = ({ product }) => {

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
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    // console.log('Deleting product id:', product?._id);
    // await deleteProduct(product.id);
    toast.promise(myFetch(`/product/${product?._id}`, {
      method: 'DELETE',
    }), {
      loading: 'Deleting product...',
      success: (res) => {
        // console.log(res)
        if (res?.success) {
          revalidateTags(['product', 'shops']);
          router.back();
        }
        return res?.message || 'Product deleted successfully';
      },
      error: (err) => {
        console.log(err)
        return err?.message || 'Failed to delete product';
      },
    })
  };

  return (
    <div className="min-h-screen bg-cardBg text-white selection:bg-purple-500/30 font-sans">
      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        {/* ── Top bar ── */}
        <div className="flex justify-between mb-8">
          <button onClick={() => router.back()} className="cursor-pointer flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <div className="p-2 rounded-full group-hover:bg-white/5">
              <ArrowLeft size={20} />
            </div>
            <span className="font-semibold text-sm">Back to Shop</span>
          </button>

          <div className="flex gap-1 items-center">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
              <Share2 size={20} />
            </button>

            {/* ── Three-dot menu ── */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <MoreHorizontal size={20} />
              </button>

              <DropdownMenu
                isOpen={menuOpen}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </div>
          </div>
        </div>

        {/* ── Hero image ── */}
        <div className="relative rounded-[2.5rem] overflow-hidden mb-8 border border-white/5 shadow-2xl group">
          <Image
            width={500}
            height={500}
            src={getImageUrl(product.image)}
            alt="Product Preview"
            className="w-full aspect-4/5 sm:aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Floating Send Gift Button */}
          <button className="absolute top-6 right-6 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold shadow-xl transition-transform active:scale-95">
            <Gift size={14} className="text-pink-500" />
            Send Gift
          </button>
        </div>

        {/* ── Product info ── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight flex items-center gap-2">
                {product?.name}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
                <Calendar size={12} />
                Published: {new Date(product?.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })}
              </div>
            </div>
            <div className="text-gray-500 text-sm font-medium">
              {product?.total_sold} sold
            </div>
          </div>

          <div className="text-2xl font-semibold text-orange-500 py-1">
            ${product?.price}
          </div>

          <hr className="border-[#2a2a35]" />

          {/* Detailed description */}
          <div className="space-y-4 pt-2">
            <div className="text-gray-300 text-base leading-relaxed whitespace-pre-line opacity-90">
              {product?.description}
            </div>
          </div>
        </section>
      </main>

      {/* ── Delete confirmation modal ── */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* ── Edit modal (uncomment when ShopEditModal is ready) ── */}
      <ShopEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={product}
      />
    </div>
  );
};

export default CreatorShopDetails;