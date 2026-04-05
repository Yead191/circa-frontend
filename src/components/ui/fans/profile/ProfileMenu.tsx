"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Ban,
  ChevronRight,
  CreditCard,
  Lock,
  ShoppingBag,
  Star,
  User,
} from "lucide-react";

// ── Palette ────────────────────────────────────────────────────────────────────
const SURFACE = "#13141f";
const SURFACE2 = "#1a1b2e";
const ACCENT = "#8b7cf8";

const MENU_ITEMS = [
  { href: "/profile/account-info", label: "Account Information", icon: User },
  { href: "/profile/my-subscription", label: "My Subscription", icon: CreditCard },
  { href: "/profile/credits", label: "Credits", icon: Star },
  { href: "/profile/order-history", label: "Order History", icon: ShoppingBag },
  { href: "/profile/change-password", label: "Change Password", icon: Lock },
  { href: "/profile/block-list", label: "Block List", icon: Ban },
];

export default function ProfileMenu() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 pb-6">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href}>
            <div
              className="flex justify-between items-center px-4 py-4 rounded-xl transition-all duration-200"
              style={{
                background: isActive ? SURFACE2 : SURFACE,
              }}
            >
              <div className="flex gap-3.5 items-center">
                <span style={{ color: ACCENT }}>
                  <Icon size={17} />
                </span>
                <span className="text-gray-200 text-base font-medium">
                  {item.label}
                </span>
              </div>
              <ChevronRight
                size={15}
                color={isActive ? ACCENT : "#4b5563"}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
