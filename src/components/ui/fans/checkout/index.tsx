"use client";

import { useState, useEffect } from "react";
import CartStep from "./CartStep";
import CheckoutStep from "./CheckoutStep";
import SuccessStep from "./SuccessStep";
import { myFetch } from "../../../../../helpers/myFetch";

type Step = "cart" | "checkout" | "success";

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("cart");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [priceBreakdown, setPriceBreakdown] = useState<any>({});
  const [isRevalidate, setIsRevalidate] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await myFetch('/cart', { tags: ['cart'] });
      if (res?.success && res.data) {
        setCartItems(res.data.cart || []);
        setPriceBreakdown(res.data.price_breakdown || {});
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (isRevalidate) {
      fetchCart().then(() => setIsRevalidate(false));
    }
  }, [isRevalidate]);

  return (
    <div className="text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full">
          {step === "cart" && (
            <CartStep
              cart={cartItems}
              priceBreakdown={priceBreakdown}
              onNext={() => setStep("checkout")}
              isRevalidate={isRevalidate}
              setIsRevalidate={setIsRevalidate}
            />
          )}

          {step === "checkout" && (
            <CheckoutStep
              total={priceBreakdown?.total_price || 0}
              onBack={() => setStep("cart")}
              onSuccess={() => setStep("success")}
            />
          )}

          {step === "success" && (
            <SuccessStep
              onHome={() => {
                setStep("cart");
                fetchCart(); // Or redirect somewhere
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}