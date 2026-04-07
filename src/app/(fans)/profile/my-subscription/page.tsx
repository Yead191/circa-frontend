import MySubscription from "@/components/ui/fans/profile/MySubscription";
import React from "react";
import { myFetch } from "../../../../../helpers/myFetch";

export default async function MySubscriptionPage() {
  const res = await myFetch("/subscription/creators");
  const data = res?.data || [];

  return (
    <div className="space-y-6 pb-6">
      <MySubscription data={data} />
    </div>
  );
}
