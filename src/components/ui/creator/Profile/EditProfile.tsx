'use client';

import { Edit2, User as UserIcon, Mail, Phone, Calendar, Hash, Globe, AlignLeft, UserCircle } from 'lucide-react';
import { useRef, useState } from "react";
import { User } from '@/types';
import { getImageUrl } from '@/utils/getImageUrl';
import { myFetch } from '../../../../../helpers/myFetch';
import { revalidateTags } from '../../../../../helpers/revalidateTags';
import { toast } from 'sonner';

export default function EditProfile({ user }: { user: any }) {
  // ─── Input States ──────────────────────────────────────────────────────────
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [email] = useState(user?.email || ''); // Read-only
  const [contact, setContact] = useState(user?.contact || '');
  const [dob, setDob] = useState(user?.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '');
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [bio, setBio] = useState(user?.short_bio || '');
  const [wishlist, setWishlist] = useState(user?.amazon_wishlist_link || '');

  // ─── Image States ─────────────────────────────────────────────────────────
  const avatarRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(getImageUrl(user?.image) || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('nickname', nickname);
    formData.append('contact', contact);
    formData.append('date_of_birth', dob);
    formData.append('age', String(age));
    formData.append('gender', gender);
    formData.append('short_bio', bio);
    formData.append('amazon_wishlist_link', wishlist);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    toast.promise(myFetch('/user/profile', {
      method: 'PATCH',
      body: formData,
    }), {
      loading: 'Updating profile...',
      success: (res: any) => {
        if (res?.success) {
          revalidateTags(['user']);
          return res?.message || 'Profile updated successfully';
        }
        throw new Error(res?.message || 'Failed to update profile');
      },
      error: (err) => err?.message || 'Failed to update profile',
      finally: () => setIsSubmitting(false)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4 py-2">
        <div
          onClick={() => avatarRef.current?.click()}
          className="relative w-24 h-24 rounded-full overflow-hidden bg-[#1a1b2e] border-2 border-indigo-500/20 cursor-pointer group"
        >
          <img
            src={imagePreview || "https://api.dicebear.com/7.x/personas/svg?seed=default"}
            alt="Profile preview"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Edit2 size={18} className="text-white" />
          </div>
        </div>
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Change Profile Photo</p>
        <input
          ref={avatarRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-5">
        {/* Info Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField label="Full Name" icon={<UserIcon size={14} />} value={name} setter={setName} placeholder="Your full name" />
          <InputField label="Username" icon={<Hash size={14} />} value={username} setter={setUsername} placeholder="@username" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField label="Nickname" icon={<UserCircle size={14} />} value={nickname} setter={setNickname} placeholder="Bhondo" />
          <InputField label="Contact" icon={<Phone size={14} />} value={contact} setter={setContact} placeholder="+880..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
              <Mail size={11} className="text-indigo-400" /> Email
            </p>
            <input type="email" value={email} disabled
              className="w-full bg-[#1a1b2e] border border-white/5 rounded-xl px-4 py-3.5 text-gray-500 text-sm focus:outline-none cursor-not-allowed" />
          </div>
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
              <Calendar size={11} className="text-indigo-400" /> Date of Birth
            </p>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)}
              className="w-full bg-[#1a1b2e] border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all scheme-dark" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
              <UserCircle size={11} className="text-indigo-400" /> Gender
            </p>
            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              className="w-full bg-[#1a1b2e] border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* <InputField label="Age" icon={<Hash size={14}/>} type="number" value={age} setter={setAge} placeholder="27" /> */}
        </div>

        <InputField label="Amazon Wishlist Link" icon={<Globe size={14} />} value={wishlist} setter={setWishlist} placeholder="https://www.amazon.com/..." />

        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
            <AlignLeft size={11} className="text-indigo-400" /> Short Bio
          </p>
          <textarea
            value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Tell something about yourself..."
            className="w-full bg-[#1a1b2e] border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 resize-none transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]
                    ${isSubmitting ? 'bg-indigo-600/50 text-white/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'}`}
      >
        {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
      </button>
    </form>
  );
}

function InputField({ label, icon, value, setter, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-1.5 flex-1">
      <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
        <span className="text-indigo-400">{icon}</span> {label}
      </p>
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={e => setter(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#1a1b2e] border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 transition-all"
        />
      </div>
    </div>
  );
}