"use client";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { myFetch } from "../../../helpers/myFetch";
import { useRouter } from "next/navigation";

interface OtpCountdownProps {
  email: string | null;
  onExpire?: () => void;
  onResendSuccess?: () => void;
}

function getOtpExpiryFromCookie(): number | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("otpExpiry="));
  if (!match) return null;
  const value = match.split("=")[1];
  const expiry = parseInt(value, 10);
  return isNaN(expiry) ? null : expiry;
}

function getRemainingSeconds(): number {
  const expiry = getOtpExpiryFromCookie();
  if (!expiry) return 0;
  const nowMs = Date.now();
  // otpExpiry cookie value is in milliseconds (13-digit) or seconds (10-digit)
  const expiryMs = expiry > 1e12 ? expiry : expiry * 1000;
  const diff = Math.floor((expiryMs - nowMs) / 1000);
  return diff > 0 ? diff : 0;
}

export function OtpCountdown({
  email,
  onExpire,
  onResendSuccess,
}: OtpCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() => getRemainingSeconds());
  const [isResending, setIsResending] = useState(false);

  const isExpired = timeLeft <= 0;
  const router = useRouter();
  useEffect(() => {
    // Re-sync from cookie whenever component mounts or resets
    const initial = getRemainingSeconds();
    setTimeLeft(initial);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      const res = await myFetch("/auth/forget-password", {
        method: "POST",
        body: { email },
      });
      if (res?.success) {
        toast.success(res?.message || "OTP resent successfully", {
          id: "otp-resend",
        });

        // ✅ Set a temporary non-zero value immediately so the
        // timeLeft useEffect doesn't fire onExpire before the
        // cookie is written and re-read.
        setTimeLeft(180);

        setTimeout(() => {
          const newTime = getRemainingSeconds();
          setTimeLeft(newTime > 0 ? newTime : 180);
        }, 300);

        onResendSuccess?.();
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to resend OTP", {
          id: "otp-resend",
        });
      }
    } catch {
      toast.error("Something went wrong while resending OTP", {
        id: "otp-resend",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-end text-xs md:text-sm">


      <button
        type="button"
        onClick={handleResend}
        disabled={isResending || (!isExpired && timeLeft > 120)}
        className="inline-flex items-center gap-1.5 text-xs md:text-sm text-primary hover:text-[#E4C77D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isResending ? (
          <>
            <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <RefreshCcw className="w-3.5 h-3.5" />
            Resend OTP
          </>
        )}
      </button>
    </div>
  );
}