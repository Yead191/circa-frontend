// layout.tsx  (your route group layout)
import { DashboardClientShell } from "@/components/layout/DashboardClientShell";
import React from "react";
import { myFetch } from "../../../helpers/myFetch";

export default async function DashboardGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  const walletRes = await myFetch("/wallet", {
    method: "GET",
    cache: "no-store",
    tags: ["wallet"]
  });
  const creditData = walletRes?.data?.credit || 0;

  return <DashboardClientShell creditData={creditData}>{children}</DashboardClientShell>;
}