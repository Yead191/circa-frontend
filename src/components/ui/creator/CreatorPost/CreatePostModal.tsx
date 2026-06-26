'use client';

import React, { useState, useRef } from 'react';
import {
    X, Globe, Star, Image as ImageIcon, Palette, ChevronRight, Check, Lock, EyeOff, Calendar, Clock, Plus, Trash2, Video as VideoIcon, Film
} from 'lucide-react';
import { getImageUrl } from '@/utils/getImageUrl';
import { myFetch } from '../../../../../helpers/myFetch';
import { uploadVideoChunk } from '../../../../../helpers/uploadVideoChunk';
import { revalidateTags } from '../../../../../helpers/revalidateTags';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VISIBILITY_OPTIONS = [
    { value: 'Everyone', label: 'Everyone', description: 'Public to all users', icon: Globe },
    { value: 'Subscriber only', label: 'Subscriber only', description: 'Only paying subscribers', icon: Star },
    { value: 'Gold tiers', label: 'Gold tiers', description: 'Exclusive to gold members', icon: Star },
];

const ENGAGEMENT_OPTIONS = [
    { value: 'Only me', label: 'Only me', icon: Lock },
    { value: 'Hide likes', label: 'Hide likes', icon: EyeOff },
    { value: 'Hide comments', label: 'Hide comments', icon: EyeOff },
];

interface OptionProps {
    label: string;
    description?: string;
    icon?: React.FC<{ size?: number }>;
    isSelected: boolean;
    onClick: () => void;
    isCheckbox?: boolean;
}

const SelectOption: React.FC<OptionProps> = ({ label, description, icon: Icon, isSelected, onClick, isCheckbox }) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${isSelected
            ? 'bg-[#1a1a24] border-purple-500/60 shadow-[0_0_18px_rgba(168,85,247,0.12)]'
            : 'bg-[#16161e] border-[#2a2a35] hover:border-[#3a3a48]'
            }`}
    >
        <div className="flex items-center gap-3">
            {Icon && (
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? 'bg-purple-500/20 text-purple-400' : 'bg-[#2a2a35] text-gray-400'
                    }`}>
                    <Icon size={18} />
                </div>
            )}
            <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                {description && <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>}
            </div>
        </div>
        <div className={`w-5 h-5 transition-all flex items-center justify-center ${isCheckbox ? 'rounded-md border-2' : 'rounded-full border-2'} ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-[#3a3a45]'
            }`}>
            {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
        </div>
    </div>
);

interface ImageItem {
    id: string;
    url: string;
    file?: File;
}

interface VideoItem {
    url: string; // local blob preview url
    file: File;
}

// 5 MB per chunk
const CHUNK_SIZE = 5 * 1024 * 1024;

