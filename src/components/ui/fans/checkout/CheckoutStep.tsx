import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Props {
  total: number;
  onBack: () => void;
  onSuccess: () => void;
}

export default function CheckoutStep({ total, onBack, onSuccess }: Props) {
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("New York");
  const [address, setAddress] = useState("House C17/A, B Block, Dhanmondi Dhaka");
  const [contact, setContact] = useState("");
  const [postal, setPostal] = useState("+2938 3048 3498");

  return (
    <div className="max-w-2xl mx-auto w-full bg-cardBg border border-white/[0.07] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold">Payment Details</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-white/50">Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm h-10 focus:ring-indigo-500/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e24] border-white/10 text-white">
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Bangladesh">Bangladesh</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/50">City</Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-white/5 border-white/10 text-white text-sm h-10 focus-visible:ring-indigo-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/50">Address</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-white/5 border-white/10 text-white text-sm h-10 focus-visible:ring-indigo-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/50">Contact</Label>
          <Input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="bg-white/5 border-white/10 text-white text-sm h-10 focus-visible:ring-indigo-500/50"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-1">
          <Label className="text-xs text-white/50">Postal Code</Label>
          <Input
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
            className="bg-white/5 border-white/10 text-white text-sm h-10 focus-visible:ring-indigo-500/50"
          />
        </div>
      </div>

      <div className="bg-[#1a1a20] border border-white/[0.07] rounded-xl p-4 mt-2">
        <p className="text-xs text-white/50 mb-3 font-medium">Payment Amount</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-white">Total</span>
          <span className="text-sm font-bold text-white">${(total || 0).toFixed(2)}</span>
        </div>
        <Button
          onClick={onSuccess}
          className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl h-11 transition-all"
        >
          Process to Pay
        </Button>
      </div>

      <button
        onClick={onBack}
        className="mt-4 text-xs text-white/30 hover:text-white/60 transition-colors w-full text-center cursor-pointer"
      >
        ← Back to cart
      </button>
    </div>
  );
}
