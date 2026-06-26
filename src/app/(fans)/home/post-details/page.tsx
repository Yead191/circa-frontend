import PostDetailsLayout from "@/components/ui/fans/home/post-details/PostDetailsLayout";
import { myFetch } from "../../../../../helpers/myFetch";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PostDetailsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const response = await myFetch(`/post/${params?.id}`, { tags: ['single-post'], cache: "no-store", })
  const post = response?.data || {}
  return (
    <div className="min-h-screen bg-[#0a0a0a] ">
      <PostDetailsLayout post={post} />
    </div>
  );
}
