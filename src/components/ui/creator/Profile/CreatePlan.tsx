'use client';

import React, { useState, useEffect } from "react";
import { Plus, Star, Info, Hash, Smile, Calendar, Check, CheckCircle2, ChevronLeft } from "lucide-react";
import { PlanFeature, PlanCategory } from '@/types';
import { myFetch } from '../../../../../helpers/myFetch';
import { revalidateTags } from '../../../../../helpers/revalidateTags';
import { toast } from 'sonner';

export default function CreatePlan({ features }: { features: string[] }) {
    const [name, setName] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [price, setPrice] = useState<number | string>('');
    const [category, setCategory] = useState<PlanCategory>('Monthly');
    const [duration, setDuration] = useState<number | string>(1);
    const [emoji, setEmoji] = useState('🚀');
    const [formFeatures, setFormFeatures] = useState<Partial<PlanFeature>[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (features) {
            const initialFeatures = features.map(fName => ({
                name: fName,
                status: false,
                discount: 0
            }));
            setFormFeatures(initialFeatures);
        }
    }, [features]);

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

        const enabledFeatures = formFeatures.filter(f => f.status);
        if (enabledFeatures.length === 0) {
            toast.error("Please enable at least one feature for the plan");
            return;
        }

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

        toast.promise(myFetch('/plan', {
            method: 'POST',
            body: payload,
        }), {
            loading: 'Creating membership plan...',
            success: (res) => {
                if (res?.success) {
                    revalidateTags(['plan']);
                    // Reset form or navigate back
                    setName('');
                    setSubtitle('');
                    setPrice('');
                    setEmoji('🚀');
                    setFormFeatures(features.map(fName => ({ name: fName, status: false, discount: 0 })));
                    return res?.message || 'Plan created successfully';
                }
                throw new Error(res?.message || 'Failed to create plan');
            },
            error: (err) => err?.message || 'Failed to create plan',
            finally: () => setIsSubmitting(false)
        });
    };

    const inputClass = "w-full bg-[#1a1a24] border border-white/5 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-700";
    const labelClass = "flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1.5";

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header section moved to parent index.tsx header or handled here */}
            <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-white uppercase">Create New Plan</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Define your membership benefits & pricing</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Basic Info Card */}
                <div className="bg-[#111118] border border-white/5 rounded-4xl p-6 space-y-6 shadow-2xl">
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
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className={inputClass} required />
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
                            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="1" className={inputClass} required />
                        </div>
                    </div>
                </div>

                {/* Features Selection Card */}
                <div className="bg-[#111118] border border-white/5 rounded-4xl p-6 space-y-6 shadow-2xl">
                    <label className={labelClass}><CheckCircle2 size={11} className="text-emerald-400" /> Select Plan Benefits</label>
                    <div className="grid grid-cols-1 gap-3">
                        {formFeatures.map((f) => (
                            <div
                                key={f.name}
                                className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-3xl border transition-all duration-300 ${f.status
                                    ? 'bg-[#1a1a24] border-indigo-500/30 ring-1 ring-indigo-500/20'
                                    : 'bg-[#0d0d12] border-white/5 opacity-60 hover:opacity-100'}`}
                            >
                                <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                                    <button
                                        type="button"
                                        onClick={() => toggleFeature(f.name!)}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${f.status
                                            ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                                            : 'bg-[#1c1d27] text-gray-600'}`}
                                    >
                                        <Check size={24} strokeWidth={3} className={f.status ? "scale-100" : "scale-0"} />
                                    </button>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-tight">{f.name}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{f.status ? 'Feature Enabled' : 'Click to enable'}</p>
                                    </div>
                                </div>

                                {f.status && (
                                    <div className="flex items-center gap-3 w-full sm:w-auto animate-in fade-in slide-in-from-right-2 duration-300">
                                        <div className="relative flex-1 sm:w-36">
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">% Discount</span>
                                            <input
                                                type="number"
                                                value={f.discount}
                                                onChange={e => updateDiscount(f.name!, Number(e.target.value))}
                                                className="w-full bg-[#0d0d12] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Action */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-3 py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-[0.98] ${isSubmitting
                        ? 'bg-[#1a1a24] text-gray-600 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/40 hover:-translate-y-0.5'}`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Creating Plan...
                        </>
                    ) : (
                        <>
                            Create Membership Plan <Plus size={18} strokeWidth={3} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}