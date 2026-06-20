import React from "react";

export function RightSidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="flex-none hidden lg:block w-full h-full bg-[#0a0a0a]">
      <div className="sticky top-18 h-[calc(100vh-72px)] p-6 overflow-y-auto">
        {children}
      </div>
    </aside>
  );
}
