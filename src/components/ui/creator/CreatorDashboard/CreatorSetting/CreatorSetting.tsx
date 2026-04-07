"use client";

import AboutUs from "@/components/shared/AboutUs/AboutUs";
import ContactUs from "@/components/shared/ContactUs/ContactUs";
import DeleteAccount from "@/components/shared/Deleteaccount/Deleteaccount";
import PrivacyPolicy from "@/components/shared/PrivacyPolicy/PrivacyPolicy";
import Termsandcondition from "@/components/shared/Termsandcondition/Termsandcondition";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  Mail,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";

type PageId = "main" | "about-us" | "terms" | "privacy" | "contact-us" | "delete";

interface MenuItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  danger: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: "about-us", label: "About Us", icon: Info, danger: false },
  { id: "terms", label: "Terms & Condition", icon: FileText, danger: false },
  { id: "privacy", label: "Privacy Policy", icon: ShieldCheck, danger: false },
  { id: "contact-us", label: "Contact Us", icon: Mail, danger: false },
  { id: "delete", label: "Delete Account", icon: Trash2, danger: true },
];

function PageRenderer({ page, about, terms, privacy }: { page: PageId, about: string, terms: string, privacy: string }) {
  switch (page) {
    case "about-us": return <AboutUs about={about} />;
    case "terms": return <Termsandcondition terms={terms} />;
    case "privacy": return <PrivacyPolicy privacy={privacy} />;
    case "contact-us": return <ContactUs />;
    case "delete": return <DeleteAccount />;
    default: return null;
  }
}

function SettingsMenu({ onNav }: { onNav: (page: PageId) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-lg bg-[#1a1b2e] hover:bg-[#1f2040] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Icon
                size={16}
                className={item.danger ? "text-red-400" : "text-indigo-400"}
                strokeWidth={1.8}
              />
              <span className={`text-md font-semibold ${item.danger ? "text-red-400" : "text-white"}`}>
                {item.label}
              </span>
            </div>
            <ChevronRight
              size={15}
              className={item.danger ? "text-red-400/30" : "text-gray-600 group-hover:text-gray-400"}
              strokeWidth={2}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function SettingsPage({ about, terms, privacy }: { about: string, terms: string, privacy: string }) {
  const [page, setPage] = useState<PageId>("main");

  return (
    <div className="bg-[#0f1020] px-6 py-6">
      {page !== "main" && (
        <button
          onClick={() => setPage("main")}
          className="mb-4  flex items-center  text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={22} /> <span>Back</span>
        </button>
      )}

      {page === "main" ? (
        <SettingsMenu onNav={setPage} />
      ) : (
        <PageRenderer page={page} about={about} terms={terms} privacy={privacy} />
      )}
    </div>
  );
}