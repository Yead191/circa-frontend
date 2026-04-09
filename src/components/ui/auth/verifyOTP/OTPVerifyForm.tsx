"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";
import { myFetch } from "../../../../../helpers/myFetch";
import { toast } from "sonner";
import { OtpCountdown } from "@/components/shared/Otpcountdown";
import Cookies from "js-cookie";


const OTP_LENGTH = 4;

export default function OTPVerifyForm() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const userType = searchParams.get("userType");
  const router = useRouter();


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

      const nextIndex = pasteData.length < OTP_LENGTH ? pasteData.length : OTP_LENGTH - 1;
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
        Cookies.remove("otpExpiry")
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
    setIsExpired(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
    // ⏱️ OTP valid for 2 minutes
    const expiryTime = Date.now() + 3 * 60 * 1000;
    Cookies.set("otpExpiry", expiryTime.toString());
  };

  const isOtpComplete = !otp.includes("");

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-linear-to-b from-[#0F0F0F] to-black text-white font-sans">
      <div className="w-full max-w-md">
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: "linear-gradient(145deg, #a89fe8, #7b6fd4)",
            boxShadow: "0 8px 24px rgba(123, 111, 212, 0.35)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M27 16c0 6.075-4.925 11-11 11S5 22.075 5 16 9.925 5 16 5c3.3 0 6.263 1.452 8.3 3.75"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M22 3.5L24.5 8.5L19.5 9"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

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

              {/* 4-digit OTP inputs — wider gaps since fewer boxes */}
              <div
                className="flex justify-center gap-4"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el: any) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={digit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                      handleKeyDown(index, e)
                    }
                    disabled={isExpired}
                    maxLength={1}
                    className={`w-16 h-16 text-center text-2xl font-bold ${isExpired ? "opacity-50" : ""
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isOtpComplete || isExpired}
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

            {/* Reusable countdown + resend */}
            <OtpCountdown
              email={email}
              onExpire={() => setIsExpired(true)}
              onResendSuccess={handleResendSuccess}
            />

            {error && !isExpired && (
              <div className="text-xs text-red-500 text-center animate-shake">
                {error}
              </div>
            )}
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}