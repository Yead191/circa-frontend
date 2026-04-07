import AccountInfo from "@/components/ui/fans/profile/AccontInfo";
import React from "react";
import getProfile from "../../../../../helpers/getProfile";
import EditProfile from "@/components/ui/creator/Profile/EditProfile";

export default async function AccountInfoPage() {
  const user = await getProfile();
  return (
    <div className="space-y-6 pb-6">
      <EditProfile user={user} />
    </div>
  );
}