// Convert a 24h "HH:MM" value + meridiem into a "hh:mm AM/PM" string.
const formatTimeWithMeridiem = (time24: string, meridiem: 'AM' | 'PM') => {
    if (!time24) return '';
    const [h, m] = time24.split(':').map(Number);
    let hour12 = h % 12;
    if (hour12 === 0) hour12 = 12;
    return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${meridiem}`;
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({
    isOpen,
    onClose,
}) => {
    const router = useRouter()
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [whoCanSee, setWhoCanSee] = useState('Everyone');
    const [postVisibility, setPostVisibility] = useState<string[]>([]);
    const [is18Plus, setIs18Plus] = useState(false);

    // Multi-image management
    const [images, setImages] = useState<ImageItem[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Video management
    const [video, setVideo] = useState<VideoItem | null>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);

    // Scheduling
    const [schedulePost, setSchedulePost] = useState(false);
    const [scduleDate, setScduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [meridiem, setMeridiem] = useState<'AM' | 'PM'>('AM');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!isOpen) return null;

    const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImages = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            url: URL.createObjectURL(file),
            file: file,
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (id: string) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const handleAddVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // revoke previous preview to avoid memory leaks
        if (video?.url) URL.revokeObjectURL(video.url);
        setVideo({ url: URL.createObjectURL(file), file });
        // allow re-selecting the same file again later
        e.target.value = '';
    };

    const removeVideo = () => {
        if (video?.url) URL.revokeObjectURL(video.url);
        setVideo(null);
        setVideoProgress(0);
    };

    // Uploads a video in sequential chunks and resolves with the stored url.
    const uploadVideoInChunks = async (file: File): Promise<string> => {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const safeName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${file.name.replace(/\s+/g, '_')}`;
        let videoUrl = '';

        for (let index = 0; index < totalChunks; index++) {
            const start = index * CHUNK_SIZE;
            const chunk = file.slice(start, start + CHUNK_SIZE);

            const chunkForm = new FormData();
            chunkForm.append('chunk', chunk, safeName);
            chunkForm.append('originalname', safeName);
            chunkForm.append('chunkIndex', String(index));
            chunkForm.append('totalChunks', String(totalChunks));

            const result = await uploadVideoChunk(chunkForm);
            setVideoProgress(Math.round(((index + 1) / totalChunks) * 100));

            if (result.done && result.url) {
                videoUrl = result.url;
            }
        }

        if (!videoUrl) {
            throw new Error('Video upload did not complete');
        }
        return videoUrl;
    };

    // Keep the 24h time value and the AM/PM selection in sync.
    const handleTimeChange = (value: string) => {
        setScheduleTime(value);
        if (value) {
            setMeridiem(Number(value.split(':')[0]) >= 12 ? 'PM' : 'AM');
        }
    };

    const handleMeridiemChange = (target: 'AM' | 'PM') => {
        if (target === meridiem) return;
        setMeridiem(target);
        if (scheduleTime) {
            const [h0, m] = scheduleTime.split(':').map(Number);
            let h = h0;
            if (target === 'PM' && h < 12) h += 12;
            if (target === 'AM' && h >= 12) h -= 12;
            setScheduleTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
    };

    const toggleEngagement = (val: string) => {
        setPostVisibility(prev =>
            prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]
        );
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setWhoCanSee('Everyone');
        setPostVisibility([]);
        setIs18Plus(false);
        setImages([]);
        if (video?.url) URL.revokeObjectURL(video.url);
        setVideo(null);
        setVideoProgress(0);
        setSchedulePost(false);
        setScduleDate('');
        setScheduleTime('');
        setMeridiem('AM');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1) If a video is attached, upload it in chunks first and get its url.
            let videoUrl = '';
            if (video?.file) {
                setIsUploadingVideo(true);
                try {
                    videoUrl = await toast.promise(uploadVideoInChunks(video.file), {
                        loading: 'Uploading video…',
                        success: 'Video uploaded',
                        error: 'Video upload failed',
                    }).unwrap();
                } finally {
                    setIsUploadingVideo(false);
                }
            }

            // 2) Build the post payload.
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('who_can_see', whoCanSee);
            postVisibility.forEach(v => formData.append('post_visibility[]', v));
            formData.append('is_18_plus', String(is18Plus));
            formData.append('schedule_post', String(schedulePost));
            if (schedulePost) {
                formData.append('scdule_date', scduleDate);
                formData.append('schedule_time', formatTimeWithMeridiem(scheduleTime, meridiem));
            }

            // Handle Images
            images.forEach(img => {
                if (img.file) {
                    formData.append('image', img.file);
                }
            });

            // Attach the uploaded video url (string), not the file.
            if (videoUrl) {
                formData.append('video', videoUrl);
            }

            toast.promise(myFetch('/post', {
                method: 'POST',
                body: formData,
            }), {
                loading: 'Creating post...',
                success: (res) => {
                    // console.log(res)
                    if (res?.success) {
                        revalidateTags(['post', 'posts']);
                        setShowSuccess(true);
                        setTimeout(() => {
                            setShowSuccess(false);
                            resetForm();
                            router.push(`/post/${res?.data?._id}`)
                            onClose();
                        }, 1500);
                    } else {
                        toast.error(res?.message || 'Failed to create post');
                    }
                    return res?.message || 'Post created successfully';
                },
                error: (error) => {
                    toast.error(error?.message || 'Failed to create post');
                    return error?.message || 'Failed to create post';
                },
            });


        } catch (error) {
            // Video-upload failures already surface their own toast above.
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto selection:bg-purple-500/30">
            <div className="bg-[#0d0d12] border border-[#2a2a35] w-full max-w-2xl rounded-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">

                    {/* ── Header ── */}
                    <div className="px-6 py-5 border-b border-[#2a2a35] flex items-center justify-between sticky top-0 bg-[#0d0d12] z-10 shrink-0">
                        <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                            Create New Post <Palette size={18} className="text-purple-500" />
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
                    <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar flex-1">

                        {/* Multi-Image Management */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Images Gallery</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {images.map((img) => (
                                    <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-[#2a2a35] bg-[#1a1a24]">
                                        <img src={getImageUrl(img.url) || '/placeholder-image.png'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Post" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => removeImage(img.id)}
                                                className="p-2.5 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-[#2a2a35] hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex flex-col items-center justify-center gap-2 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#1a1a24] border border-[#2a2a35] flex items-center justify-center text-gray-400 group-hover:text-purple-400 group-hover:scale-110 transition-all">
                                        <Plus size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Add Image</span>
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleAddImages} className="hidden" accept=".png, .jpg, .jpeg, image/png, image/jpeg"
                                    multiple />
                            </div>
                        </div>

                        {/* Video Upload */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Video</label>

                            {video ? (
                                <div className="relative group rounded-2xl overflow-hidden border border-[#2a2a35] bg-[#1a1a24]">
                                    <video
                                        src={video.url}
                                        controls
                                        className="w-full max-h-72 bg-black object-contain"
                                    />

                                    {/* Upload progress overlay */}
                                    {isUploadingVideo && (
                                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
                                            <Film size={26} className="text-purple-400 animate-pulse" />
                                            <div className="w-2/3 h-1.5 rounded-full bg-[#2a2a35] overflow-hidden">
                                                <div
                                                    className="h-full bg-linear-to-r from-purple-500 to-indigo-500 transition-all duration-200"
                                                    style={{ width: `${videoProgress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-white">Uploading… {videoProgress}%</span>
                                        </div>
                                    )}

                                    {!isUploadingVideo && (
                                        <button
                                            type="button"
                                            onClick={removeVideo}
                                            className="absolute top-3 right-3 p-2.5 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => videoInputRef.current?.click()}
                                    className="w-full rounded-2xl border-2 border-dashed border-[#2a2a35] hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex flex-col items-center justify-center gap-2 py-8 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#1a1a24] border border-[#2a2a35] flex items-center justify-center text-gray-400 group-hover:text-purple-400 group-hover:scale-110 transition-all">
                                        <VideoIcon size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Add Video</span>
                                    <span className="text-[10px] text-gray-600">Uploaded in chunks · MP4, MOV, WebM</span>
                                </button>
                            )}
                            <input type="file" ref={videoInputRef} onChange={handleAddVideo} className="hidden" accept="video/*" />
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Give your post a title..."
                                    className="w-full bg-[#16161e] border border-[#2a2a35] rounded-xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all font-normal placeholder:text-gray-700"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Write something about your post..."
                                    className="w-full bg-[#16161e] border border-[#2a2a35] rounded-xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all resize-none font-normal placeholder:text-gray-700"
                                />
                            </div>
                        </div>

                        {/* Who can see (Radio) */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Who can see this?</label>
                            <div className="grid grid-cols-1 gap-2">
                                {VISIBILITY_OPTIONS.map(opt => (
                                    <SelectOption
                                        key={opt.value}
                                        label={opt.label}
                                        description={opt.description}
                                        icon={opt.icon}
                                        isSelected={whoCanSee === opt.value}
                                        onClick={() => setWhoCanSee(opt.value)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Engagement Multi-select (Checkboxes) */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Post Engagement Settings</label>
                            <div className="grid grid-cols-1 gap-2">
                                {ENGAGEMENT_OPTIONS.map(opt => (
                                    <SelectOption
                                        key={opt.value}
                                        label={opt.label}
                                        icon={opt.icon}
                                        isCheckbox
                                        isSelected={postVisibility.includes(opt.value)}
                                        onClick={() => toggleEngagement(opt.value)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* NSFW Toggle */}
                        <div
                            onClick={() => setIs18Plus(!is18Plus)}
                            className="flex items-center justify-between p-4 bg-[#16161e] border border-[#2a2a35] rounded-xl cursor-pointer hover:border-[#3a3a48] transition-all group"
                        >
                            <div className="flex items-center gap-3 text-white">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${is18Plus ? 'bg-red-500/20 text-red-500' : 'bg-[#2a2a35] text-gray-400'}`}>
                                    <EyeOff size={18} />
                                </div>
                                <span className="text-sm font-semibold">18+ NSFW Content</span>
                            </div>
                            <div className={`w-11 h-6 rounded-full transition-colors relative ${is18Plus ? 'bg-purple-600' : 'bg-[#2a2a35]'}`}>
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${is18Plus ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                        </div>

                        {/* Scheduling Section */}
                        <div className="space-y-4 pt-2">
                            <div
                                onClick={() => setSchedulePost(!schedulePost)}
                                className="flex items-center justify-between p-4 bg-[#16161e] border border-[#2a2a35] rounded-xl cursor-pointer hover:border-[#3a3a48] transition-all"
                            >
                                <div className="flex items-center gap-3 text-white">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${schedulePost ? 'bg-purple-500/20 text-purple-400' : 'bg-[#2a2a35] text-gray-400'}`}>
                                        <Calendar size={18} />
                                    </div>
                                    <span className="text-sm font-semibold">Schedule Post</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full transition-colors relative ${schedulePost ? 'bg-purple-600' : 'bg-[#2a2a35]'}`}>
                                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${schedulePost ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </div>

                            {schedulePost && (
                                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                            <input
                                                type="date"
                                                value={scduleDate}
                                                onChange={e => setScduleDate(e.target.value)}
                                                className="w-full bg-[#16161e] border border-[#2a2a35] rounded-xl py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-purple-500 scheme-dark"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Time</label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                                <input
                                                    type="time"
                                                    value={scheduleTime}
                                                    onChange={e => handleTimeChange(e.target.value)}
                                                    className="w-full bg-[#16161e] border border-[#2a2a35] rounded-xl py-2.5 pl-10 pr-3 text-white text-xs focus:outline-none focus:border-purple-500 scheme-dark"
                                                />
                                            </div>
                                            <div className="flex shrink-0 rounded-xl border border-[#2a2a35] bg-[#16161e] p-0.5">
                                                {(['AM', 'PM'] as const).map(m => (
                                                    <button
                                                        key={m}
                                                        type="button"
                                                        onClick={() => handleMeridiemChange(m)}
                                                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${meridiem === m
                                                            ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                                                            : 'text-gray-500 hover:text-gray-300'
                                                            }`}
                                                    >
                                                        {m}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="px-6 py-5 border-t border-[#2a2a35] bg-[#0d0d12] shrink-0 space-y-3">
                        {/* Video upload progress bar */}
                        {isUploadingVideo && (
                            <div className="space-y-1.5 animate-in fade-in duration-200">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="flex items-center gap-1.5 text-purple-300">
                                        <Film size={13} className="animate-pulse" /> Uploading video…
                                    </span>
                                    <span className="text-gray-400 tabular-nums">{videoProgress}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-[#1a1a24] overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-purple-500 to-indigo-500 transition-all duration-200"
                                        style={{ width: `${videoProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className={`w-full relative overflow-hidden font-bold py-3.5 rounded-full shadow-lg transition-all active:scale-[0.98] text-sm text-white ${showSuccess
                                ? 'bg-emerald-600 shadow-emerald-500/20'
                                : title.trim()
                                    ? 'bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/20'
                                    : 'bg-[#1a1a24] border border-[#2a2a35] text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {/* progress fill inside the button while uploading */}
                            {isUploadingVideo && (
                                <span
                                    className="absolute inset-y-0 left-0 bg-white/15 transition-all duration-200"
                                    style={{ width: `${videoProgress}%` }}
                                />
                            )}
                            <span className="relative">
                                {isUploadingVideo ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Film size={16} className="animate-pulse" />
                                        Uploading Video… {videoProgress}%
                                    </span>
                                ) : isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Creating Post…
                                    </span>
                                ) : showSuccess ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Check size={16} strokeWidth={3} /> Post Created
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-1.5">
                                        Publish Post <ChevronRight size={16} />
                                    </span>
                                )}
                            </span>
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

export default CreatePostModal;