import { ExploreTabs } from "@/components/ui/fans/explore/ExploreTabs";
import { myFetch } from "../../../../helpers/myFetch";


interface PageProps {
  searchParams: Promise<{
    tab?: string,
    category?: string,
  }>
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [categoriesData] = await Promise.all([
    myFetch('/category', {
      cache: "no-cache"
    })
  ])

  const { tab, ...rest } = params;
  const queryString = new URLSearchParams(rest).toString();
  let data;
  // let creatorFilter
  switch (tab) {
    case "browse":
      data = await myFetch(queryString ? `/user/creator?${queryString}`
        : `/user/creator`);
      // creatorFilter = await myFetch('/category')
      break;

    case "my-creator":
      data = await myFetch(queryString ? `/user/my-creator?${queryString}`
        : `/user/my-creator`);
      break;

    case "friends":
      data = await myFetch(queryString ? `/user/friend-flirty?${queryString}`
        : `/user/friend-flirty`);
      break;

    default:
      data = await myFetch(queryString ? `/user/creator?${queryString}`
        : `/user/creator`);
      break;
  }

  const categories = categoriesData?.data

  return (
    <div>
      <ExploreTabs response={data} tab={params?.tab || "browse"} categories={categories} />
    </div>
  );
}
