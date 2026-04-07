import BlockList from "@/components/ui/creator/Profile/BlockList";
import { myFetch } from "../../../../../helpers/myFetch";


export default async function BlockListPage() {
  const blockedListRes = await myFetch('/user/block', { method: 'GET', cache: 'no-store', tags: ['blocklist'] })
  const blockList = blockedListRes?.data || [];
  return (
    <div className="space-y-6 pb-6">
      <BlockList blockList={blockList} />
    </div>
  );
}
