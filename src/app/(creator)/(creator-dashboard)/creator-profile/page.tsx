import CreatorProfile from "@/components/ui/creator/Profile"
import getProfile from "@/utils/getProfile";
import { myFetch } from "../../../../../helpers/myFetch";


const page = async () => {
  const user = await getProfile();
  const membershipRes = await myFetch('/plan', { method: 'GET', cache: 'no-store', tags: ['plan'] })
  const featuresRes = await myFetch('/plan/features', { method: 'GET', cache: 'no-store', tags: ['feature'] })
  const getNotificationRes = await myFetch('/user/get-notification', { method: 'GET', cache: 'no-store', tags: ['notification-settings'] })
  const orderListRes = await myFetch('/order', { method: 'GET', cache: 'no-store', tags: ['order'] })
  const memberListRes = await myFetch('/subscription/memberlist', { method: 'GET', cache: 'no-store', tags: ['memberlist'] })
  const blockListRes = await myFetch('/user/block', { method: 'GET', cache: 'no-store', tags: ['blocklist'] })
  const plans = membershipRes?.data || []
  const features = featuresRes?.data || []
  const notification = getNotificationRes?.data || {}
  const orderList = orderListRes?.data || []
  const memberList = memberListRes?.data || []
  const blockList = blockListRes?.data || []
  // console.log(plans)
  return (
    <div className="">
      <CreatorProfile user={user} plans={plans} features={features} notification={notification} orderList={orderList} memberList={memberList} blockList={blockList} />
    </div>

  )
}

export default page