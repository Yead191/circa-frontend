"use client";

import { useState, useEffect } from "react";
import CartStep from "./CartStep";
import CheckoutStep from "./CheckoutStep";
import SuccessStep from "./SuccessStep";
import { revalidateTags } from "../../../../../helpers/revalidateTags";

type Step = "cart" | "checkout" | "success";

export default function CheckoutPage({ cartItems, priceBreakdown }: { cartItems: any[], priceBreakdown: any }) {
  const [step, setStep] = useState<Step>("cart");
  const [isRevalidate, setIsRevalidate] = useState(false);

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
                revalidateTags(["cart"])
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}