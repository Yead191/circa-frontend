import FeedList from "@/components/ui/fans/home/FeedList";
import { myFetch } from "../../../helpers/myFetch";

const FEED_LIMIT = 10;

export default async function HomePage() {

  // First page is rendered on the server for a fast initial paint;
  // the rest is loaded on scroll by <FeedList /> via a server action.
  const response = await myFetch(`/post/feed?page=1&limit=${FEED_LIMIT}`, {
    tags: ['feed-posts'],
    cache: "no-store",
  });

  return (
    <div className="space-y-6 pb-10 max-w-2xl mx-auto">
      <div
        className=" h-34 w-full rounded-lg overflow-hidden flex  items-center justify-start px-6"
        style={{
          backgroundImage: "url('/homeBanner.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="font-extrabold text-[#BDDDFF] max-w-xs tracking-widest">
            <span>Become <span className="text-white"> a  <br />
              SANTA  </span>  <br />
              for your creators</span>
          </div>
          <div className="max-w-28 text-center bg-[#F084A9] text-white  py-1.5 rounded-full text-sm">
            Send a gift
          </div>
        </div>
      </div>

      {/* Posts Feed — infinite scroll */}
      <FeedList
        initialPosts={response?.data ?? []}
        initialPagination={response?.pagination ?? { total: 0, limit: FEED_LIMIT, page: 1, totalPage: 1 }}
      />
    </div>
  );
}
