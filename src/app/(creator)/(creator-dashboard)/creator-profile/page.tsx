import CreatorProfile from "@/components/ui/creator/Profile"
import getProfile from "@/utils/getProfile";
import { myFetch } from "../../../../../helpers/myFetch";


const page = async () => {
  const user = await getProfile();
  const membershipRes = await myFetch('/plan', { method: 'GET', cache: 'no-store', tags: ['plan'] })
  const featuresRes = await myFetch('/plan/features', { method: 'GET', cache: 'no-store', tags: ['feature'] })
  const plans = membershipRes?.data || []
  const features = featuresRes?.data || []
  // console.log(plans)
  return (
    <div className="">
      <CreatorProfile user={user} plans={plans} features={features} />
    </div>

  )
}

export default page