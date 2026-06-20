'use client';

import React, { useState } from 'react';
import { Mail, Lock, EyeOff, Eye, UserRound, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { myFetch } from '../../../../../helpers/myFetch';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import Image from 'next/image';


export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    try {
      const res = await myFetch("/auth/forget-password", {
        method: "POST",
        body: { email },
      });
      if (res?.success) {
        router.replace(`/verify-otp?email=${email}`);
        toast.success(res?.message || "OTP resent successfully", {
          id: "otp-resend",
        });
      } else {
        toast.error(res?.message || "Failed to resend OTP", {
          id: "otp-resend",
        });
      }
    } catch {
      toast.error("Something went wrong while resending OTP", {
        id: "otp-resend",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await myFetch("/user", { method: "POST", body: { email, name, contact, password } })
      // console.log(response)
      if (!response?.success && response.message === "Account is not verified. Please check your email for verification code.") {
        await handleResend();
        setIsLoading(false);
        return
      }
      if (response?.success) {
        toast.success(response?.message)
        router.replace(`/verify-otp?email=${email}`);
        setIsLoading(false);
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
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div
        className="w-full md:w-md rounded-3xl p-10 flex flex-col items-center"
        style={{ background: '#15151a' }}
      >
        {/* App Icon */}
        <Image
          src="/logo.png"
          alt="Circa Logo"
          width={60}
          height={60}
          className="w-14 h-14"
        />

        {/* Heading */}
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: '#a89fe8', fontFamily: "'DM Sans', sans-serif" }}
        >
          Create an Account
        </h1>
        <p className="text-sm mb-8" style={{ color: '#6b6b7b' }}>
          Get Started with Circa!
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          {/* Full Name */}
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5"
            style={{ background: '#1e1e27' }}
          >
            <UserRound className="w-5 h-5 flex-shrink-0" style={{ color: '#6b6b7b' }} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="flex-1 bg-transparent text-white placeholder-[#6b6b7b] text-sm focus:outline-none"
            />
          </div>

          {/* Email */}
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5"
            style={{ background: '#1e1e27' }}
          >
            <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#6b6b7b' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="flex-1 bg-transparent text-white placeholder-[#6b6b7b] text-sm focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5"
            style={{ background: '#1e1e27' }}
          >
            <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#6b6b7b' }} />
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone No"
              required
              className="flex-1 bg-transparent text-white placeholder-[#6b6b7b] text-sm focus:outline-none"
            />
          </div>

          {/* Password */}
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5"
            style={{ background: '#1e1e27' }}
          >
            <Lock className="w-5 h-5 flex-shrink-0" style={{ color: '#6b6b7b' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="flex-1 bg-transparent text-white placeholder-[#6b6b7b] text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? (
                <Eye className="w-5 h-5" style={{ color: '#6b6b7b' }} />
              ) : (
                <EyeOff className="w-5 h-5" style={{ color: '#6b6b7b' }} />
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #a89fe8, #7b6fd4)',
              boxShadow: '0 4px 20px rgba(123, 111, 212, 0.4)',
            }}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-xs" style={{ color: '#6b6b7b' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium"
            style={{ color: '#a89fe8' }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}