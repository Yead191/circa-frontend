import { Button } from "@/components/ui/button";
import { Check, Home } from "lucide-react";

interface Props {
  onHome: () => void;
}

export default function SuccessStep({ onHome }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Animated checkmark circle */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
        <div className="absolute -inset-3 rounded-full border border-indigo-500/20" />
        <div className="absolute -inset-6 rounded-full border border-indigo-500/10" />

        <span className="absolute -top-4 -right-2 w-2.5 h-2.5 rounded-full bg-indigo-400 opacity-70" />
        <span className="absolute top-2 -right-8 w-1.5 h-1.5 rounded-full bg-purple-400 opacity-50" />
        <span className="absolute -bottom-3 -left-4 w-2 h-2 rounded-full bg-indigo-300 opacity-60" />
        <span className="absolute bottom-4 -right-6 w-1 h-1 rounded-full bg-white opacity-40" />

        <div className="relative w-24 h-24 rounded-full bg-indigo-500/30 border-2 border-indigo-400/60 flex items-center justify-center backdrop-blur-sm">
          <Check className="w-10 h-10 text-indigo-300 stroke-[2.5]" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
        Thank You!
      </h2>
      <p className="text-white/50 text-sm mb-8">
        Your Payment has been successfully done
      </p>

      <Button
        onClick={onHome}
        className="bg-indigo-500/80 hover:bg-indigo-500 border border-indigo-400/40 text-white font-semibold rounded-xl px-8 h-11 flex items-center gap-2 transition-all"
      >
        <Home className="w-4 h-4" />
        Go to Home
      </Button>
    </div>
  );
}
