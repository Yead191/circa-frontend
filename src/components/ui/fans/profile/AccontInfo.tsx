"use client";
import { Camera } from "lucide-react";
import { useState } from "react";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-white font-medium text-lg mb-3">
      {children}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-gray-400 text-xs mb-1.5">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1a1b2e] border border-white/5 rounded-lg px-3.5 py-3 text-gray-200 text-sm outline-none focus:border-[#8b7cf8] transition"
      />
    </div>
  );
}

function Avatar({
  src,
  size = 44,
  ring = false,
}: {
  src: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <img
      src={src}
      alt=""
      className={`rounded-full object-cover flex-shrink-0 bg-[#1a1b2e] ${
        ring ? "border-[2.5px] border-[#8b7cf8]" : ""
      }`}
      style={{ width: size, height: size }}
    />
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-13 h-7 rounded-full relative flex-shrink-0 transition ${
        value ? "bg-[#8b7cf8]" : "bg-[#1a1b2e]"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white absolute top-1 shadow-md transition-all ${
          value ? "left-7" : "left-1"
        }`}
      />
    </button>
  );
}

export default function AccountInfo() {
  const [form, setForm] = useState({
    name: "Jhon Lura",
    email: "jhon@mail.com",
    contact: "+38947 39847",
    gender: "Female",
    contact2: "+38947 39847",
  });

  const [notifs, setNotifs] = useState({
    msg: true,
    call: true,
    sales: true,
    gifts: true,
  });

  const notifRows = [
    { key: "msg", label: "New Message" },
    { key: "call", label: "Incoming Call" },
    { key: "sales", label: "Shop Sales" },
    { key: "gifts", label: "Received Gifts" },
  ];

  return (
    <div>
      {/* Avatar */}
      <div className="relative w-[100px] mb-7">
        <Avatar
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=face"
          size={100}
          ring
        />
        <button className="absolute bottom-1 right-1 w-7.5 h-7.5 bg-[#8b7cf8] rounded-full flex items-center justify-center">
          <Camera size={13} className="text-white" />
        </button>
      </div>

      <SectionTitle>Personal Information</SectionTitle>

      {/* Name + Email */}
      <div className="flex flex-wrap gap-3 mb-3.5">
        <InputField
          label="Name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
        />
        <InputField
          label="Email"
          value={form.email}
          type="email"
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        />
      </div>

      {/* Contact + Gender */}
      <div className="flex flex-wrap gap-3 mb-3.5">
        <InputField
          label="Contact"
          value={form.contact}
          onChange={(v) => setForm((f) => ({ ...f, contact: v }))}
        />
        <InputField
          label="Gender"
          value={form.gender}
          onChange={(v) => setForm((f) => ({ ...f, gender: v }))}
        />
      </div>

      {/* Full Contact */}
      <div className="mb-7">
        <InputField
          label="Contact"
          value={form.contact2}
          onChange={(v) => setForm((f) => ({ ...f, contact2: v }))}
        />
      </div>

      <SectionTitle>Notification</SectionTitle>

      <div className="flex flex-col gap-2 mb-7">
        {notifRows.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center justify-between bg-[#1a1b2e] rounded-xl px-4 py-3.5"
          >
            <span className="text-gray-200 text-sm">{label}</span>
            <Toggle
              value={notifs[key as keyof typeof notifs]}
              onChange={(v) =>
                setNotifs((n) => ({ ...n, [key]: v }))
              }
            />
          </div>
        ))}
      </div>

      <button className="w-full bg-[#8b7cf8] rounded-xl py-4 text-white text-sm font-semibold hover:opacity-90 transition">
        Save Changes
      </button>
    </div>
  );
}