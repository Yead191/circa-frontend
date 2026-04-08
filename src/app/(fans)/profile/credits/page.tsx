import Credits from "@/components/ui/fans/profile/Creadit";
import { myFetch } from "../../../../../helpers/myFetch";

export default async function CreditsPage() {
  const res = await myFetch("/package");
  const packages = res?.data || [];
  const credit = await myFetch("/wallet");
  const creditData = credit?.data?.credit || 0;


  return (
    <div className="space-y-6 pb-6 max-w-2xl mx-auto">
      <Credits packages={packages} creditData={creditData} />
    </div>
  );
}
