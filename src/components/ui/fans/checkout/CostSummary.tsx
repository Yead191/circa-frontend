import { Separator } from "@/components/ui/separator";
import { revalidateTags } from "../../../../../helpers/revalidateTags";
import { useEffect } from "react";

interface Props {
  priceBreakdown: {
    products_price?: number;
    serviceFee?: number;
    delivery_charge?: number;
    discount_amount?: number;
    total_price?: number;
    tax?: number;
    subtotal?: number;
  };
}

export default function CostSummary({ priceBreakdown }: Props) {

  const rows = [
    { label: "Products Price", value: priceBreakdown?.products_price },
    { label: "Taxes", value: priceBreakdown?.tax },
    { label: "Service Fee", value: priceBreakdown?.serviceFee },
    { label: "Delivery", value: priceBreakdown?.delivery_charge },
    { label: "Discount", value: priceBreakdown?.discount_amount },
  ].filter(row => row.value !== undefined && row.value !== null && row.value > 0);

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-white mb-3">Cost Summary</p>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between text-xs">
            <span className="text-white/50">{r.label}</span>
            <span className="text-white/70">${r.value?.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <Separator className="my-3 bg-white/10" />
      <div className="flex justify-between text-sm font-bold">
        <span className="text-white">Total</span>
        <span className="text-white">${(priceBreakdown?.total_price || 0).toFixed(2)}</span>
      </div>
    </div>
  );
}
