'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    X, ShoppingBag, Image as ImageIcon, ChevronRight, Check,
    Link, DollarSign, Tag, FileText, Layers,
} from 'lucide-react';
import { Product } from '@/types';
import { getImageUrl } from '@/utils/getImageUrl';
import { myFetch } from '../../../../../../helpers/myFetch';
import { revalidateTags } from '../../../../../../helpers/revalidateTags';
import { toast } from 'sonner';

export interface ShopEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Product;
    onUpdate?: (updated: Product) => void;
}

const STYLE_OPTIONS = [
    { value: 'Physical', label: 'Physical', description: 'Shippable goods', icon: Layers },
    { value: 'Digital', label: 'Digital', description: 'Downloadeable items', icon: Link },
];

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', icon: Check },
    { value: 'delete', label: 'Inactive', icon: X },
];

// Reusing standard components for UI consistency
interface FieldProps {
    label: string;
    icon: React.FC<{ size?: number; className?: string }>;
    children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, icon: Icon, children }) => (
    <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
            <Icon size={11} className="text-emerald-500/70" />
            {label}
        </label>
        {children}
    </div>
);

const RadioOption = ({ label, description, icon: Icon, isSelected, onClick }: any) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${isSelected
            ? 'bg-[#1a1a24] border-emerald-500/60 shadow-[0_0_18px_rgba(16,185,129,0.12)]'
            : 'bg-[#16161e] border-[#2a2a35] hover:border-[#3a3a48]'
            }`}
    >
        <div className="flex items-center gap-3">
            {Icon && (
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#2a2a35] text-gray-400'}`}>
                    <Icon size={18} />
                </div>
            )}
            <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                {description && <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>}
            </div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-emerald-500' : 'border-[#3a3a45]'}`}>
            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
        </div>
    </div>
);


