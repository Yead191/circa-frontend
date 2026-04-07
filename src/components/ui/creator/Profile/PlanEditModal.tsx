'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Star, Info, Hash, Smile, Calendar, Check, CheckCircle2 } from 'lucide-react';
import { Plan, PlanFeature, PlanCategory } from '@/types';
import { myFetch } from '../../../../../helpers/myFetch';
import { revalidateTags } from '../../../../../helpers/revalidateTags';
import { toast } from 'sonner';

interface PlanEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: Plan;
    features: string[];
}

export default function PlanEditModal({ isOpen, onClose, plan, features }: PlanEditModalProps) {
    const [name, setName] = useState(plan.name || '');
    const [subtitle, setSubtitle] = useState(plan.subtitle || '');
    const [price, setPrice] = useState(plan.price || 0);
    const [category, setCategory] = useState<PlanCategory>(plan.category || 'Monthly');
    const [duration, setDuration] = useState(plan.duration || 1);
    const [emoji, setEmoji] = useState(plan.emoji || '🚀');
    const [formFeatures, setFormFeatures] = useState<Partial<PlanFeature>[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && plan) {
            setName(plan.name);
            setSubtitle(plan.subtitle);
            setPrice(plan.price);
            setCategory(plan.category);
            setDuration(plan.duration);
            setEmoji(plan.emoji);

            const initialFeatures = features.map(fName => {
                const existing = plan.features?.find(pf => pf.name === fName);
                return {
                    name: fName,
                    status: existing ? existing.status : false,
                    discount: existing ? existing.discount : 0
                };
            });
            setFormFeatures(initialFeatures);
        }
    }, [isOpen, plan, features]);

    if (!isOpen) return null;

    const toggleFeature = (name: string) => {
        setFormFeatures(prev => prev.map(f =>
            f.name === name ? { ...f, status: !f.status } : f
        ));
    };

    const updateDiscount = (name: string, discount: number) => {
        setFormFeatures(prev => prev.map(f =>
            f.name === name ? { ...f, discount: Math.max(0, Math.min(100, discount)) } : f
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            name,
            subtitle,
            price: Number(price),
            category,
            duration: Number(duration),
            emoji,
            features: formFeatures.map(f => ({
                name: f.name,
                status: f.status,
                discount: Number(f.discount)
            }))
        };

        toast.promise(myFetch(`/plan/${plan._id}`, {
            method: 'PATCH',
            body: payload,
        }), {
            loading: 'Updating membership plan...',
            success: (res) => {
                if (res?.success) {
                    revalidateTags(['plan']);
                    setTimeout(onClose, 1000);
                    return res?.message || 'Plan updated successfully';
                }
                throw new Error(res?.message || 'Failed to update plan');
            },
            error: (err) => err?.message || 'Failed to update plan',
            finally: () => setIsSubmitting(false)
        });
    };

    const inputClass = "w-full bg-[#1a1a24] border border-white/5 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-700";
    const labelClass = "flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1.5";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto selection:bg-indigo-500/30">
            <div className="bg-[#0d0d12] border border-[#2a2a35] w-full max-w-2xl rounded-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in duration-300">
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">

                    {/* Header */}
                    <div className="px-6 py-5 border-b border-[#2a2a35] flex items-center justify-between sticky top-0 bg-[#0d0d12] z-10 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <Star size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-white uppercase">Edit Plan</h2>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Configuration & Features</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2.5 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar flex-1">

                        {/* Basic Info Group */}
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className={labelClass}><Info size={11} className="text-indigo-400" /> Plan Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Premium Lover" className={inputClass} required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}><Smile size={11} className="text-indigo-400" /> Emoji Icon</label>
                                    <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🚀" className={inputClass} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className={labelClass}><Info size={11} className="text-indigo-400" /> Subtitle</label>
                                <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="e.g. Best for growing fans" className={inputClass} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label className={labelClass}><Hash size={11} className="text-indigo-400" /> Price ($)</label>
                                    <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="0.00" className={inputClass} required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}><Calendar size={11} className="text-indigo-400" /> Category</label>
                                    <select value={category} onChange={e => setCategory(e.target.value as PlanCategory)} className={inputClass + " appearance-none"}>
                                        <option value="Free">Free</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}><Calendar size={11} className="text-indigo-400" /> Duration (Mo)</label>
                                    <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} placeholder="1" className={inputClass} required />
                                </div>
                            </div>
                        </div>

                        {/* Features Group */}
                        <div className="space-y-4">
                            <label className={labelClass}><CheckCircle2 size={11} className="text-emerald-400" /> Plan Benefits & Features</label>
                            <div className="grid grid-cols-1 gap-3">
                                {formFeatures.map((f) => (
                                    <div
                                        key={f.name}
                                        className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${f.status
                                            ? 'bg-[#1a1a24] border-indigo-500/30'
                                            : 'bg-[#12121a] border-white/5 opacity-60'}`}
                                    >
                                        <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                                            <button
                                                type="button"
                                                onClick={() => toggleFeature(f.name!)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${f.status
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-[#2a2a35] text-gray-500'}`}
                                            >
                                                <Check size={20} strokeWidth={3} />
                                            </button>
                                            <div>
                                                <p className="text-sm font-bold text-white">{f.name}</p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{f.status ? 'Enabled' : 'Disabled'}</p>
                                            </div>
                                        </div>

                                        {f.status && (
                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                <div className="relative flex-1 sm:w-32">
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">% OFF</span>
                                                    <input
                                                        type="number"
                                                        value={f.discount}
                                                        onChange={e => updateDiscount(f.name!, Number(e.target.value))}
                                                        className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                                                        placeholder="Discount"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-5 border-t border-[#2a2a35] bg-[#0d0d12] shrink-0">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] ${isSubmitting
                                ? 'bg-[#1a1a24] text-gray-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Updating Plan...
                                </>
                            ) : (
                                <>
                                    <Save size={16} /> Save Changes
                                </>
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
}
