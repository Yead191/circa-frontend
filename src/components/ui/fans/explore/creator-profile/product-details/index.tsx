"use client";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { getImageUrl } from "@/utils/getImageUrl";
import { myFetch } from "../../../../../../../helpers/myFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { revalidateTags } from "../../../../../../../helpers/revalidateTags";

const ProductDetails = ({ productDetails }: { productDetails: any }) => {
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    // console.log("ProductDetails Component Received:", quantity);
    const handleBuy = async (product: string) => {
        try {
            const response = await myFetch("/cart", { method: "POST", body: { product, quantity } })

            if (response?.success) {
                toast.success(response?.message)
                router.replace('/add-to-card');
            } else {
                if (response?.error && Array.isArray(response.error)) {
                    response.error.forEach((err: { message: string }) => {
                        toast.error(err.message, { id: "cart" });
                    });
                } else {
                    toast.error(response?.message || "Something went wrong!", {
                        id: "cart",
                    });
                }
            }
        } catch (err) {
            console.error('cart error:', err);
        }
    };

    const handleAddToCart = async (product: string) => {
        try {
            const response = await myFetch("/cart", { method: "POST", body: { product, quantity } })

            if (response?.success) {
                toast.success(response?.message)
                revalidateTags(["cart"])
            } else {
                if (response?.error && Array.isArray(response.error)) {
                    response.error.forEach((err: { message: string }) => {
                        toast.error(err.message, { id: "cart" });
                    });
                } else {
                    toast.error(response?.message || "Something went wrong!", {
                        id: "cart",
                    });
                }
            }
        } catch (err) {
            console.error('cart error:', err);
        }
    };

    // console.log("ProductDetails", productDetails);
    return (
        <div className="max-w-2xl mx-auto text-white pb-10">
            {/* Image */}
            <div className="relative w-full h-87.5 md:h-112.5 lg:h-137.5 rounded-3xl overflow-hidden mb-8 border border-[#242424] bg-[#1c1c20]">
                <Image
                    src={getImageUrl(productDetails?.image) || "/placeholder.png"}
                    fill
                    className="object-cover"
                    alt={productDetails?.name || "Product Image"}
                />
            </div>

            {/* Header Content */}
            <div className="flex justify-between items-start mb-7 gap-4">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[26px] md:text-3xl font-medium tracking-wide text-white">
                        {productDetails?.name || "Product Name"}
                    </h1>
                    <p className="text-[#a78bfa] text-[15px] font-light tracking-wide">
                        Published: {new Date(productDetails?.createdAt).toLocaleDateString() || "N/A"}
                    </p>
                    <p className="text-[#FF9A85] text-xl font-medium tracking-wide mt-1">
                        {productDetails?.price ? `$${productDetails.price.toFixed(2)}` : "$00.00"}
                    </p>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-4 mt-1.5">
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-8.5 h-8.5 rounded border border-[#3A3A40] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#5A5A60] transition-colors focus:outline-none"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="text-[20px] font-medium w-4 text-center">{quantity}</span>
                    <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-8.5 h-8.5 rounded border border-[#3A3A40] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#5A5A60] transition-colors focus:outline-none"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Description */}
            <div className="mb-10">
                <p className="text-[#D4D4D8] text-[16px] leading-[1.8] font-light tracking-wide">
                    {productDetails?.description || "No description available for this product."}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button className="flex-1 py-3 rounded-xl bg-[#9EA4F9] text-white text-[15px] font-medium hover:bg-[#8e95f5] transition-colors tracking-wide" onClick={() => handleBuy(productDetails?._id)}>
                    Buy Now
                </button>
                <button className="flex-1 py-3 rounded-xl bg-[#131118] text-[#D4D4D8] text-[15px] font-medium hover:bg-[#1a1824] border border-[#2A2A30] transition-colors tracking-wide" onClick={() => handleAddToCart(productDetails?._id)}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;