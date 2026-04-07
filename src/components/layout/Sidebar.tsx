"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";
import { FiHome, FiCompass, FiMessageCircle, FiUser, FiLogOut } from "react-icons/fi";
import { IoMdWallet } from "react-icons/io";
import { IoDiamondSharp, IoSettingsOutline } from "react-icons/io5";
import Cookies from "js-cookie";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/explore", label: "Explore", icon: FiCompass },
  { href: "/message", label: "Message", icon: FiMessageCircle },
  { href: "/profile", label: "Profile", icon: FiUser },
  { href: "/setting", label: "Setting", icon: IoSettingsOutline },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const handleLogout = () => {
    Cookies.remove("accessToken");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}


      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 h-full w-[240px] md:w-full border-r border-[#242424] flex flex-col pt-2 pb-8 px-4 z-40 bg-[#0a0a0a] transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-2 h-[85px] mb-5">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Circa Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-medium text-primary tracking-wide">
                Circa
              </span>
            </Link>

            <button
              onClick={onClose}
              className="md:hidden text-gray-400 hover:text-white text-xl p-1"
            >
              ✕
            </button>
          </div>

          {/* 🔥 Nav Items (Mapped) */}
          <div className=" pb-8 border-b border-[#242424] flex flex-col gap-2">
            {navItems.map((item) => (
              <SidebarLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                onClick={onClose}
              >
                {item.label}
              </SidebarLink>
            ))}
          </div>

          {/* Bottom Card */}
          <div className=" bg-[#F2CC0D0A] mt-6 rounded-xl p-4 border border-[#2D2D2D]">
            <div className="flex items-center justify-between mb-4">
              <span className=" text-white font-medium">Balance</span>
              <span className="">
                <IoDiamondSharp color="#B07BB7" size={18} />
              </span>
            </div>

            <div className="text-[#F2CC0D] font-medium text-xl mb-4 flex items-center gap-2">
              <span>
                <IoMdWallet color="#F2CC0D" size={18} />
              </span>{" "}
              120 Credits
            </div>

            <button className="w-full py-2 bg-primary hover:bg-opacity-90 transition-opacity text-white font-medium rounded-lg text-sm cursor-pointer">
              Buy
            </button>
          </div>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-[#242424]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all text-gray-400 hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
            >
              <FiLogOut className="text-2xl" />
              <span>LogOut</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: IconType;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();

  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 rounded-lg font-semibold transition-all 
        ${isActive
          ? "bg-primary text-white"
          : "text-gray-400 hover:text-white hover:bg-[#1a1a1e]"
        }`}
    >
      <Icon className="text-2xl" />
      <span>{children}</span>
    </Link>
  );
}
