"use client";

import Cookies from "js-cookie";
import {
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  MessageCircleMore,
  Plus,
  Settings,
  User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";



interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/creator-home", icon: LayoutDashboard },
  { name: "Earning", href: "/earning", icon: CircleDollarSign },
  { name: "Post", href: "/post", icon: Plus },
  { name: "Message", href: "/creator-message", icon: MessageCircleMore },
  { name: "Profile", href: "/creator-profile", icon: User },
  { name: "Setting", href: "/creator-setting", icon: Settings },

  // {
  //   name: "Help & Support",
  //   href: "/user-dashboard/help-and-support",
  //   icon: HelpCircle,
  // },
];

export function CreatorSidebar() {

  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {!isMobileOpen && <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-2 left-3 sm:left-4 z-50 p-2 text-white text-2xl transition-colors cursor-pointer"
      >
        ☰
      </button>}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-[#0A0A0A] border-r border-primary/20 z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 pb-10">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
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
              )}

              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden text-gray-400 hover:text-white text-xl p-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === "/transactions" && item.href === "/earning" ? true : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                   flex items-center gap-3 px-3 py-3 rounded-lg font-semibold transition-all
                    ${isActive
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1e]"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-primary/20">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                text-gray-300 hover:bg-red-500/10 hover:text-red-500 transition-all
                ${isCollapsed ? "justify-center" : ""}
              `}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
