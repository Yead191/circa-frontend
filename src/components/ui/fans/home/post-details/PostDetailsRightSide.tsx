"use client";
import { CheckCircle2, Crown } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { myFetch } from '../../../../../../helpers/myFetch';
import { useEffect, useState } from 'react';
import { imgUrl } from '../../../../../../helpers/imgUrl';

const PostDetailsRightSide = () => {
    const params = useSearchParams();
    const router = useRouter();
    const type = params.get("type");
    const id = params.get("id");

    const [postData, setPostData] = useState<any>(null);
    const [membershipPlan, setMembershipPlan] = useState<any>(null);
    const user = type === "product" ? postData?.author : postData?.user;

    const getPostData = async () => {
        try {
            if (type === "product") {
                const res = await myFetch(`/product/${id}`);
                setPostData(res?.data);
            } else {
                const res = await myFetch(`/post/${id}`);
                setPostData(res?.data);
            }
        } catch (error) {
            console.error("Post fetch error:", error);
        }
    };

    const getMemberShipPackage = async (userId: string) => {
        try {
            const res = await myFetch(`/plan/user/${userId}`);
            setMembershipPlan(res?.data[0]);
        } catch (error) {
            console.error("Membership fetch error:", error);
        }
    };

    useEffect(() => {
        if (id) {
            getPostData();
        }
    }, [id]);

    useEffect(() => {
        if (user?._id) {
            getMemberShipPackage(user._id);
        }
    }, [user]);

    const [isMessaging, setIsMessaging] = useState(false);

    const handleMessage = async () => {
        if (!user?._id) return;
        setIsMessaging(true);
        try {
            const res = await myFetch(`/chat/${user._id}`, {
                method: "POST",
            });
            if (res?.success) {
                router.push('/message');
            } else {
                console.error("Failed to start chat:", res?.message);
            }
        } catch (error) {
            console.error("Message fetch error:", error);
        } finally {
            setIsMessaging(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-4">
                {/* Profile Card */}
                <div className="bg-[#1C1A24] rounded-2xl p-6 border border-gray-800 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                        <Image
                            src={
                                user?.image && user?.image.startsWith('http')
                                    ? user?.image
                                    : user?.image
                                        ? `${imgUrl}${user?.image}`
                                        : '/default-avatar.jpg'
                            }
                            alt="user image"
                            width={80}
                            height={80}
                        />
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                        {user?.nickname}
                    </p>
                    <h3 className="font-bold text-xl mb-3">{user?.name}</h3>
                    <p className="text-sm text-gray-400 mb-6 px-2 leading-relaxed">
                        {user?.short_bio} ✨
                    </p>
                    <button
                        onClick={handleMessage}
                        disabled={isMessaging}
                        className="w-full bg-[#D08BFF] cursor-pointer hover:bg-[#b070de] text-black font-medium py-2 rounded-xl text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isMessaging ? "Starting chat..." : "Message"}
                    </button>
                </div>

                {/* Membership Card */}
                {
                    membershipPlan && (
                        <div className="bg-[#1C1A24] rounded-2xl p-6 border border-gray-800">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="flex items-center gap-2 font-bold">
                                    <Crown className="w-5 h-5 text-yellow-500" />
                                    Membership
                                </h3>
                                <Link href={`/explore/creator-profile/membership?creatorId=${user?._id}`}><button className='text-xs cursor-pointer'>View All</button></Link>
                            </div>

                            <div className="bg-[#2A2B3D] rounded-xl p-5 border border-gray-700/50">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-[#FF8B94]">{membershipPlan?.name}</h4>
                                    <span className="text-lg">🍭</span>
                                </div>
                                <div className="mb-5">
                                    <span className="font-bold text-lg text-white">${membershipPlan?.price}</span>
                                    <span className="text-gray-400 text-xs"> /{membershipPlan?.category}</span>
                                </div>

                                <ul className="space-y-3 mb-6">
                                    {membershipPlan?.features?.map((feature: any, i: number) => (
                                        <li key={i} className="flex items-center gap-3 text-xs text-gray-300">
                                            <CheckCircle2 className="w-4 h-4 text-[#7971FF] shrink-0" />
                                            {feature?.name}
                                        </li>
                                    ))}
                                </ul>

                                <div className='w-full flex items-center justify-end'>
                                    <Link href={`/explore/creator-profile/membership?creatorId=${user?._id}`} className={`w-full bg-[#7971FF] hover:bg-[#6c64e6] text-white font-semibold py-2.5 text-center rounded-xl text-sm transition-colors`}>
                                        {membershipPlan?.isSubscribed ? "Subscribed" : "Join"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default PostDetailsRightSide;