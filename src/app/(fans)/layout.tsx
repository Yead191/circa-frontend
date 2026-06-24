// layout.tsx  (your route group layout)
import { DashboardClientShell } from "@/components/layout/DashboardClientShell";
import React from "react";
import { myFetch } from "../../../helpers/myFetch";
import getProfile from "../../../helpers/getProfile";

export default async function DashboardGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  const [walletRes, profileRes, cartRes] = await Promise.all([
    myFetch("/wallet", {
      method: "GET",
      cache: "no-store",
      tags: ["wallet"]
    }),
    getProfile(),
    myFetch('/cart', { tags: ['cart'] })
  ]);
  const creditData = walletRes?.data?.credit || 0;
  const cartCount = cartRes?.data?.cart?.length || 0;


  return <DashboardClientShell creditData={creditData} profileData={profileRes ?? {}} cartCount={cartCount}>{children}</DashboardClientShell>;
}