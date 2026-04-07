import React from "react";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { imageFormatter } from "../../../../../../../helpers/imageFormatter";

const About = ({ id, data }: { id: string, data: any }) => {
  const stats = [
    { label: "Members", value: data?.freeMambers || 0 },
    { label: "Paid members", value: data?.paidMambers || 0 },
    { label: "Total posts", value: data?.totalPosts || 0 },
  ];

  return (
    <div className="flex flex-col items-center  mx-auto py-8 px-4 bg-[#15131A] min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative size-32 md:size-40 mb-4">
          <Image
            src={imageFormatter(data?.image)}
            alt={data?.name || "Creator Avatar"}
            fill
            className="rounded-full object-cover border-4 border-cardBg shadow-xl"
          />
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            {data?.name}
          </h2>
          <BadgeCheck className="size-6 text-[#99a0fd] fill-[#99a0fd]/20" />
        </div>
        <p className="text-gray-400 text-sm md:text-base font-medium uppercase tracking-widest">
          {data?.role}
        </p>
      </div>

      {/* Stats Card */}
      <div className="w-full bg-cardBg border border-[#99A1C666] rounded-2xl md:rounded-3xl p-6 md:p-8 mb-10 flex justify-between items-center overflow-hidden max-w-4xl">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <span className="text-lg md:text-xl font-bold text-primary mb-1">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-gray-400 font-medium">
                {stat.label}
              </span>
            </div>
            {index < stats.length - 1 && (
              <div className="h-8 w-[1px] bg-[#99A1C666] shrink-0 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Description */}
      <div className="w-full max-w-4xl">
        <p className="text-gray-300 text-[15px] md:text-base leading-[1.8] font-light whitespace-pre-line text-justify md:text-left">
          {data?.short_bio}
        </p>
      </div>
    </div>
  );
};

export default About;
