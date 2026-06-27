import CreatorProfile from "@/components/ui/fans/explore/creator-profile";
import { myFetch } from "../../../../../helpers/myFetch";


interface pageProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}
const CreatorProfilePage = async ({ searchParams }: pageProps) => {
    const params = await searchParams;
    const creatorData = await myFetch(`/user/creator/${params?.creatorId}`);
    const creatorId = params?.creatorId;
    // console.log(creatorData)
    return (
        <div>
            <CreatorProfile creatorData={creatorData?.data} creatorId={creatorId} />
        </div>
    );
};

export default CreatorProfilePage;