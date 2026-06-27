import CreatorPostDetails from '@/components/ui/creator/CreatorDashboard/CreatorPostDetails'
import { myFetch } from '../../../../../../helpers/myFetch';
import getProfile from '@/utils/getProfile';

const CreatorPostPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  // console.log(id)
  const user = await getProfile()
  const postRes = await myFetch(`/post/${id}`, {
    method: "GET",
    tags: ["post", `single-post-${id}`],
    cache: "no-store"
  })
  const commentRes = await myFetch(`/post/comment/${id}`, {
    method: "GET",
    tags: ["post-comments", `post-comments-${id}`],
    cache: "no-store"
  })
  const post = postRes?.data || {};
  const comments = commentRes?.data || [];
  // console.log(post)
  return (
    <div>
      <CreatorPostDetails post={post} comments={comments} user={user} />
    </div>
  )
}

export default CreatorPostPage