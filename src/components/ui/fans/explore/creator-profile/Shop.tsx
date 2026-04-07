
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { myFetch } from "../../../../../../helpers/myFetch";
import { imageFormatter } from "../../../../../../helpers/imageFormatter";

const Shop = async ({ creatorId }: { creatorId: string }) => {
  const data = await myFetch(`/product/user/${creatorId}`);
  const shopData = data?.data || [];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-4 pb-12">
      {shopData.map((item: { _id: string; image: string; name: string; price: string }) => (
        <Link href={`/explore/creator-profile/product-details?id=${item._id}&type=product`} key={item._id} className="flex flex-col gap-3 group cursor-pointer">
          <div className="relative w-full rounded-[22px] overflow-hidden bg-[#1c1c20]">

            <Image
              src={imageFormatter(item?.image)}
              width={500}
              height={300}
              className="object-cover h-[300px] transition-transform duration-500 group-hover:scale-105"
              alt={item?.name}
            />

            {/* Likes Badge */}
            {/* <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Heart size={14} className="text-[#D4D4D8]" />
              <span className="text-white text-[13px] font-medium tracking-wide">
                {item.likes}
              </span>
            </div> */}
          </div>

          <div className="flex justify-between items-start px-1 mt-0.5">
            <div>
              <h3 className="text-white font-medium text-[15px] truncate tracking-wide">
                {item?.name}
              </h3>
              <p className="text-[#FF9A85] text-[15px] mt-0.5 font-medium tracking-wide">
                ${item?.price}
              </p>
            </div>

            <button className="w-[34px] h-[34px] rounded-full bg-[#181624] flex items-center justify-center text-[#9EA4F9] hover:bg-[#8e95f5] hover:text-white transition-colors shrink-0">
              <ShoppingCart size={16} className="-ml-0.5" />
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Shop;