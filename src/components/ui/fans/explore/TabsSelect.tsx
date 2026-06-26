'use client'
import { Tabs, TabsList, TabsTrigger } from '../../tabs'
import { useRouter, useSearchParams } from 'next/navigation';

const TabsSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "browse";

  const handleTabChange = (value: string) => {
    router.push(`/explore?tab=${value}`);
  };


  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="flex md:grid md:grid-cols-3 w-full mb-6 overflow-x-auto scrollbar-none justify-start md:justify-center gap-6 pl-4 md:pl-0">
        <TabsTrigger value="browse" className="whitespace-nowrap min-w-30 md:min-w-0">Browse Creators</TabsTrigger>
        <TabsTrigger value="my-creator" className="whitespace-nowrap min-w-30 md:min-w-0">My Creator</TabsTrigger>
        <TabsTrigger value="friends" className="whitespace-nowrap min-w-30 md:min-w-0">Friends & Flirting</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default TabsSelect