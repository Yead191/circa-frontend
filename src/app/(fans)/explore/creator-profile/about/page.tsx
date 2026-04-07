import About from "@/components/ui/fans/explore/creator-profile/about";
import { myFetch } from "../../../../../../helpers/myFetch";

interface pageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}
const AboutPage = async ({ searchParams }: pageProps) => {
  const { id } = await searchParams;
  const res = await myFetch(`/user/creator/${id}`);
  const creatorData = res?.data;

  return (
    <div>
      <About id={id as string} data={creatorData} />
    </div>
  );
};

export default AboutPage;