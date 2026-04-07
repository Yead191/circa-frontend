

import Breadcrumbs from "../ui/Breadcrumbs";

export function Navbar({
  title = [],
  onMenuClick,
}: {
  title?: { label: string; href: string }[];
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#242424] h-25 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-white text-2xl" onClick={onMenuClick}>
          ☰
        </button>
        {title.length > 0 && <Breadcrumbs items={title} />}
      </div>
    </header>
  );
}
