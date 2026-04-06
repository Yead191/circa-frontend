"use client";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { getImageUrl } from "@/utils/getImageUrl";

const ProductDetails = ({ productDetails }: { productDetails: any }) => {
    const [quantity, setQuantity] = useState(1);

    console.log("ProductDetails", productDetails);
    return (
        <div className="w-full text-white pb-10">
            {/* Image */}
            <div className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] rounded-3xl overflow-hidden mb-8 border border-[#242424] bg-[#1c1c20]">
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
                        className="w-[34px] h-[34px] rounded border border-[#3A3A40] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#5A5A60] transition-colors focus:outline-none"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="text-[20px] font-medium w-4 text-center">{quantity}</span>
                    <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-[34px] h-[34px] rounded border border-[#3A3A40] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#5A5A60] transition-colors focus:outline-none"
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
                <button className="flex-1 py-3 rounded-xl bg-[#9EA4F9] text-white text-[15px] font-medium hover:bg-[#8e95f5] transition-colors tracking-wide">
                    Buy Now
                </button>
                <button className="flex-1 py-3 rounded-xl bg-[#131118] text-[#D4D4D8] text-[15px] font-medium hover:bg-[#1a1824] border border-[#2A2A30] transition-colors tracking-wide">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;