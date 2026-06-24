"use client";
import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { RightSidebar } from "./RightSidebar";
import { ContentWrapper } from "./ContentWrapper";
import { RightSidebarNav } from "./RightSidebarNav";

interface DashboardLayoutProps {
  children: ReactNode;
  breadcrumbs?: { label: string; href: string }[];
  rightSidebar?: ReactNode;
  creditData: number;
  profileData: any;
  cartCount: number;
}

export function DashboardLayout({
  children,
  breadcrumbs = [],
  rightSidebar,
  creditData,
  profileData,
  cartCount
}: DashboardLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full text-white font-sans overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div className="hidden md:flex md:w-55 lg:w-60 xl:w-65 shrink-0 h-screen sticky top-0">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} creditData={creditData} />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} creditData={creditData} />
      </div>


      {/* MIDDLE CONTENT */}
      <div className="flex-1 border-x border-[#242424] flex flex-col min-h-dvh overflow-y-auto w-full min-w-0">
        <Navbar title={breadcrumbs} onMenuClick={() => setSidebarOpen(true)} />
        <ContentWrapper>
          <main className="p-3 sm:p-4 w-full flex-1">{children}</main>
        </ContentWrapper>
      </div>

      {/* RIGHT SIDEBAR — hidden below lg */}
      <div className="hidden lg:flex lg:w-65 xl:w-75 shrink-0 flex-col min-h-dvh overflow-y-auto">
        <RightSidebarNav profileData={profileData} cartCount={cartCount} />
        <ContentWrapper>
          {rightSidebar && <RightSidebar>{rightSidebar}</RightSidebar>}
        </ContentWrapper>
      </div>
    </div>
  );
}
