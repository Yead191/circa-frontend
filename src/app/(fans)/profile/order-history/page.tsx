import OrderList from "@/components/ui/creator/Profile/OrderList";
import { myFetch } from "../../../../../helpers/myFetch";


export default async function OrderHistoryPage() {
  const orderListRes = await myFetch('/order', { method: 'GET', cache: 'no-store', tags: ['order'] })
  const orderList = orderListRes?.data || [];
  return (
    <div className="space-y-6 pb-6">
      <OrderList orderList={orderList} />
    </div>
  );
}
