"use client";

import { useState } from "react";
import GetStarted from "./GetStarted";
import Vive from "./Vive";
import Verify from "./Verify";
import ApplicationSubmitted from "./ApplicationSubmitted";
import { myFetch } from "../../../../../helpers/myFetch";
import { toast } from "sonner";
import { revalidateTags } from "../../../../../helpers/revalidateTags";

type Step = "landing" | "vibe" | "verify" | "submitted";

interface VibeData {
  categories: string[];
  friends_and_flirty_mode: boolean;
  friends_and_flirty_category: string[];
}

interface VerifyData {
  username: string;
  date_of_birth: string;
  short_bio: string;
}

interface VerifyFiles {
  avatar: File | null;
  sampleContent: File | null;
}

export default function BecomeCreator({ categories }: { categories: any[] }) {
  // console.log(categories);
  const [step, setStep] = useState<Step>("landing");
  const [vibeData, setVibeData] = useState<VibeData | null>(null);

  const handleVibeComplete = (data: VibeData) => {
    setVibeData(data);
    setStep("verify");
  };

  const handleVerifyComplete = async (data: VerifyData, files: VerifyFiles) => {
    const formData = new FormData();

    if (vibeData) {
      if (vibeData.categories) {
        vibeData.categories.forEach((cat) => formData.append("categories[]", cat));
      }
      formData.append(
        "friends_and_flirty_mode",
        String(vibeData.friends_and_flirty_mode)
      );
      if (vibeData.friends_and_flirty_category) {
        vibeData.friends_and_flirty_category.forEach((cat) =>
          formData.append("friends_and_flirty_category", cat)
        );
      }
    }

    formData.append("username", data.username);
    formData.append("date_of_birth", data.date_of_birth);
    formData.append("short_bio", data.short_bio);

    if (files.avatar) {
      formData.append("image", files.avatar);
    }
    if (files.sampleContent) {
      formData.append("document", files.sampleContent);
    }
    console.log(formData);

    toast.promise(
      myFetch("/user/apply-for-creator", {
        method: "POST",
        body: formData,
      }),
      {
        loading: "Submitting application...",
        success: (res) => {
          if (res?.success) {
            revalidateTags(["user"]);
            setStep("submitted");
            return res?.message;
          }
          throw new Error(res?.message || "Application submission failed");
        },
        error: (err) => err.message || "Error creating chat",
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans px-4 py-10">
      <div className="w-full md:max-w-2xl">
        {step === "landing" && (
          <GetStarted onGetStarted={() => setStep("vibe")} />
        )}

        {step === "vibe" && (
          <Vive categories={categories} onVibeComplete={handleVibeComplete} />
        )}

        {step === "verify" && (
          <Verify onVerifyComplete={handleVerifyComplete} />
        )}

        {step === "submitted" && <ApplicationSubmitted />}
      </div>
    </div>
  );
}
