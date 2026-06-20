"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpCountdown } from "@/components/shared/Otpcountdown";
import Cookies from "js-cookie";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { myFetch } from "../../../../../helpers/myFetch";
import { toast } from "sonner";

const OTP_LENGTH = 4;

export default function OTPVerifyForm() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const userType = searchParams.get("userType");
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => inputRefs.current[0]?.focus(), 100);
    return () => window.clearTimeout(timer);
  }, []);

  const handleChange = (index: number, value: string): void => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (pasteData.length > 0) {
      const newOtp = [...otp];
      pasteData.forEach((char: string, i: number) => {
        if (i < OTP_LENGTH) newOtp[i] = char;
      });
      setOtp(newOtp);

      const nextIndex =
        pasteData.length < OTP_LENGTH ? pasteData.length : OTP_LENGTH - 1;
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerify = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete verification code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await myFetch("/auth/verify-email", {
        method: "POST",
        body: { email, oneTimeCode: Number(code) },
      });

      if (response?.success) {
        toast.success(response?.message || "OTP verified successfully", {
          id: "otp-verify",
        });
        Cookies.remove("otpExpiry");
        if (userType === "forget") {
          router.push(`/new-password?token=${response?.data?.accessToken}`);
        } else {
          router.push(`/auth/login`);
        }
      } else {
        // @ts-ignore
        setError(response?.error[0]?.message);
        if (response?.error && Array.isArray(response.error)) {
          response.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "sign-up" });
          });
        } else {
          toast.error(response?.message || "Something went wrong!", {
            id: "sign-up",
          });
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSuccess = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    const expiryTime = Date.now() + 3 * 60 * 1000;
    Cookies.set("otpExpiry", expiryTime.toString());
    window.setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const isOtpComplete = !otp.includes("");

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-linear-to-b from-[#0F0F0F] to-black text-white font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-white mb-2">Verify OTP</h1>
          <p className="text-gray-400">
            Enter the 4-digit code sent to your email (check Inbox or Spam)
          </p>
        </div>

        <div className="bg-[#141414] p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-center text-xs uppercase tracking-widest text-gray-500 font-semibold">
                Enter Verification Code
              </label>

              <div className="flex justify-center gap-4" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    value={digit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                      handleKeyDown(index, e)
                    }
                    maxLength={1}
                    className="w-16 h-16 text-center text-2xl font-bold rounded-xl border border-[#D4AF37]/20 bg-[#1A1A1A] text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-all placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isOtpComplete}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </Button>

            <OtpCountdown
              email={email}
              onResendSuccess={handleResendSuccess}
            />

            {error && (
              <Alert className="border-red-500/20 bg-red-500/10 text-red-100">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
