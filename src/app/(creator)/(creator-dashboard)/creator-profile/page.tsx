import CreatorProfile from "@/components/ui/creator/Profile"
import getProfile from "@/utils/getProfile";
import { myFetch } from "../../../../../helpers/myFetch";


const page = async () => {
  const [
    user,
    membershipRes,
    featuresRes,
    getNotificationRes,
    orderListRes,
    memberListRes,
    blockListRes,
    categoriesRes,
    privacyRes
  ] = await Promise.all([
    getProfile(),
    myFetch('/plan', { method: 'GET', cache: 'no-store', tags: ['plan'] }),
    myFetch('/plan/features', { method: 'GET', cache: 'no-store', tags: ['feature'] }),
    myFetch('/user/get-notification', { method: 'GET', cache: 'no-store', tags: ['notification-settings'] }),
    myFetch('/order', { method: 'GET', cache: 'no-store', tags: ['order'] }),
    myFetch('/subscription/memberlist', { method: 'GET', cache: 'no-store', tags: ['memberlist'] }),
    myFetch('/user/block', { method: 'GET', cache: 'no-store', tags: ['blocklist'] }),
    myFetch('/category', { method: 'GET' }),
    myFetch('/disclaimer?type=privacy', { method: 'GET' })
  ]);

  const categories = Array.isArray(categoriesRes?.data)
    ? categoriesRes.data
    : [];

  const plans = membershipRes?.data || [];
  const features = featuresRes?.data || [];
  const notification = getNotificationRes?.data || {};
  const orderList = orderListRes?.data || [];
  const memberList = memberListRes?.data || [];
  const blockList = blockListRes?.data || [];
  const privacy = privacyRes?.data || "";
  // console.log(plans)
  return (
    <div className="">
      <CreatorProfile user={user} plans={plans} features={features} notification={notification} orderList={orderList} memberList={memberList} blockList={blockList} categories={categories} privacy={privacy} />
    </div>

  )
}

export default page