"use client";

import { Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../../input";
import { getImageUrl } from "@/utils/getImageUrl";
import { myFetch } from "../../../../../helpers/myFetch";
import { revalidateTags } from "../../../../../helpers/revalidateTags";

const ItemList = ({ cart, setIsRevalidate }: any) => {
    const [search, setSearch] = useState("");
    const [localCart, setLocalCart] = useState<any[]>([]);

    useEffect(() => {
        setLocalCart(cart || []);
    }, [cart]);

    const filteredCart = localCart.filter((item: any) =>
        item?.product?.name?.toLowerCase().includes(search.toLowerCase())
    );
    const updateCartQty = async (id: string, amount: number) => {
        try {
            const res = await myFetch(`/cart/${id}`, {
                method: "PATCH",
                body: { amount }, // 🔥 important
            });

            if (res?.success) {
                revalidateTags(["cart"]);
                setIsRevalidate(true);
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleQtyChange = (id: string, delta: number) => {
        const currentItem = localCart.find((i) => i._id === id);
        if (!currentItem) return;

        if (currentItem.quantity <= 1 && delta === -1) return;

        setLocalCart((prev) =>
            prev.map((item) =>
                item._id === id
                    ? { ...item, quantity: item.quantity + delta }
                    : item
            )
        );
        updateCartQty(id, delta);
    };

    const handleRemove = async (id: string) => {
        try {
            const res = await myFetch(`/cart/${id}`, {
                method: "DELETE",
            });

            if (res?.success) {
                revalidateTags(["cart"]);
                setIsRevalidate(true);
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div className="md:col-span-3 bg-[#161619] border border-white/[0.07] rounded-2xl p-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-4 h-4 text-indigo-400" />
                <h2 className="text-base font-semibold">Cart</h2>
                <span className="text-xs text-white/40">
                    ({localCart.length})
                </span>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <Input
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10 text-white text-xs h-9"
                />
            </div>

            {/* Items */}
            <div className="divide-y divide-white/[0.06]">
                {filteredCart.length === 0 ? (
                    <p className="py-8 text-center text-sm text-white/30">
                        No items found
                    </p>
                ) : (
                    filteredCart.map((item: any) => (
                        <div
                            key={item._id}
                            className="flex items-center gap-4 py-3 group"
                        >
                            {/* Image */}
                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                                <img
                                    src={getImageUrl(item?.product?.image)}
                                    alt={item?.product?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                    {item?.product?.name}
                                </p>

                                <p className="text-indigo-400 text-sm mt-1">
                                    ${item?.unit_price?.toFixed(2)}
                                </p>

                                {/* Quantity */}
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => handleQtyChange(item._id, -1)}
                                        className="w-6 h-6 bg-white/10 hover:bg-white/20 flex items-center justify-center"
                                    >
                                        <Minus className="w-3 h-3 text-white/70" />
                                    </button>

                                    <span className="w-6 text-center text-sm">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() => handleQtyChange(item._id, 1)}
                                        className="w-6 h-6 bg-white/10 hover:bg-white/20 flex items-center justify-center"
                                    >
                                        <Plus className="w-3 h-3 text-white/70" />
                                    </button>
                                </div>
                            </div>

                            {/* Remove */}
                            <button
                                onClick={() => handleRemove(item._id)}
                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 text-white/40 hover:text-red-400"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ItemList;