const ShopEditModal: React.FC<ShopEditModalProps> = ({
    isOpen,
    onClose,
    initialData,
}) => {
    // Current form state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('0');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'active' | 'delete'>('active');
    const [productStyle, setProductStyle] = useState<'Physical' | 'Digital'>('Physical');
    const [resourceLink, setResourceLink] = useState('');

    // Image state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (initialData && isOpen) {
            setName(initialData.name || '');
            setPrice(String(initialData.price || 0));
            setDescription(initialData.description || '');
            setStatus(initialData.status === 'inactive' ? 'delete' : 'active'); // Mapping based on user request
            setProductStyle(initialData.product_style || 'Physical');
            setResourceLink((initialData as any).resource_link || '');
            setImagePreview(getImageUrl(initialData.image) || null);
            setImageFile(null);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const isDirty =
        name !== initialData.name ||
        Number(price) !== initialData.price ||
        description !== initialData.description ||
        status !== (initialData.status === 'inactive' ? 'delete' : 'active') ||
        productStyle !== initialData.product_style ||
        resourceLink !== (initialData as any).resource_link ||
        imageFile !== null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('status', status);
        formData.append('product_style', productStyle);
        formData.append('resource_link', resourceLink);
        if (imageFile) formData.append('image', imageFile);

        try {
            toast.promise(myFetch(`/product/${initialData?._id}`, {
                method: 'PATCH',
                body: formData,
            }), {
                loading: 'Updating product...',
                success: (res) => {
                    // console.log(res)
                    if (res?.success) {
                        revalidateTags(['product', 'shops']);
                        setShowSuccess(true);
                        setTimeout(() => {
                            setShowSuccess(false);
                            onClose();
                        }, 1500);
                    }
                    return res?.message || 'Product updated successfully';
                },
                error: (err) => err?.message || 'Failed to update product',
            })

        } catch (error) {
            toast.error('An error occurred while updating the product');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#0d0d12] border border-[#2a2a35] w-full max-w-2xl rounded-4xl shadow-2xl flex flex-col max-h-[92vh]">
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">

                    {/* ── Header ── */}
                    <div className="px-6 py-5 border-b border-[#2a2a35] flex items-center justify-between sticky top-0 bg-[#0d0d12] z-10 rounded-t-4xl shrink-0">
                        <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                            Edit Product <ShoppingBag size={18} className="text-emerald-500" />
                            {isDirty && (
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                    Unsaved Changes
                                </span>
                            )}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* ── Scrollable Body ── */}
                    <div className="p-6 overflow-y-auto space-y-7 custom-scrollbar flex-1">

                        {/* Image Preview */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative group rounded-2xl overflow-hidden border border-[#2a2a35] aspect-video bg-[#1a1a24] cursor-pointer"
                        >
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity duration-300"
                                    alt="Product preview"
                                />
                            )}
                            {!imagePreview && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 group-hover:text-white transition-colors">
                                <ImageIcon size={28} className="mb-1.5" />
                                <p className="text-[11px] font-bold uppercase tracking-widest">Change Product Image</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        {/* Name & Price */}
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
                            <Field label="Product Name" icon={Tag}>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Enter product name..."
                                    className="w-full bg-[#16161e] border border-[#2a2a35] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all font-normal placeholder:text-gray-700"
                                />
                            </Field>
                            <Field label="Price (USD)" icon={DollarSign}>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/70 font-bold text-sm select-none">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-[#16161e] border border-[#2a2a35] rounded-xl py-3 pl-7 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 min-w-[120px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>
                            </Field>
                        </div>

                        {/* Description */}
                        <Field label="Description" icon={FileText}>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Write a detailed description for your product..."
                                className="w-full bg-[#16161e] border border-[#2a2a35] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all resize-none font-normal placeholder:text-gray-700"
                            />
                        </Field>

                        {/* Product Style */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                                Product Style
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {STYLE_OPTIONS.map(opt => (
                                    <RadioOption
                                        key={opt.value}
                                        label={opt.label}
                                        description={opt.description}
                                        icon={opt.icon}
                                        isSelected={productStyle === opt.value}
                                        onClick={() => setProductStyle(opt.value as any)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Resource Link */}
                        <Field label="Resource Link / Download URL" icon={Link}>
                            <div className="relative">
                                <Link size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/50 pointer-events-none" />
                                <input
                                    type="url"
                                    value={resourceLink}
                                    onChange={e => setResourceLink(e.target.value)}
                                    placeholder="https://your-resource-link.com"
                                    className="w-full bg-[#16161e] border border-[#2a2a35] rounded-xl py-3 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                                />
                            </div>
                        </Field>

                        {/* Status */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                                Product Status
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {STATUS_OPTIONS.map(opt => (
                                    <RadioOption
                                        key={opt.value}
                                        label={opt.label}
                                        icon={opt.icon}
                                        isSelected={status === opt.value}
                                        onClick={() => setStatus(opt.value as any)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="px-6 py-5 border-t border-[#2a2a35] bg-[#0d0d12] rounded-b-4xl shrink-0">
                        <button
                            type="submit"
                            disabled={isSubmitting || !isDirty}
                            className={`w-full relative font-bold py-3.5 rounded-full shadow-lg transition-all active:scale-[0.98] text-sm text-white ${showSuccess
                                ? 'bg-emerald-600 shadow-emerald-500/20'
                                : isDirty
                                    ? 'bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20'
                                    : 'bg-[#1a1a24] border border-[#2a2a35] text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Updating…
                                </span>
                            ) : showSuccess ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Check size={16} strokeWidth={3} /> Saved
                                </span>
                            ) : isDirty ? (
                                <span className="flex items-center justify-center gap-1.5">
                                    Update Item <ChevronRight size={16} />
                                </span>
                            ) : (
                                'No Changes'
                            )}
                        </button>
                    </div>

                </form>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e2a; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2a2a38; }
            `}</style>
        </div>
    );
};

export default ShopEditModal;