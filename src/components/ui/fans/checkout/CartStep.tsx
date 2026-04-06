import { Button } from "@/components/ui/button";
import ItemList from "./ItemList";
import CostSummary from "./CostSummary";

interface Props {
  cart: any[];
  priceBreakdown: any;
  onNext: () => void;
  fetchCart: () => void;
}

export default function CartStep({ cart, priceBreakdown, onNext, fetchCart }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 items-start gap-4">
      {/* Left panel: item list */}
      <ItemList cart={cart} fetchCart={fetchCart} />

      {/* Right panel: cost summary */}
      <div className="md:col-span-2 border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between">
        <CostSummary priceBreakdown={priceBreakdown} />

        <Button
          onClick={onNext}
          disabled={!cart || cart.length === 0}
          className="mt-6 w-full cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl h-11 transition-all disabled:opacity-40"
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
