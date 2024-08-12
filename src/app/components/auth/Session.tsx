"use client";

import login from "@/pages/login";
import { useAccessTokenStore } from "@/store/accessToken";
import useAuthStore from "@/store/auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Session() {
  const { data: session } = useSession() as any;
  const { createProfile, login } = useAuthStore((state) => state);
  const setAccessToken = useAccessTokenStore((s: any) => s.setAccessToken);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      console.log(session);
      login(session);
      createProfile(session);
      setAccessToken({ accessToken: session.token });
      // Navigation
      const onboardingStep = session.user["onboarding_data"]?.step;
      console.log(onboardingStep);
      if (onboardingStep) {
        localStorage.setItem("onboarding_step", onboardingStep);
        const isOnboarding =
          onboardingStep === "create_profile" ||
          onboardingStep === "select_interest_topic";
        const redirectPath = isOnboarding ? "/onboard" : "/";
        router.push(redirectPath);
      } else {
        router.push("/");
      }
    }
  }, [session, setAccessToken]);

  return <></>;
}
